/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType, Value } from '@datashaper/schema'
import type { ITextFieldStyleProps, ITextFieldStyles } from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'

export interface DataTypeFieldProps {
	dataType: DataType
	keyValue: string
	value: Value
	placeholder: string
	onKeyChange: (oldKey: Value, newKey: Value) => void
	onValueChange: (key: Value, newValue: Value) => void
	isKey: boolean
	dropdownStyles?: IStyleFunctionOrObject<
		ITextFieldStyleProps,
		ITextFieldStyles
	>
	disabled?: boolean
}
