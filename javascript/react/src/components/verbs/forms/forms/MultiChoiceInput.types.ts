/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { IDropdownOption } from '@fluentui/react'

import type { FormInputBase, FormInputType } from './types.js'

export interface MultiChoiceFormInput<
	T,
	OnChangeAllHandler = (step: Step<T>, optionKeys: (string | number)[]) => void,
> extends FormInputBase<T> {
	type: FormInputType.MultiChoice

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IDropdownOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current?: string[] | undefined
	onChangeAll: OnChangeAllHandler
}
