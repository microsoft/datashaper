from .types import ProgessTicker, ProgressStatus, StatusReportHandler


def progress_ticker(
    progress: StatusReportHandler | None, num_total: int
) -> ProgessTicker:
    """Create a progress-reporting function given a target number of items. 
    
    Every time the returned function is called, the progress handler will be called with the current progress."""
    num_complete = 0
    if progress is not None:
        progress(
            ProgressStatus(
                total_items=num_total,
                completed_items=0,
            )
        )

    def ticker(num_ticks: int = 1) -> None:
        nonlocal num_complete

        num_complete += num_ticks

        if progress is not None:
            progress(
                ProgressStatus(
                    total_items=num_total,
                    completed_items=num_complete,
                )
            )

    return ticker