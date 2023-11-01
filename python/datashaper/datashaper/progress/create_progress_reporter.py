# Print iterations progress
# https://stackoverflow.com/a/34325723
import uuid

from rich.console import Console, Group
from rich.live import Live
from rich.progress import Progress, TaskID, TimeElapsedColumn
from rich.spinner import Spinner
from rich.tree import Tree

from .types import ProgressStatus, StatusReportHandler


class ProgressReportContext:
    console: Console
    _group: Group
    tree: Tree
    _live: Live

    def __init__(self):
        print("CREATE ROOT PROGRESS REPORTER")
        self.console = Console()
        self._group = Group(Spinner("dots", "Executing Pipeline..."), fit=True)
        self.tree = Tree(self._group)
        self._live  = Live(
            self.tree, console=self.console, refresh_per_second=4, vertical_overflow="crop"
        )
        self._live.start()

root_context = ProgressReportContext()
progress_trees: dict[str, Tree] = {}


# TODO: This progress logic needs to be rethought
def  create_progress_reporter(
    prefix: str, parent: StatusReportHandler | None = None, transient=True
) -> StatusReportHandler:
    
    task: TaskID | None = None
    id = uuid.uuid4().hex

    progress_columns = [*Progress.get_default_columns(), TimeElapsedColumn()]
    progress_ele = Progress(*progress_columns, console=root_context.console, transient=transient)

    progress_tree = Tree(prefix)
    progress_tree.add(progress_ele)
    progress_trees[id] = progress_tree
    progress_tree.hide_root = True

    parent_tree: Tree
    if parent is not None:
        parent_tree = progress_trees[parent.__progress_id__]
        parent_tree.hide_root = False
    else:
        parent_tree = root_context.tree
    parent_tree.add(progress_tree)

    def handle_progress(progress_update: ProgressStatus):
        nonlocal task
        if task is None:
            task = progress_ele.add_task(prefix)
        progress_description = ""
        if progress_update.description is not None:
            progress_description = f" - {progress_update.description}"

        completed = progress_update.completed_items or progress_update.progress
        total = progress_update.total_items or 1
        progress_ele.update(
            task,
            completed=completed,
            total=total,
            description=f"{prefix}{progress_description}",
        )

        if completed == total:
            if transient:
                progress_ele.update(task, visible=False)

        # Force a refresh of the progress bars, THIS IS SLOW
        # live.refresh()

    # assign a unique id to the progress handler for looking up later
    handle_progress.__progress_id__ = id
    handle_progress.__progress_name__ = prefix

    return handle_progress
