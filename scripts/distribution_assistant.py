#!/usr/bin/env python3
"""Prepare one low-risk distribution draft from local growth docs.

This helper does not publish anything. It picks a draft, rewrites ManagerReady
links with channel-specific UTM parameters, writes docs/today-post.md, and logs
the draft so the next run can move to another item.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
SOCIAL_POSTS = DOCS_DIR / "social-posts.md"
REDDIT_POSTS = DOCS_DIR / "reddit-posts.md"
TODAY_POST = DOCS_DIR / "today-post.md"
LOG_FILE = DOCS_DIR / "distribution-log.csv"
BASE_URL = "https://managerready-ai.vercel.app/"
LOG_FIELDS = [
    "date",
    "channel",
    "item_id",
    "title",
    "campaign",
    "status",
    "post_url",
    "notes",
]


@dataclass(frozen=True)
class Draft:
    item_id: str
    source: str
    title: str
    body: str
    campaign: str
    reddit_comment: str = ""


def read_text(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")
    return path.read_text(encoding="utf-8")


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = value.strip("_")
    return value or "distribution"


def extract_campaign(text: str, fallback: str) -> str:
    match = re.search(r"https://managerready-ai\.vercel\.app/[^\s)>\"]*", text)
    if not match:
        return fallback
    parsed = urlparse(match.group(0))
    query = parse_qs(parsed.query)
    campaign = query.get("utm_campaign", [""])[0]
    return campaign or fallback


def channel_defaults(channel: str) -> tuple[str, str]:
    if channel == "reddit":
        return "reddit", "community"
    if channel == "x":
        return "x", "social"
    if channel == "indiehackers":
        return "indiehackers", "community"
    return "linkedin", "social"


def utm_url(channel: str, campaign: str) -> str:
    source, medium = channel_defaults(channel)
    query = urlencode(
        {
            "utm_source": source,
            "utm_medium": medium,
            "utm_campaign": campaign,
        }
    )
    parsed = urlparse(BASE_URL)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", query, ""))


def rewrite_urls(text: str, channel: str, campaign: str) -> str:
    url = utm_url(channel, campaign)
    return re.sub(r"https://managerready-ai\.vercel\.app/[^\s)>\"]*", url, text)


def parse_social_posts() -> list[Draft]:
    text = read_text(SOCIAL_POSTS)
    pattern = re.compile(r"^###\s+(\d+)\.\s+(.+?)\n(.*?)(?=^###\s+\d+\.|\Z)", re.M | re.S)
    drafts: list[Draft] = []
    for match in pattern.finditer(text):
        number, title, body = match.groups()
        body = body.strip()
        title = title.strip()
        campaign = extract_campaign(body, slugify(title))
        drafts.append(
            Draft(
                item_id=f"social-{int(number):03d}",
                source="social-posts.md",
                title=title,
                body=body,
                campaign=campaign,
            )
        )
    return drafts


def _extract_code_block(section: str, label_pattern: str) -> str:
    pattern = re.compile(label_pattern + r"\s*:\s*\n\s*```text\n(.*?)\n```", re.S | re.I)
    match = pattern.search(section)
    return match.group(1).strip() if match else ""


def parse_reddit_posts() -> list[Draft]:
    text = read_text(REDDIT_POSTS)
    pattern = re.compile(r"^##\s+(\d+)\.\s+(.+?)\n(.*?)(?=^##\s+\d+\.|\Z)", re.M | re.S)
    drafts: list[Draft] = []
    for match in pattern.finditer(text):
        number, fallback_title, section = match.groups()
        title = _extract_code_block(section, r"Title") or fallback_title.strip()
        body = _extract_code_block(section, r"Post")
        comment = _extract_code_block(section, r"(?:Comment if allowed|Optional comment)")
        campaign = extract_campaign(comment or body, slugify(title))
        drafts.append(
            Draft(
                item_id=f"reddit-{int(number):03d}",
                source="reddit-posts.md",
                title=title,
                body=body,
                campaign=campaign,
                reddit_comment=comment,
            )
        )
    return drafts


def ensure_log() -> None:
    if LOG_FILE.exists():
        return
    with LOG_FILE.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=LOG_FIELDS)
        writer.writeheader()


def read_log() -> list[dict[str, str]]:
    ensure_log()
    with LOG_FILE.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def already_used_ids(channel: str) -> set[str]:
    rows = read_log()
    reusable_statuses = {"skipped", "unused"}
    return {
        row["item_id"]
        for row in rows
        if row.get("channel") == channel and row.get("status", "").lower() not in reusable_statuses
    }


def append_log(draft: Draft, channel: str, status: str) -> None:
    ensure_log()
    today = dt.date.today().isoformat()
    with LOG_FILE.open("a", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=LOG_FIELDS)
        writer.writerow(
            {
                "date": today,
                "channel": channel,
                "item_id": draft.item_id,
                "title": draft.title,
                "campaign": draft.campaign,
                "status": status,
                "post_url": "",
                "notes": "Generated by scripts/distribution_assistant.py",
            }
        )


def select_draft(channel: str, index: int | None) -> Draft:
    drafts = parse_reddit_posts() if channel == "reddit" else parse_social_posts()
    if not drafts:
        raise RuntimeError(f"No drafts found for channel: {channel}")

    if index is not None:
        if index < 1 or index > len(drafts):
            raise ValueError(f"--index must be between 1 and {len(drafts)}")
        return drafts[index - 1]

    used = already_used_ids(channel)
    for draft in drafts:
        if draft.item_id not in used:
            return draft
    return drafts[0]


def render_today_post(draft: Draft, channel: str) -> str:
    generated_at = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    body = rewrite_urls(draft.body, channel, draft.campaign)
    link = utm_url(channel, draft.campaign)
    platform_url = {
        "linkedin": "https://www.linkedin.com/feed/",
        "x": "https://x.com/compose/post",
        "reddit": "https://www.reddit.com/submit",
        "indiehackers": "https://www.indiehackers.com/new-post",
    }.get(channel, "")
    lines = [
        "# 今天就做这个",
        "",
        f"Generated: {generated_at}",
        "",
        "## 1. 打开这里",
        "",
        platform_url or channel,
        "",
        "## 2. 复制下面内容发布",
        "",
    ]

    if channel == "reddit":
        comment = rewrite_urls(draft.reddit_comment, channel, draft.campaign)
        lines.extend(
            [
                "### 标题",
                "",
                draft.title,
                "",
                "### 正文",
                "",
                body,
                "",
            ]
        )
        if comment:
            lines.extend(["### 如果社区允许，再发这个评论", "", comment, ""])
        lines.extend(
            [
                "## 3. 发完以后",
                "",
                "- 把帖子链接粘到聊天里，我来帮你记日志。",
                "- 如果社区不允许推广，就不要发链接，只发正文。",
                "",
            ]
        )
    else:
        lines.extend(
            [
                body,
                "",
                "## 3. 发完以后",
                "",
                "- 把帖子链接粘到聊天里，我来帮你记日志。",
                "- 不用手动改 CSV。",
                "",
            ]
        )
    lines.extend(
        [
            "## 记录信息",
            "",
            f"- Channel: {channel}",
            f"- Item: {draft.item_id}",
            f"- Campaign: {draft.campaign}",
            f"- Tracking URL: {link}",
            "",
        ]
    )
    return "\n".join(lines)


def copy_to_clipboard(text: str) -> bool:
    pbcopy = shutil.which("pbcopy")
    if not pbcopy:
        return False
    subprocess.run([pbcopy], input=text, text=True, check=True)
    return True


def list_drafts(channel: str) -> None:
    drafts = parse_reddit_posts() if channel == "reddit" else parse_social_posts()
    for i, draft in enumerate(drafts, start=1):
        print(f"{i:02d}. {draft.item_id} | {draft.title} | {draft.campaign}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prepare one manual distribution draft.")
    parser.add_argument(
        "--channel",
        choices=["linkedin", "x", "reddit", "indiehackers"],
        default="linkedin",
        help="Target channel for UTM generation and queue selection.",
    )
    parser.add_argument("--index", type=int, help="Use a specific 1-based draft index.")
    parser.add_argument("--dry-run", action="store_true", help="Print without writing files.")
    parser.add_argument("--copy", action="store_true", help="Copy the rendered draft to clipboard.")
    parser.add_argument("--list", action="store_true", help="List available drafts for the channel.")
    parser.add_argument(
        "--status",
        default="drafted",
        help="Status to write into docs/distribution-log.csv when not using --dry-run.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.list:
        list_drafts(args.channel)
        return 0

    try:
        draft = select_draft(args.channel, args.index)
        rendered = render_today_post(draft, args.channel)
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    if args.dry_run:
        print(rendered)
        return 0

    TODAY_POST.write_text(rendered, encoding="utf-8")
    append_log(draft, args.channel, args.status)

    copied = False
    if args.copy:
        copied = copy_to_clipboard(rendered)

    print(f"Wrote {TODAY_POST.relative_to(ROOT)}")
    print(f"Logged {draft.item_id} to {LOG_FILE.relative_to(ROOT)}")
    if args.copy:
        print("Copied to clipboard" if copied else "Clipboard copy skipped: pbcopy not found")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
