/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FormInputBase, FormInputType } from './types.js'

export interface NumberSpinnerFormInput<T> extends FormInputBase<T> {
	type: FormInputType.NumberSpinner
	min?: number
	max?: number
	step?: number
	/**
	 * The form input value or selected key (if enum)
	 */
	current: number | undefined
}
