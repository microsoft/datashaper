/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ICheckboxProps,
	ICheckboxStyleProps,
	ICheckboxStyles,
} from '@fluentui/react'
import type { IStyleFunctionOrObject } from '@fluentui/utilities'
import type { CSSProperties } from 'react'

import type { CodebookPropsBase } from '../types.js'

export interface CodebookNameStyles {
	root?: CSSProperties
	checkbox?: IStyleFunctionOrObject<ICheckboxStyleProps, ICheckboxStyles>
}
export interface CodebookNameFieldProps extends CodebookPropsBase {
	showExclude?: boolean
	styles?: CodebookNameStyles
	checkbox?: Partial<ICheckboxProps>
}
