/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'

import type { FormInputBase, FormInputType } from './types.js'

export interface TextFormInput<T> extends FormInputBase<T> {
	type: FormInputType.Text

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IDropdownOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current: string | undefined
}
