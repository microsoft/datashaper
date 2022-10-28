/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs, Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'

import { EMPTY_OBJECT } from '../empty.js'
import type { StepChangeFunction } from '../types.js'

export function useColumnValues(
	step: Step<RecodeArgs>,
	table?: ColumnTable,
): Value[] {
	return useMemo(() => {
		const { column } = step.args
		if (!table || !column) {
			return []
		}
		const args = {
			[column]: op.array_agg_distinct(column),
		}
		const rollup = table.orderby(column).rollup(args)
		return rollup.get(column, 0)
	}, [table, step])
}

export function useHandleKeyChange(
	step: Step<RecodeArgs>,
	onChange?: StepChangeFunction<RecodeArgs>,
): (previousKey: Value, newKey: Value) => void {
	return useCallback(
		(previousKey, newKey) => {
			const mapList = {
				...step.args.mapping,
			}

			const mapping: Record<Value, Value> = {}

			for (const key in mapList) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				key === previousKey.toString()
					? (mapping[newKey] = mapList[key])
					: (mapping[key] = mapList[key]!)
			}

			onChange?.({
				...step,
				args: {
					...step.args,
					mapping,
				},
			})
		},
		[step, onChange],
	)
}

export function useHandleValueChange(
	step: Step<RecodeArgs>,
	dataType: DataType,
	onChange?: StepChangeFunction<RecodeArgs>,
): (key: Value, newValue: Value) => void {
	return useCallback(
		(key, newValue) => {
			const mapList = {
				...step.args.mapping,
			}

			const mapping: Record<Value, Value> = {}

			for (const keyElement in mapList) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				keyElement === key.toString()
					? (mapping[keyElement] =
							dataType === DataType.Date ? new Date(newValue) : newValue)
					: (mapping[keyElement] = mapList[keyElement]!)
			}

			onChange?.({
				...step,
				args: {
					...step.args,
					mapping,
				},
			})
		},
		[step, onChange, dataType],
	)
}

export function useRecodeDelete(
	step: Step<RecodeArgs>,
	onChange?: StepChangeFunction<RecodeArgs>,
): (value: Value) => void {
	return useCallback(
		value => {
			const args = { ...step.args } as RecodeArgs
			delete args.mapping[value]
			onChange?.({
				...step,
				args: {
					...step.args,
					...args,
				},
			})
		},
		[step, onChange],
	)
}

// find the next value from the table to suggest
function next(step: Step<RecodeArgs>, values: Value[]): Value | undefined {
	return values.find(value => {
		if (!step.args.mapping) {
			return true
		}
		return step.args.mapping[value] == null
	})
}

export function useHandleAddButtonClick(
	step: Step<RecodeArgs>,
	values: Value[],
	onChange?: StepChangeFunction<RecodeArgs>,
): () => void {
	return useCallback(() => {
		const nextValue = next(step, values)

		if (nextValue != null) {
			// could be a 0 or false...
			onChange?.({
				...step,
				args: {
					...step.args,
					mapping: {
						...step.args.mapping,
						[nextValue]: nextValue,
					},
				},
			})
		}
	}, [step, values, onChange])
}

export function useDisabled(step: Step<RecodeArgs>, values: Value[]): boolean {
	if (values.length === 0 || !step.args.column) {
		return true
	}
	return values.length === Object.keys(step.args.mapping || EMPTY_OBJECT).length
}
