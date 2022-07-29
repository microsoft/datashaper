#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Callable, Dict

from data_wrangling_components.engine.verbs.aggregate import aggregate
from data_wrangling_components.engine.verbs.bin import bin
from data_wrangling_components.engine.verbs.binarize import binarize
from data_wrangling_components.engine.verbs.boolean import boolean
from data_wrangling_components.engine.verbs.concat import concat
from data_wrangling_components.engine.verbs.convert import convert
from data_wrangling_components.engine.verbs.dedupe import dedupe
from data_wrangling_components.engine.verbs.derive import derive
from data_wrangling_components.engine.verbs.difference import difference
from data_wrangling_components.engine.verbs.erase import erase
from data_wrangling_components.engine.verbs.fetch import fetch
from data_wrangling_components.engine.verbs.fill import fill
from data_wrangling_components.engine.verbs.filter import filter
from data_wrangling_components.engine.verbs.fold import fold
from data_wrangling_components.engine.verbs.groupby import groupby
from data_wrangling_components.engine.verbs.impute import impute
from data_wrangling_components.engine.verbs.intersect import intersect
from data_wrangling_components.engine.verbs.join import join
from data_wrangling_components.engine.verbs.lookup import lookup
from data_wrangling_components.engine.verbs.merge import merge
from data_wrangling_components.engine.verbs.onehot import onehot
from data_wrangling_components.engine.verbs.orderby import orderby
from data_wrangling_components.engine.verbs.pivot import pivot
from data_wrangling_components.engine.verbs.recode import recode
from data_wrangling_components.engine.verbs.rename import rename
from data_wrangling_components.engine.verbs.rollup import rollup
from data_wrangling_components.engine.verbs.sample import sample
from data_wrangling_components.engine.verbs.select import select
from data_wrangling_components.engine.verbs.spread import spread
from data_wrangling_components.engine.verbs.unfold import unfold
from data_wrangling_components.engine.verbs.ungroup import ungroup
from data_wrangling_components.engine.verbs.unhot import unhot
from data_wrangling_components.engine.verbs.union import union
from data_wrangling_components.engine.verbs.unorder import unorder
from data_wrangling_components.engine.verbs.unroll import unroll
from data_wrangling_components.engine.verbs.window import window
from data_wrangling_components.types import Verb


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
    Verb.Fetch: fetch,
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
