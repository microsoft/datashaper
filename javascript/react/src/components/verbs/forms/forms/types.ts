/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'

import type { CheckboxFormInput } from './CheckboxInput.types.js'
import type { ComboBoxFormInput } from './ComboBoxInput.types.js'
import type { MultiChoiceFormInput } from './MultiChoiceInput.types.js'
import type { NumberSpinnerFormInput } from './NumberSpinnerInput.types.js'
import type { SingleChoiceFormInput } from './SingleChoiceInput.types.js'
import type { TextFormInput } from './TextInput.types.js'

export interface FormInputBase<
	T,
	OnChangeHandler = (step: Step<T>, optionKey: unknown | undefined) => void,
> {
	/**
	 * The user-friendly form label
	 */
	label: string

	/**
	 * The placeholder text to show
	 */
	placeholder?: string

	/**
	 * Whether this input is required
	 */
	required?: boolean

	/**
	 * Whether this input is presented
	 */
	if?: boolean

	/**
	 * Whether this input is disabled
	 */
	disabled?: boolean

	/**
	 * Whether this input should be sorted into a collapsible advanced section
	 */
	advanced?: boolean

	/**
	 * An optional React component to wrap the input with
	 */
	wrapper?: React.ComponentType

	styles?: any

	onChange: OnChangeHandler
}

export type FormInput<T> =
	| SingleChoiceFormInput<T>
	| MultiChoiceFormInput<T>
	| NumberSpinnerFormInput<T>
	| CheckboxFormInput<T>
	| TextFormInput<T>
	| ComboBoxFormInput<T>

export enum FormInputType {
	SingleChoice = 'single_choice',
	MultiChoice = 'multi_choice',
	ComboBox = 'combobox',
	NumberSpinner = 'number_spinner',
	Checkbox = 'checkbox',
	Text = 'text',
}
