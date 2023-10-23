#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Callable, Dict

from ..types import Verb
from .aggregate import aggregate
from .bin import bin
from .binarize import binarize
from .boolean import boolean
from .concat import concat
from .convert import convert
from .dedupe import dedupe
from .derive import derive
from .difference import difference
from .erase import erase
from .fill import fill
from .filter import filter
from .fold import fold
from .groupby import groupby
from .impute import impute
from .intersect import intersect
from .join import join
from .lookup import lookup
from .merge import merge
from .onehot import onehot
from .orderby import orderby
from .pivot import pivot
from .recode import recode
from .rename import rename
from .rollup import rollup
from .sample import sample
from .select import select
from .spread import spread
from .unfold import unfold
from .ungroup import ungroup
from .unhot import unhot
from .union import union
from .unorder import unorder
from .unroll import unroll
from .window import window


# This map contains the mapping between all verbs and functions.
functions: Dict[Verb, Callable] = {
    Verb.Aggregate: aggregate,
    Verb.Bin: bin,
    Verb.Binarize: binarize,
    Verb.Boolean: boolean,
    Verb.Concat: concat,
    Verb.Convert: convert,
    Verb.Dedupe: dedupe,
    Verb.Derive: derive,
    Verb.Difference: difference,
    Verb.Erase: erase,
    Verb.Fill: fill,
    Verb.Filter: filter,
    Verb.Fold: fold,
    Verb.Groupby: groupby,
    Verb.Impute: impute,
    Verb.Intersect: intersect,
    Verb.Join: join,
    Verb.Lookup: lookup,
    Verb.Merge: merge,
    Verb.OneHot: onehot,
    Verb.Orderby: orderby,
    Verb.Pivot: pivot,
    Verb.Recode: recode,
    Verb.Rename: rename,
    Verb.Rollup: rollup,
    Verb.Sample: sample,
    Verb.Select: select,
    Verb.Spread: spread,
    Verb.Unfold: unfold,
    Verb.Ungroup: ungroup,
    Verb.Unhot: unhot,
    Verb.Union: union,
    Verb.Unorder: unorder,
    Verb.Unroll: unroll,
    Verb.Window: window,
}
