# ManagerReady AI Distribution Plan

Date: 2026-05-09

## Goal

Get the first useful traffic for ManagerReady AI without relying only on slow SEO indexing.

The goal for the next 14 days is not brand awareness in the abstract. The goal is to create enough real visits and generation attempts to learn:

- Which audience cares most: engineers, product managers, freelancers, remote workers, or non-native English professionals.
- Which message converts: weekly updates, manager updates, client emails, blockers, or performance review summaries.
- Which channels bring users who actually click generate.

## Distribution Principle

Do not post "I built an AI tool" everywhere.

Lead with a useful work communication artifact:

- A before/after example
- A copyable weekly update template
- A blocker/risk phrasing example
- A client update email structure
- A non-native English writing tip

Then mention ManagerReady AI lightly as the tool that turns rough notes into this kind of output.

## Primary URL

Use the live frontend URL:

```text
https://managerready-ai.vercel.app
```

## UTM Rules

Use UTM links so PostHog can show which sources create generator actions.

Format:

```text
https://managerready-ai.vercel.app/?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}
```

Recommended sources:

- `linkedin`
- `x`
- `reddit`
- `indiehackers`
- `producthunt`
- `hackernews`
- `directory`
- `direct_outreach`

Recommended campaigns:

- `weekly_update_template`
- `manager_update_before_after`
- `client_update_email`
- `blockers_and_risks`
- `non_native_english`
- `producthunt_launch`
- `directory_submission`

Examples:

```text
https://managerready-ai.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=weekly_update_template
https://managerready-ai.vercel.app/?utm_source=reddit&utm_medium=community&utm_campaign=non_native_english
https://managerready-ai.vercel.app/?utm_source=producthunt&utm_medium=launch&utm_campaign=producthunt_launch
https://managerready-ai.vercel.app/?utm_source=directory&utm_medium=listing&utm_campaign=directory_submission
```

## Local Distribution Assistant

For daily execution, use the simplified checklist in `docs/daily-distribution.md`.
The short version is: generate one post, publish it manually, then send the live
post URL back to Codex so the log can be updated for you.

Use the local helper to prepare one manual post at a time:

```bash
python3 scripts/distribution_assistant.py --channel linkedin
```

This writes:

- `docs/today-post.md` with the selected draft, rewritten UTM link, and publish checklist
- `docs/distribution-log.csv` with the generated item and `drafted` status

Supported channels:

```bash
python3 scripts/distribution_assistant.py --channel linkedin
python3 scripts/distribution_assistant.py --channel x
python3 scripts/distribution_assistant.py --channel reddit
python3 scripts/distribution_assistant.py --channel indiehackers
```

Useful options:

```bash
python3 scripts/distribution_assistant.py --channel reddit --dry-run
python3 scripts/distribution_assistant.py --channel linkedin --list
python3 scripts/distribution_assistant.py --channel x --index 5
python3 scripts/distribution_assistant.py --channel linkedin --copy
```

The helper never publishes automatically. After manual publishing, update
`docs/distribution-log.csv` with the live post URL and change `status` from
`drafted` to `posted`.

## 14-Day Distribution Sprint

### Day 1: Prepare

- Confirm the live app works from a clean browser session.
- Confirm PostHog receives `page_view`, `generate_clicked`, and `generate_success`.
- Generate today's first draft with `python3 scripts/distribution_assistant.py --channel linkedin`.
- Preview Reddit options with `python3 scripts/distribution_assistant.py --channel reddit --list`.
- Save the UTM links above.

### Day 2: First Soft Launch

- Post 1 LinkedIn or X before/after example.
- Share the app with 3 people who regularly write English status updates.
- Submit to 3 AI directories from `docs/directory-submissions.csv`.

### Day 3: Reddit Value Post

- Post 1 Reddit-style template post in a relevant community.
- Do not lead with the link.
- Add the product link only if allowed by community rules, or place it in a comment.
- Submit to 3 more directories.

### Day 4: Indie Hackers or Builder Community

- Post a build-in-public note: what problem the product solves, what is live, what feedback is needed.
- Use a direct, practical title.
- Reply to every comment manually.

### Day 5: Social Proof Attempt

- Post a concise example aimed at non-native English speakers.
- Ask one specific question at the end: "Would this help with weekly updates, manager updates, or client emails?"
- Submit to 3 more directories.

### Day 6: Engineer Angle

