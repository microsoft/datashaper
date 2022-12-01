/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import type { EnumDropdownProps } from '@essex/components'
import type {
	IDropdownStyles,
	ITextFieldProps,
	ITextFieldStyles,
} from '@fluentui/react'

import type { CodebookStatsStyles } from './CodebookStatsField.types.js'
import type { CodebookMappingStyles } from './MappingFields.types.js'

export const DISPLAY_NAME = 53
export const DESCRIPTION = 83
export const UNITS = 53
export const DATA_TYPE = 53
export const DATA_NATURE = 53
export const STATS_WRAPPER = 127
export const MAPPING_WRAPPER = 69
export const MAPPING_FIELD = 32

export interface CodebookDefaultStyles {
	root?: React.CSSProperties
	mapping?: CodebookMappingStyles
	statsWrapper?: CodebookStatsStyles
	displayName?: ITextFieldStyles
	description?: ITextFieldStyles
	units?: ITextFieldStyles
	dataType?: IDropdownStyles
	dataNature?: IDropdownStyles
}

export interface CodebookDefaultProps {
	field: Field
	onChangeField?: (field: Field) => void
}

export interface CodebookTextFieldProps
	extends CodebookDefaultProps,
		ITextFieldProps {}

export interface CodebookEnumDropdownFieldProps
	extends CodebookDefaultProps,
		EnumDropdownProps<unknown> {}
