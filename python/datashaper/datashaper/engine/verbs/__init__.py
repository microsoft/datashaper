import importlib
import importlib.util
import logging
import os
import pkgutil

from .verb_input import VerbInput
from .verbs_mapping import VerbManager, verb


logger = logging.getLogger(__name__)


def load_verbs(module_path: str, module_name: str):
    """
    Loads the verbs from the given module path recursively.
    This is useful to run all the @verb decorators and register the verbs in the verb manager.
    """
    for _, sub_module, is_module in pkgutil.iter_modules([module_path]):
        if not is_module:
            full_path = os.path.join(module_path, f"{sub_module}.py")
            module = importlib.util.spec_from_file_location(module_name, full_path)
            module_to_load = f"{module.name}.{sub_module}"
            importlib.import_module(module_to_load)
            logger.info(f"Found module: {module_to_load}")
        else:
            full_path = os.path.join(module_path, sub_module)
            sub_module_name = f"{__name__}.{sub_module}"
            load_verbs(full_path, sub_module_name)


load_verbs(os.path.dirname(__file__), __name__)


__all__ = ["VerbInput", "VerbManager", "load_verbs", "verb"]
