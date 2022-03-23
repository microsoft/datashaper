/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all,escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type {
	AggregateArgs,
	BinarizeArgs,
	BooleanArgs,
	DedupeArgs,
	EraseArgs,
	FillArgs,
	FilterArgs,
	FoldArgs,
	GroupbyArgs,
	ImputeArgs,
	PivotArgs,
	RecodeArgs,
	RenameArgs,
	RollupArgs,
	SampleArgs,
	SelectArgs,
	SpreadArgs,
	UnrollArgs,
	WindowArgs,
} from '../types.js'
import type { ExprFunctionMap } from './types.js'
import { deriveBoolean } from './util/expressions.js'
import { makeStepNode } from './util/factories.js'
import { compareAll,singleExpression } from './util/index.js'

export const aggregate = makeStepNode<AggregateArgs>(
	(input, { groupby, column, operation, to }) => {
		const expr = singleExpression(column, operation)
		return input.groupby(groupby).rollup({ [to]: expr })
	},
)

export const binarize = makeStepNode<BinarizeArgs>(
	(input, { to, column, criteria, logical }) =>
		input.derive({ [to]: compareAll(column, criteria, logical) }),
)

export const boolean = makeStepNode<BooleanArgs>(
	(input, { columns = [], operator, to }) =>
		input.derive({ [to]: deriveBoolean(columns, operator) }),
)

export const dedupe = makeStepNode<DedupeArgs>((input, { columns }) =>
	columns ? input.dedupe(columns) : input.dedupe(),
)

export const erase = makeStepNode<EraseArgs>(
	(input: ColumnTable, { value, column }: EraseArgs) => {
		const func = escape((d: any) =>
			d[column] === value ? undefined : d[column],
		)
		return input.derive({ [column]: func })
	},
)

export const fill = makeStepNode<FillArgs>((input, { value, to }) => {
	const fn = (_d: any, $: any) => $.value
	return input.params({ value }).derive({ [to]: fn })
})

export const filter = makeStepNode<FilterArgs>(
	(input, { column, criteria, logical }) =>
		input.filter(compareAll(column, criteria, logical)),
)

export const fold = makeStepNode<FoldArgs>((input, { columns, to }) =>
	input.fold(columns, { as: to }),
)

export const groupby = makeStepNode<GroupbyArgs>((input, { columns }) =>
	input.groupby(columns),
)

export const impute = makeStepNode<ImputeArgs>((input, { value, column }) => {
	const dArgs: ExprFunctionMap = {
		[column]: (_d: any, $: any) => $.value,
	}
	return input.params({ value }).impute(dArgs)
})

export const pivot = makeStepNode<PivotArgs>(
	(input, { key, value, operation }) =>
		input.pivot(key, { [value]: singleExpression(value, operation) }),
)

export const recode = makeStepNode<RecodeArgs>((input, { column, to, map }) =>
	input.derive({
		[to]: escape((d: any) => op.recode(d[column], map)),
	}),
)

export const rename = makeStepNode<RenameArgs>((input, { columns }) =>
	input.rename(columns),
)

export const rollup = makeStepNode<RollupArgs>(
	(input, { column, operation, to }) =>
		input.rollup({ [to]: singleExpression(column, operation) }),
)

export const sample = makeStepNode<SampleArgs>(
	(input, { size, proportion }) => {
		const p = Math.round(input.numRows() * (proportion || 1))
		const s = size || p
		return input.sample(s)
	},
)

export const select = makeStepNode<SelectArgs>((input, { columns = [] }) => {
	const expr = [columns] as any
	if (expr.length === 0) {
		expr.push(all())
	}
	return input.select(...expr)
})

export const spread = makeStepNode<SpreadArgs>((input, { to, column }) =>
	input.spread(column, { as: to }),
)

export const ungroup = makeStepNode(input => input.ungroup())

export const unorder = makeStepNode(input => input.unorder())

export const unroll = makeStepNode<UnrollArgs>((input, { columns }) =>
	input.unroll(columns),
)

export const window = makeStepNode<WindowArgs>(
	(input, { column, operation, to }) =>
		input.derive({ [to]: singleExpression(column, operation) }),
)
