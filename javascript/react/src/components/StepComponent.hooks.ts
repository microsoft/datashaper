/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	GraphManager,
	InputColumnArgs,
	OutputColumnArgs,
	Step,
} from '@data-wrangling-components/core'
import { isNumericInputStep } from '@data-wrangling-components/core'
import { columnTypes, DataType } from '@essex/arquero'
import { NodeInput } from '@essex/dataflow'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type React from 'react'
import { useCallback, useMemo } from 'react'

import type {
	DropdownChangeHandler,
	TextFieldChangeHandler,
} from '../hooks/fluent.js'
import {
	useDropdownChangeHandler,
	useTextFieldChangeHandler,
} from '../hooks/fluent.js'
import { selectStepComponent } from '../selectStepComponent.js'
import type { StepComponentProps } from '../types.js'

export function useStepChangeHandler(
	index: number,
	onChange: (step: Step, index: number) => void,
): (step: Step) => void {
	return useCallback((step: Step) => onChange(step, index), [index, onChange])
}

export function useStepArgsComponent(
	step: Step,
): React.FC<StepComponentProps<unknown>> | null {
	return useMemo(() => (step ? selectStepComponent(step) : null), [step])
}

export function useColumnFilter(
	step: Step<unknown>,
	table?: ColumnTable,
): (name: string) => boolean {
	const typeMap = useMemo(() => {
		if (table) {
			return columnTypes(table)
		}
		return {}
	}, [table])
	return useCallback(
		(name: string) => {
			return isNumericInputStep(step) ? typeMap[name] === DataType.Number : true
		},
		[typeMap, step],
	)
}

export function useInputTableChangeHandler(
	step: Step,
	graph: GraphManager | undefined,
	onChange: (step: Step) => void,
): DropdownChangeHandler {
	return useDropdownChangeHandler(
		step,
		(s, val) => {
			if (val != null) {
				// determine the graph node id to subscribe from
				const tableName = val as string
				const outputNode = graph?.outputDefinitions.find(
					o => o.name === (tableName as string),
				)?.node

				// wire up the Step's input field
				const node = outputNode ?? tableName
				s.input[NodeInput.Source] = { node }
			} else {
				// no value: delete the input
				delete s.input[NodeInput.Source]
			}
		},
		onChange,
	)
}

export function useInputColumnChangeHandler(
	step: Step,
	onChange: (step: Step) => void,
): DropdownChangeHandler {
	return useDropdownChangeHandler<InputColumnArgs>(
		step as Step<InputColumnArgs>,
		(s, val) => (s.args.column = val as string),
		onChange,
	)
}

export function useOutputColumnChangedHandler(
	step: Step,
	onChange: (step: Step) => void,
): TextFieldChangeHandler {
	return useTextFieldChangeHandler<OutputColumnArgs>(
		step as Step<OutputColumnArgs>,
		(s, val) => (s.args.to = val as string),
		onChange,
	)
}

export function useOutputTableChangedHandler(
	step: Step,
	onChangeOutput: (val: string) => void,
	onChange: (step: Step) => void,
): TextFieldChangeHandler {
	return useTextFieldChangeHandler(
		step,
		(_s, val) => onChangeOutput(val as string),
		onChange,
	)
}
