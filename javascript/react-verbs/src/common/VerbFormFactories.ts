/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnListArgs,
	JoinArgs,
	Step,
} from '@data-wrangling-components/core'
import { toggleListItem } from '@data-wrangling-components/primitives'
import {
	getEnumDropdownOptions,
	getLeftColumn,
	getRightColumn,
	getSimpleDropdownOptions,
} from '@data-wrangling-components/react-hooks'
import upperFirst from 'lodash-es/upperFirst.js'

import type {
	CheckboxFormInput,
	FormInput,
	SingleChoiceFormInput,
} from './VerbForm.js'
import { FormInputType } from './VerbForm.js'

export function inputColumnList(
	step: Step<InputColumnListArgs>,
	columns: string[],
	label = 'Columns',
): FormInput<InputColumnListArgs> {
	return {
		label,
		type: FormInputType.MultiChoice,
		options: getSimpleDropdownOptions(columns),
		current: step.args.columns,
		onChange: (s, opt) =>
			(s.args.columns = toggleListItem(s.args.columns, opt as string)),
	}
}

export function joinInputs(
	step: Step<JoinArgs>,
	leftColumns: string[],
	rightColumns: string[],
	label = 'join',
): FormInput<JoinArgs>[] {
	return [
		dropdown(
			`Input ${label} key`,
			leftColumns,
			getLeftColumn(step),
			(s, opt) => {
				if (!s.args.on) {
					s.args.on = []
				}
				s.args.on[0] = opt as string
			},
			{ required: true },
		),
		dropdown(
			`${upperFirst(label)} table key`,
			rightColumns,
			getRightColumn(step),
			(s, opt) => {
				if (s.args.on) {
					s.args.on[1] = opt as string
				}
			},
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
