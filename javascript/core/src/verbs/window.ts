/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnArgs, OutputColumnArgs } from './types.js'
import { singleExpression } from './util/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

/**
 * These are operations that perform windowed compute.
 * See https://uwdata.github.io/arquero/api/op#window-functions
 */
export enum WindowFunction {
	RowNumber = 'row_number',
	Rank = 'rank',
	PercentRank = 'percent_rank',
	CumulativeDistribution = 'cume_dist',
	FirstValue = 'first_value',
	LastValue = 'last_value',
	FillDown = 'fill_down',
	FillUp = 'fill_up',
}

export interface WindowArgs extends InputColumnArgs, OutputColumnArgs {
	operation: WindowFunction
}

export const windowStep: TableStep<WindowArgs> = (
	input,
	{ column, operation, to },
) => input.derive({ [to]: singleExpression(column, operation) })

export const window = stepNodeFactory(windowStep)