- Post an engineering weekly report before/after.
- Target software engineers and engineering managers.
- Watch whether `engineering_update` source pages produce generate clicks.

### Day 7: Review Data

Review PostHog:

- Top referrers
- Top UTM campaigns
- `generate_clicked` by source
- `generate_success` by source
- Drop-off from page view to generate click
- Any `quota_reached` events

Write notes in `docs/distribution-results.md` if useful.

### Day 8: Client Email Angle

- Post a client update email template.
- Use freelancer, agency, consultant, or project delivery language.
- Submit to 3 more directories.

### Day 9: Reddit Follow-Up

- Post a new value-first Reddit post about blockers and risks.
- Avoid reposting the same product pitch.
- Answer comments with examples, not sales copy.

### Day 10: Product Hunt Draft

- Create a Product Hunt draft using `docs/launch-kit.md`.
- Do not launch immediately if the assets feel thin.
- Prepare screenshots or a short demo video separately.

### Day 11: Performance Review Angle

- Post a self-review or promotion summary example.
- This is useful because the use case has high pain and high willingness to save polished wording.

### Day 12: Directory Catch-Up

- Submit to the remaining high-priority directories.
- Mark submitted rows in `docs/directory-submissions.csv`.
- Skip paid-only directories for now unless they are clearly high quality.

### Day 13: Show HN Preparation

- Prepare a short `Show HN` draft.
- Only post if the app is fast, stable, and clear for first-time visitors.
- Title option: `Show HN: ManagerReady AI - turn rough work notes into polished updates`

### Day 14: Decide What To Double Down On

Choose one of these based on data:

- If LinkedIn/X gets clicks: continue daily examples.
- If Reddit gets comments: create more community-native templates.
- If directories get visits: finish more listings and add backlinks.
- If search pages start getting impressions: build more tool and prompt pages.
- If everyone bounces: improve homepage clarity and generator first-run experience.

## Weekly Cadence After Sprint

If the 14-day sprint shows any signal, continue with this low-effort rhythm:

- 3 social posts per week
- 1 Reddit/community value post per week
- 5 directory submissions per week until the obvious list is exhausted
- 1 new high-intent page per week only when it maps to a real query
- 1 analytics review per week

## Channels

### LinkedIn

Best for:

- Non-native English professionals
- Product managers
- Remote workers
- Career and performance review use cases

Post style:

- Short practical tip
- Before/after
- Copyable template
- One light link at the end

### X

Best for:

- Builders
- Indie hackers
- Short examples
- Public product iteration

Post style:

- One clear pain point
- A concrete example
- A link with UTM

### Reddit

Best for:

- Learning pain language
- Getting direct objections
- Finding niche audiences

Post style:

- Value-first
- Community-native
- Link only when allowed
- No repeated cross-posting of the same pitch

Possible communities to research manually before posting:

- r/productivity
- r/remotework
- r/EnglishLearning
- r/nonprofit? only if relevant to work updates
- r/freelance
- r/consulting
- r/ExperiencedDevs
- r/cscareerquestions
- r/ProductManagement
- r/SideProject
- r/SaaS

Each subreddit has its own rules. Check rules before posting.

### Indie Hackers

Best for:

- Founder feedback
- Build-in-public
- Early adopter discovery

Post style:

- "I built X because Y"
- Include what is live and what kind of feedback you want
- Ask a specific question

### Hacker News

Best for:

- Developer audience
- Product critique
- Serious feedback

Post style:

- Simple `Show HN` title
- No exaggerated claims
- Be ready for blunt comments

### Product Hunt

Best for:

- Launch spike
- Social proof
- Backlinks
- Product feedback

Do this after:

- App is stable
- Homepage explains value in seconds
- Screenshots and maker comment are ready
- You can respond for the launch day

## Metrics

Track these every week:

- Unique visitors
- Top UTM source
- Top UTM campaign
- Generate click rate
- Generate success rate
- Copy/refine usage
- Quota reached
- Returning visitors
- Top landing page

Do not optimize for likes. Optimize for:

- People who click generate
- People who copy output
- People who come back
- Comments that reveal a real work communication pain

## What Codex Can Keep Doing

- Write more post variants based on winning angles.
- Create new landing pages only for validated queries.
- Add UTM tracking helpers.
- Add new examples/templates to growth pages.
- Prepare weekly distribution reports from PostHog exports if data is available.
