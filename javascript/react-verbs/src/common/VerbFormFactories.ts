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
	getLeftColumn,
	getRightColumn,
	getSimpleDropdownOptions,
	getEnumDropdownOptions,
} from '@data-wrangling-components/react-hooks'
import upperFirst from 'lodash-es/upperFirst.js'

import type { FormInput, SingleChoiceFormInput } from './VerbForm.js'
import { FormInputType } from './VerbForm.js'

export function selectColumnListInput(
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

export function selectJoinInputsInputs(
	step: Step<JoinArgs>,
	leftColumns: string[],
	rightColumns: string[],
	label = 'join',
): FormInput<JoinArgs>[] {
	return [
		{
			label: `Input ${label} key`,
			type: FormInputType.SingleChoice,
			required: true,
			options: getSimpleDropdownOptions(leftColumns),
			current: getLeftColumn(step),
			onChange: (s, opt) => {
				if (!s.args.on) {
					s.args.on = []
				}
				s.args.on[0] = opt as string
			},
		},
		{
			label: `${upperFirst(label)} table key`,
			type: FormInputType.SingleChoice,
			options: getSimpleDropdownOptions(rightColumns),
			current: getRightColumn(step),
			onChange: (s, opt) => {
				if (s.args.on) {
					s.args.on[1] = opt as string
				}
			},
		},
	]
}

export function enumDropdown<E, Args>(
	label: string,
	enumeration: E,
	current: SingleChoiceFormInput<Args>['current'],
	onChange: SingleChoiceFormInput<Args>['onChange'],
): FormInput<Args> {
	return {
		label,
		type: FormInputType.SingleChoice,
		options: getEnumDropdownOptions(enumeration),
		current,
		onChange,
	}
}
