import type { Step } from '@data-wrangling-components/core'
import type { FormInput } from './VerbForm.js'
import { FormInputType } from './VerbForm.js'
import type { InputColumnListArgs } from '@data-wrangling-components/core'
import { getSimpleDropdownOptions } from '@data-wrangling-components/react-hooks'
import { toggleListItem } from '@data-wrangling-components/primitives'

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
