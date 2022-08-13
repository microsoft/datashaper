/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@essex/arquero'
import type { DataType } from '@essex/arquero'

export interface DataTypeFieldProps {
	dataType: DataType
	keyValue: string
	value: Value
	placeholder: string
	onKeyChange: (oldKey: Value, newKey: Value) => void
	onValueChange: (key: Value, newValue: Value) => void
	isKey: boolean
}
