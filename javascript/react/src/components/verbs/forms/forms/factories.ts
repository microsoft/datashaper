/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs, JoinArgs } from '@datashaper/schema'
import { toggleListItem } from '@datashaper/utilities'
import type { Step } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'

import {
	getLeftColumn,
	getRightColumn,
	getSimpleDropdownOptions,
} from '../../../../hooks/index.js'
import { getEnumDropdownOptions } from '../../enums.js'
import type { CheckboxFormInput } from './CheckboxInput.types.js'
import type { SingleChoiceFormInput } from './SingleChoiceInput.types.js'
import type { FormInput } from './types.js'
import { FormInputType } from './types.js'

export function inputColumnList(
	step: Step<InputColumnListArgs>,
	columns: string[],
	label = 'Columns',
): FormInput<InputColumnListArgs> {
	return {
		required: true,
		label,
		placeholder: 'Choose columns',
		type: FormInputType.MultiChoice,
		options: getSimpleDropdownOptions(columns),
		current: step.args.columns,
		onChange: (s, opt) =>
			(s.args.columns = toggleListItem(s.args.columns, opt as string)),
		onChangeAll: (s, opts) => (s.args.columns = opts as string[]),
	}
}

export function joinInputs(
	step: Step<JoinArgs>,
	leftColumns: string[],
	rightColumns: string[],
): FormInput<JoinArgs>[] {
	const selectedLeftColumn = getLeftColumn(step)
	const selectedRightColumn = getRightColumn(step)
	return [
		dropdown(
			`Join key column`,
			leftColumns,
			selectedLeftColumn,
			(s, opt) => {
				if (!s.args.on) {
					s.args.on = []
				}
				s.args.on[0] = opt as string
			},
			{ required: true, placeholder: 'Choose column' },
		),
		dropdown(
			`Second table key column`,
			rightColumns,
			selectedRightColumn,
			(s, opt) => {
				if (s.args.on) {
					s.args.on[1] = opt as string
				}
			},
			{ placeholder: 'Choose column', advanced: true },
		),
	]
}

export function dropdown<Args>(
	label: string,
	values: string[],
	current: SingleChoiceFormInput<Args>['current'],
	onChange: SingleChoiceFormInput<Args>['onChange'],
	opts: Partial<SingleChoiceFormInput<Args>> = {},
): FormInput<Args> {
	return {
		label,
		type: FormInputType.SingleChoice,
		options: getSimpleDropdownOptions(values),
		current,
		onChange,
		...opts,
	}
}

export function tableDropdown<Args>(
	label: string,
	options: IDropdownOption[],
	current: SingleChoiceFormInput<Args>['current'],
	onChange: SingleChoiceFormInput<Args>['onChange'],
	opts: Partial<SingleChoiceFormInput<Args>> = {},
): FormInput<Args> {
	return {
		label,
		type: FormInputType.SingleChoice,
		options,
		current,
		onChange,
		...opts,
	}
}

export function enumDropdown<E, Args>(
	label: string,
	enumeration: E,
	current: SingleChoiceFormInput<Args>['current'],
	onChange: SingleChoiceFormInput<Args>['onChange'],
	opts: Partial<SingleChoiceFormInput<Args>> = {},
	nameMapping?: Record<string, string>,
): FormInput<Args> {
	return {
		label,
		type: FormInputType.SingleChoice,
		options: getEnumDropdownOptions(enumeration, nameMapping),
		current,
		onChange,
		...opts,
	}
}

export function checkbox<Args>(
	label: string,
	current: CheckboxFormInput<Args>['current'],
	onChange: CheckboxFormInput<Args>['onChange'],
	opts: Partial<CheckboxFormInput<Args>> = {},
): FormInput<Args> {
	return {
		label,
		type: FormInputType.Checkbox,
		current,
		onChange,
		...opts,
	}
}
