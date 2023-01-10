/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'
import type { EnumDropdownProps } from '@essex/components'
import type {
	IDropdownStyles,
	ITextFieldProps,
	ITextFieldStyles,
} from '@fluentui/react'

import type { CodebookStatsStyles } from './CodebookStatsField/index.js'
import type { CodebookMappingStyles } from './MappingFields/index.js'

export interface CodebookStyles {
	root?: React.CSSProperties
	mapping?: CodebookMappingStyles
	statsWrapper?: CodebookStatsStyles
	displayName?: Partial<ITextFieldStyles>
	description?: Partial<ITextFieldStyles>
	units?: Partial<ITextFieldStyles>
	dataType?: Partial<IDropdownStyles>
	dataNature?: Partial<IDropdownStyles>
}

export interface CodebookPropsBase {
	field: Field
	metadata?: TableMetadata
	onChangeField?: (field: Field) => void
}

export interface CodebookTextFieldProps
	extends CodebookPropsBase,
		ITextFieldProps {}

export interface CodebookEnumDropdownFieldProps
	extends CodebookPropsBase,
		EnumDropdownProps<unknown> {}

export interface FieldHeights {
	get: (key: string) => number | undefined
	set: (key: string, value: number) => void
	updateAllMapping: (newFields: Field[]) => void
}
