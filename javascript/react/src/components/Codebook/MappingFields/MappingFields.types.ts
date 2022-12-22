/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	IButtonStyles,
	ILabelStyleProps,
	ILabelStyles,
	ITextFieldStyleProps,
	ITextFieldStyles,
} from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'

import type { CodebookPropsBase } from '../types.js'

export interface CodebookMappingStyles {
	dropdownStyles?: IStyleFunctionOrObject<
		ITextFieldStyleProps,
		ITextFieldStyles
	>
	columnPairs?: React.CSSProperties
	root?: React.CSSProperties
	addButton?: IButtonStyles
	label?: IStyleFunctionOrObject<ILabelStyleProps, ILabelStyles>
}

export interface CodebookMappingFieldProps extends CodebookPropsBase {
	styles?: CodebookMappingStyles
	label?: string
}
