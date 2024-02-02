import importlib
import importlib.util
import logging
import os
import pkgutil
import sys

from .verb_input import VerbInput
from .verbs_mapping import VerbDetails, VerbManager, verb


logger = logging.getLogger(__name__)


def load_verbs(module):
    """
    Loads the verbs from the given module path recursively.
    This is useful to run all the @verb decorators and register the verbs in the verb manager.
    """
    module_path = os.path.dirname(module.__file__)
    module_name = module.__name__
    for _, sub_module, is_module in pkgutil.iter_modules([module_path]):
        if not is_module:
            full_path = os.path.join(module_path, f"{sub_module}.py")
            module = importlib.util.spec_from_file_location(module_name, full_path)
            if module is not None:
                module_to_load = f"{module.name}.{sub_module}"
                importlib.import_module(module_to_load)
                logger.info(f"Found module: {module_to_load}")
        else:
            full_path = os.path.join(module_path, sub_module)
            sub_module_name = f"{module_name}.{sub_module}"
            sub_module_rec = importlib.import_module(sub_module_name)
            load_verbs(sub_module_rec)


# Load core verbs into VerbManager
mod = sys.modules[__name__]
load_verbs(mod)


__all__ = ["VerbInput", "VerbManager", "load_verbs", "verb", "VerbDetails"]
