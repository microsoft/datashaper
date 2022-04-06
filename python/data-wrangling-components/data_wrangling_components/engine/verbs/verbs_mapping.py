#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.aggregate import aggregate
from data_wrangling_components.engine.verbs.bin import bin
from data_wrangling_components.engine.verbs.binarize import binarize
from data_wrangling_components.engine.verbs.concat import concat
from data_wrangling_components.engine.verbs.dedupe import dedupe
from data_wrangling_components.engine.verbs.derive import derive
from data_wrangling_components.engine.verbs.difference import difference
from data_wrangling_components.engine.verbs.fetch import fetch
from data_wrangling_components.engine.verbs.fill import fill
from data_wrangling_components.engine.verbs.filter import filter
from data_wrangling_components.engine.verbs.fold import fold
from data_wrangling_components.engine.verbs.groupby import groupby
from data_wrangling_components.engine.verbs.impute import impute
from data_wrangling_components.engine.verbs.intersect import intersect
from data_wrangling_components.engine.verbs.join import join
from data_wrangling_components.engine.verbs.lookup import lookup
from data_wrangling_components.engine.verbs.orderby import orderby
from data_wrangling_components.engine.verbs.recode import recode
from data_wrangling_components.engine.verbs.rename import rename
from data_wrangling_components.engine.verbs.rollup import rollup
from data_wrangling_components.engine.verbs.sample import sample
from data_wrangling_components.engine.verbs.select import select
from data_wrangling_components.engine.verbs.spread import spread
from data_wrangling_components.engine.verbs.ungroup import ungroup
from data_wrangling_components.engine.verbs.union import union
from data_wrangling_components.engine.verbs.unorder import unorder
from data_wrangling_components.engine.verbs.unroll import unroll
from data_wrangling_components.types import Verb


# This map contains the mapping between all verbs and functions.
functions = {
    Verb.Aggregate: aggregate,
    Verb.Bin: bin,
    Verb.Binarize: binarize,
    Verb.Concat: concat,
    Verb.Dedupe: dedupe,
    Verb.Derive: derive,
    Verb.Difference: difference,
    Verb.Fetch: fetch,
    Verb.Fill: fill,
    Verb.Filter: filter,
    Verb.Fold: fold,
    Verb.Groupby: groupby,
    Verb.Impute: impute,
    Verb.Intersect: intersect,
    Verb.Join: join,
    Verb.Lookup: lookup,
    Verb.Orderby: orderby,
    Verb.Recode: recode,
    Verb.Rename: rename,
    Verb.Rollup: rollup,
    Verb.Sample: sample,
    Verb.Select: select,
    Verb.Spread: spread,
    Verb.Ungroup: ungroup,
    Verb.Union: union,
    Verb.Unorder: unorder,
    Verb.Unroll: unroll,
}
