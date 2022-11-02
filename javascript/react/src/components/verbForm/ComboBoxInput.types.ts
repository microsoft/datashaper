/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { IComboBoxOption } from '@fluentui/react'

import type { FormInputBase, FormInputType } from './types.js'

export interface ComboBoxFormInput<T>
	extends FormInputBase<
		T,
		(
			step: Step<T>,
			option: string | number | undefined,
			value: string | undefined,
		) => void
	> {
	type: FormInputType.ComboBox

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IComboBoxOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current: string | undefined

	allowFreeform?: boolean

	onInputValueChange?: (step: Step<T>, value: string | undefined) => void
}
