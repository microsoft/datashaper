/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs, Step } from '@data-wrangling-components/core'
import type { Value } from '@essex/arquero'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo } from 'react'

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
				...step.args.map,
			}

			const map: Record<string, string> = {}

			for (const key in mapList) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				key === previousKey.toString()
					? (map[newKey] = mapList[key])
					: (map[key] = mapList[key]!)
			}

			onChange?.({
				...step,
				args: {
					...step.args,
					map,
				},
			})
		},
		[step, onChange],
	)
}

export function useHandleValueChange(
	step: Step<RecodeArgs>,
	onChange?: StepChangeFunction<RecodeArgs>,
): (key: Value, newValue: Value) => void {
	return useCallback(
		(key, newValue) => {
			const mapList = {
				...step.args.map,
			}

			const map: Record<string, string> = {}

			for (const keyElement in mapList) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				keyElement === key.toString()
					? (map[keyElement] = newValue)
					: (map[keyElement] = mapList[keyElement]!)
			}

			onChange?.({
				...step,
				args: {
					...step.args,
					map,
				},
			})
		},
		[step, onChange],
	)
}

export function useRecodeDelete(
	step: Step<RecodeArgs>,
	onChange?: StepChangeFunction<RecodeArgs>,
): (value: Value) => void {
	return useCallback(
		value => {
			const args = { ...step.args } as RecodeArgs
			delete args.map[value]
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
		if (!step.args.map) {
			return true
		}
		return step.args.map[value] === undefined
	})
}

export function useHandleAddButtonClick(
	step: Step<RecodeArgs>,
	values: Value[],
	onChange?: StepChangeFunction<RecodeArgs>,
): () => void {
	return useCallback(() => {
		const nextValue = next(step, values)

		if (nextValue !== undefined) {
			// could be a 0 or false...
			onChange?.({
				...step,
				args: {
					...step.args,
					map: {
						...step.args.map,
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
	return values.length === Object.keys(step.args.map || {}).length
}
