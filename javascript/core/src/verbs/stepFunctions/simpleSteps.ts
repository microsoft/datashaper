/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all, escape, op } from 'arquero'
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
} from '../types/types.js'
import { deriveBoolean } from '../util/expressions.js'
import type { TableStep } from '../factories/index.js'
import { compareAll, singleExpression } from '../util/index.js'
import type { ExprFunctionMap } from '../util/types.js'

export const aggregateStep: TableStep<AggregateArgs> = (
	input,
	{ groupby, column, operation, to },
) => {
	const expr = singleExpression(column, operation)
	return input.groupby(groupby).rollup({ [to]: expr })
}

export const binarizeStep: TableStep<BinarizeArgs> = (
	input,
	{ to, column, criteria, logical },
) => input.derive({ [to]: compareAll(column, criteria, logical) })

export const booleanStep: TableStep<BooleanArgs> = (
	input,
	{ columns = [], operator, to },
) => input.derive({ [to]: deriveBoolean(columns, operator) })

export const dedupeStep: TableStep<DedupeArgs> = (input, { columns }) =>
	columns ? input.dedupe(columns) : input.dedupe()

export const eraseStep: TableStep<EraseArgs> = (
	input: ColumnTable,
	{ value, column }: EraseArgs,
) => {
	const func = escape((d: any) => (d[column] === value ? undefined : d[column]))
	return input.derive({ [column]: func })
}

export const fillStep: TableStep<FillArgs> = (input, { value, to }) => {
	const fn = (_d: any, $: any) => $.value
	return input.params({ value }).derive({ [to]: fn })
}

export const filterStep: TableStep<FilterArgs> = (
	input,
	{ column, criteria, logical },
) => input.filter(compareAll(column, criteria, logical))

export const foldStep: TableStep<FoldArgs> = (input, { columns, to }) =>
	input.fold(columns, { as: to })

export const groupbyStep: TableStep<GroupbyArgs> = (input, { columns }) =>
	input.groupby(columns)

export const imputeStep: TableStep<ImputeArgs> = (input, { value, column }) => {
	const dArgs: ExprFunctionMap = {
		[column]: (_d: any, $: any) => $.value,
	}
	return input.params({ value }).impute(dArgs)
}

export const pivotStep: TableStep<PivotArgs> = (
	input,
	{ key, value, operation },
) => input.pivot(key, { [value]: singleExpression(value, operation) })

export const recodeStep: TableStep<RecodeArgs> = (input, { column, to, map }) =>
	input.derive({
		[to]: escape((d: any) => op.recode(d[column], map)),
	})

export const renameStep: TableStep<RenameArgs> = (input, { columns }) =>
	input.rename(columns)

export const rollupStep: TableStep<RollupArgs> = (
	input,
	{ column, operation, to },
) => input.rollup({ [to]: singleExpression(column, operation) })

export const sampleStep: TableStep<SampleArgs> = (
	input,
	{ size, proportion },
) => {
	const p = Math.round(input.numRows() * (proportion || 1))
	const s = size || p
	return input.sample(s)
}

export const selectStep: TableStep<SelectArgs> = (input, { columns = [] }) => {
	const expr = [columns] as any
	if (expr.length === 0) {
		expr.push(all())
	}
	return input.select(...expr)
}

export const spreadStep: TableStep<SpreadArgs> = (input, { to, column }) =>
	input.spread(column, { as: to })

export const ungroupStep: TableStep<void> = input => input.ungroup()
export const unorderStep: TableStep<void> = input => input.unorder()

export const unrollStep: TableStep<UnrollArgs> = (input, { columns }) =>
	input.unroll(columns)

export const windowStep: TableStep<WindowArgs> = (
	input,
	{ column, operation, to },
) => input.derive({ [to]: singleExpression(column, operation) })
