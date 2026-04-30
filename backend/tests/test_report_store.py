from app.report_store import SqliteReportStore


def test_sqlite_report_store_saves_lists_and_deletes_reports(tmp_path):
    store = SqliteReportStore(tmp_path / "reports.db")

    report = store.save_report(
        subject="anon-1",
        input_text="- fixed checkout",
        output_text="# Weekly Update\nDone",
        scenario="manager_update",
        tone="formal",
        length="standard",
        provider="mock-primary",
        model="mock-weekly-report",
        latency_ms=12,
    )

    reports = store.list_reports(subject="anon-1", limit=20)

    assert report.id
    assert len(reports) == 1
    assert reports[0].id == report.id
    assert reports[0].input_summary == "- fixed checkout"
    assert reports[0].scenario == "manager_update"

    deleted = store.delete_report(subject="anon-1", report_id=report.id)

    assert deleted is True
    assert store.list_reports(subject="anon-1", limit=20) == []


def test_sqlite_report_store_limits_history_to_recent_items(tmp_path):
    store = SqliteReportStore(tmp_path / "reports.db")

    for index in range(5):
        store.save_report(
            subject="anon-1",
            input_text=f"note {index}",
            output_text=f"output {index}",
            scenario="weekly_update",
            tone="semi_formal",
            length="concise",
            provider="mock-primary",
            model="mock-weekly-report",
            latency_ms=0,
        )

    reports = store.list_reports(subject="anon-1", limit=3)

    assert len(reports) == 3
    assert reports[0].input_text == "note 4"
    assert reports[2].input_text == "note 2"


def test_sqlite_report_store_records_feedback(tmp_path):
    store = SqliteReportStore(tmp_path / "reports.db")
    report = store.save_report(
        subject="anon-1",
        input_text="note",
        output_text="output",
        scenario="weekly_update",
        tone="semi_formal",
        length="concise",
        provider="mock-primary",
        model="mock-weekly-report",
        latency_ms=0,
    )

    feedback = store.save_feedback(
        subject="anon-1",
        report_id=report.id,
        rating="up",
        comment="Useful output",
    )

    assert feedback.id
    assert feedback.report_id == report.id
    assert feedback.rating == "up"
    assert feedback.comment == "Useful output"
