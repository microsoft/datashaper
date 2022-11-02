/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FormInputBase, FormInputType } from './types.js'

export interface CheckboxFormInput<T> extends FormInputBase<T> {
	type: FormInputType.Checkbox

	/**
	 * The form input value or selected key (if enum)
	 */
	current: boolean | undefined
}
