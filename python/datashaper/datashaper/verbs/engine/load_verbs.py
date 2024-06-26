"""A package containing the base verbs."""

import importlib
import importlib.util
import logging
import pkgutil
from pathlib import Path
from types import ModuleType

logger = logging.getLogger(__name__)


def load_verbs(module: ModuleType) -> None:
    """
    Load the verbs from the given module path recursively.

    This is useful to run all the @verb decorators and register the verbs in the verb manager.
    """
    if module.__file__ is None:
        return

    module_path = Path(module.__file__).parent
    module_name = module.__name__
    for _, sub_module, is_module in pkgutil.iter_modules([str(module_path)]):
        if not is_module:
            full_path = Path(module_path) / f"{sub_module}.py"
            module_spec = importlib.util.spec_from_file_location(
                module_name, str(full_path)
            )
            if module_spec is not None:
                module_to_load = f"{module_spec.name}.{sub_module}"
                importlib.import_module(module_to_load)
                logger.info("Found module: %s", module_to_load)
        else:
            full_path = Path(module_path) / sub_module
            sub_module_name = f"{module_name}.{sub_module}"
            sub_module_rec = importlib.import_module(sub_module_name)
            load_verbs(sub_module_rec)
