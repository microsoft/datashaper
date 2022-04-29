/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs,Step  } from '@data-wrangling-components/core'
import { toggleListItem } from '@data-wrangling-components/primitives'
import { getSimpleDropdownOptions } from '@data-wrangling-components/react-hooks'

import type { FormInput } from './VerbForm.js'
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
