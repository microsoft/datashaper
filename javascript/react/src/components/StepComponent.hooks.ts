/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnArgs,
	InputColumnListArgs,
	OutputColumnArgs,
} from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { columnType, columnTypes } from '@datashaper/tables'
import { toggleListItem } from '@datashaper/utilities'
import type { Step } from '@datashaper/workflow'
import { isNumericInputStep, NodeInput } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type React from 'react'
import { useCallback, useEffect, useMemo } from 'react'

import { EMPTY_ARRAY } from '../empty.js'
import { useResetArgs } from '../hooks/common.js'
import type {
	DropdownChangeAllHandler,
	DropdownChangeHandler,
	TextFieldChangeHandler,
} from '../hooks/fluent.js'
import {
	useDropdownChangeAllHandler,
	useDropdownChangeHandler,
	useTextFieldChangeHandler,
} from '../hooks/fluent.js'
import { selectStepComponent } from '../selectStepComponent.js'
import type { StepComponentProps } from '../types.js'

export function getSimpleDropdownOptions(list: string[]): IDropdownOption[] {
	return list.map(name => ({
		key: name,
		text: name.toString(),
	}))
}

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

export function useInputTableChanged(
	step: Step,
	onChange: (step: Step) => void,
): DropdownChangeHandler {
	const resetArgs = useResetArgs()

	return useDropdownChangeHandler(
		step,
		(s: Step, val: string | number | undefined) => {
			if (val != null) {
				// wire up the Step's input field
				s.input[NodeInput.Source] = { node: val as string }
				resetArgs(s)
			} else {
				// no value: delete the input
				delete s.input[NodeInput.Source]
			}
		},
		onChange,
	)
}

export function useInputColumnChanged(
	step: Step,
	onChange: (step: Step) => void,
	dataTable?: ColumnTable,
): DropdownChangeHandler {
	return useDropdownChangeHandler<InputColumnArgs>(
		step as Step<InputColumnArgs>,
		(s, val) => {
			s.args.column = val as string
			s.args.dataType =
				dataTable != null
					? columnType(dataTable, val as string)
					: DataType.Unknown
		},
		onChange,
	)
}

export function useInputColumnListChanged(
	step: Step,
	onChange: (step: Step) => void,
): DropdownChangeHandler {
	return useDropdownChangeHandler<InputColumnListArgs>(
		step as Step<InputColumnListArgs>,
		(s, val) =>
			(s.args.columns = toggleListItem(
				s.args.columns ?? EMPTY_ARRAY,
				val as string,
			)),
		onChange,
	)
}

export function useInputColumnListAllChanged(
	step: Step,
	onChangeAll: (step: Step) => void,
): DropdownChangeAllHandler {
	return useDropdownChangeAllHandler<InputColumnListArgs>(
		step as Step<InputColumnListArgs>,
		(s, val) => (s.args.columns = val as string[]),
		onChangeAll,
	)
}

export function useOutputColumnChanged(
	step: Step,
	onChange: (step: Step) => void,
): TextFieldChangeHandler {
	return useTextFieldChangeHandler<OutputColumnArgs>(
		step as Step<OutputColumnArgs>,
		(s, val) => {
			s.args.to = val as string
		},
		onChange,
	)
}

export function useOutputTableChanged(
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

export function useDefaultOutputNameInitially(
	step: Step,
	output: string | undefined,
	onChangeOutput: (value: string | undefined) => void,
): void {
	useEffect(
		() => {
			onChangeOutput(output ?? step.id)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			/* only on initial render */
		],
	)
}
