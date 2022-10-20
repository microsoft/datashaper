#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Callable, Dict

from datashaper.engine.verbs.aggregate import aggregate
from datashaper.engine.verbs.bin import bin
from datashaper.engine.verbs.binarize import binarize
from datashaper.engine.verbs.boolean import boolean
from datashaper.engine.verbs.concat import concat
from datashaper.engine.verbs.convert import convert
from datashaper.engine.verbs.dedupe import dedupe
from datashaper.engine.verbs.derive import derive
from datashaper.engine.verbs.difference import difference
from datashaper.engine.verbs.erase import erase
from datashaper.engine.verbs.fill import fill
from datashaper.engine.verbs.filter import filter
from datashaper.engine.verbs.fold import fold
from datashaper.engine.verbs.groupby import groupby
from datashaper.engine.verbs.impute import impute
from datashaper.engine.verbs.intersect import intersect
from datashaper.engine.verbs.join import join
from datashaper.engine.verbs.lookup import lookup
from datashaper.engine.verbs.merge import merge
from datashaper.engine.verbs.onehot import onehot
from datashaper.engine.verbs.orderby import orderby
from datashaper.engine.verbs.pivot import pivot
from datashaper.engine.verbs.recode import recode
from datashaper.engine.verbs.rename import rename
from datashaper.engine.verbs.rollup import rollup
from datashaper.engine.verbs.sample import sample
from datashaper.engine.verbs.select import select
from datashaper.engine.verbs.spread import spread
from datashaper.engine.verbs.unfold import unfold
from datashaper.engine.verbs.ungroup import ungroup
from datashaper.engine.verbs.unhot import unhot
from datashaper.engine.verbs.union import union
from datashaper.engine.verbs.unorder import unorder
from datashaper.engine.verbs.unroll import unroll
from datashaper.engine.verbs.window import window
from datashaper.types import Verb


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
