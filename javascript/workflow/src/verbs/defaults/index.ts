/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { inputColumnList } from './inputColumnList.js'
import { outputColumn } from './outputColumn.js'

const empty: () => any = () => ({})

export { bin } from './bin.js'
export { binarize } from './binarize.js'
export { boolean } from './boolean.js'
export { convert } from './convert.js'
export { copy } from './copy.js'
export { destructure } from './destructure.js'
export { filter } from './filter.js'
export { fold } from './fold.js'
export { join } from './join.js'
export { lookup } from './lookup.js'
export { merge } from './merge.js'
export { pivot } from './pivot.js'
export { print } from './print.js'
export { spread } from './spread.js'
export { unfold } from './unfold.js'
export { unhot } from './unhot.js'

export const aggregate = outputColumn
export const dedupe = inputColumnList
export const derive = outputColumn
export const drop = inputColumnList
export const erase = inputColumnList
export const fill = outputColumn
export const groupby = inputColumnList
export const impute = inputColumnList
export const rollup = outputColumn
export const select = inputColumnList
export const unroll = inputColumnList
export const window = outputColumn

export const strings = {
	replace: outputColumn,
	lower: outputColumn,
	upper: outputColumn,
}

export const decode = empty
export const encode = empty
export const concat = empty
export const difference = empty
export const intersect = empty
export const onehot = empty
export const orderby = empty
export const recode = empty
export const rename = empty
export const sample = empty
export const ungroup = empty
export const union = empty
export const unorder = empty
export const workflow = empty
