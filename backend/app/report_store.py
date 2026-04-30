from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Union
from uuid import uuid4


@dataclass(frozen=True)
class StoredReport:
    id: str
    subject: str
    input_text: str
    input_summary: str
    output_text: str
    scenario: str
    tone: str
    length: str
    provider: str
    model: str
    latency_ms: int
    created_at: str


@dataclass(frozen=True)
class StoredFeedback:
    id: str
    subject: str
    report_id: str
    rating: str
    comment: str
    created_at: str


class SqliteReportStore:
    def __init__(self, db_path: Union[str, Path]):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def save_report(
        self,
        *,
        subject: str,
        input_text: str,
        output_text: str,
        scenario: str,
        tone: str,
        length: str,
        provider: str,
        model: str,
        latency_ms: int,
    ) -> StoredReport:
        report = StoredReport(
            id=str(uuid4()),
            subject=subject,
            input_text=input_text,
            input_summary=_summary(input_text),
            output_text=output_text,
            scenario=scenario,
            tone=tone,
            length=length,
            provider=provider,
            model=model,
            latency_ms=latency_ms,
            created_at=_now_iso(),
        )
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO reports (
                    id, subject, input_text, input_summary, output_text, scenario, tone, length,
                    provider, model, latency_ms, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    report.id,
                    report.subject,
                    report.input_text,
                    report.input_summary,
                    report.output_text,
                    report.scenario,
                    report.tone,
                    report.length,
                    report.provider,
                    report.model,
                    report.latency_ms,
                    report.created_at,
                ),
            )
        return report

    def list_reports(self, *, subject: str, limit: int = 20) -> list[StoredReport]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT id, subject, input_text, input_summary, output_text, scenario, tone, length,
                       provider, model, latency_ms, created_at
                FROM reports
                WHERE subject = ?
                ORDER BY created_at DESC, rowid DESC
                LIMIT ?
                """,
                (subject, limit),
            ).fetchall()
        return [_report_from_row(row) for row in rows]

    def delete_report(self, *, subject: str, report_id: str) -> bool:
        with self._connect() as connection:
            cursor = connection.execute(
                "DELETE FROM reports WHERE subject = ? AND id = ?",
                (subject, report_id),
            )
        return cursor.rowcount > 0

    def save_feedback(
        self,
        *,
        subject: str,
        report_id: str,
        rating: str,
        comment: str = "",
    ) -> StoredFeedback:
        feedback = StoredFeedback(
            id=str(uuid4()),
            subject=subject,
            report_id=report_id,
            rating=rating,
            comment=comment,
            created_at=_now_iso(),
        )
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO feedback (id, subject, report_id, rating, comment, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    feedback.id,
                    feedback.subject,
                    feedback.report_id,
                    feedback.rating,
                    feedback.comment,
                    feedback.created_at,
                ),
            )
        return feedback

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _init_db(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS reports (
                    id TEXT PRIMARY KEY,
                    subject TEXT NOT NULL,
                    input_text TEXT NOT NULL,
                    input_summary TEXT NOT NULL,
                    output_text TEXT NOT NULL,
                    scenario TEXT NOT NULL,
                    tone TEXT NOT NULL,
                    length TEXT NOT NULL,
                    provider TEXT NOT NULL,
                    model TEXT NOT NULL,
                    latency_ms INTEGER NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS feedback (
                    id TEXT PRIMARY KEY,
                    subject TEXT NOT NULL,
                    report_id TEXT NOT NULL,
                    rating TEXT NOT NULL,
                    comment TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            connection.execute(
                "CREATE INDEX IF NOT EXISTS idx_reports_subject_created ON reports(subject, created_at)"
            )


def _summary(text: str, limit: int = 50) -> str:
    compact = " ".join(text.split())
    return compact[:limit]


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _report_from_row(row: sqlite3.Row) -> StoredReport:
    return StoredReport(
        id=row["id"],
        subject=row["subject"],
        input_text=row["input_text"],
        input_summary=row["input_summary"],
        output_text=row["output_text"],
        scenario=row["scenario"],
        tone=row["tone"],
        length=row["length"],
        provider=row["provider"],
        model=row["model"],
        latency_ms=row["latency_ms"],
        created_at=row["created_at"],
    )
