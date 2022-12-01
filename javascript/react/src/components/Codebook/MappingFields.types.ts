/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	IButtonStyles,
	ITextFieldStyleProps,
	ITextFieldStyles,
} from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'

import type { CodebookDefaultProps } from './Codebook.types.js'

export interface CodebookMappingStyles {
	dropdownStyles?: IStyleFunctionOrObject<
		ITextFieldStyleProps,
		ITextFieldStyles
	>
	columnPairs?: React.CSSProperties
	root?: React.CSSProperties
	addButton?: IButtonStyles
}

export interface CodebookMappingFieldProps extends CodebookDefaultProps {
	styles?: CodebookMappingStyles
	label?: string
}
