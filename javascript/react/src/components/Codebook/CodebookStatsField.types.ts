/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ICheckboxProps,
	ICheckboxStyleProps,
	ICheckboxStyles,
	IColumn,
	IStyleFunctionOrObject,
} from '@fluentui/react'

import type {
	CodebookDefaultProps,
	CodebookDefaultStyles,
} from './Codebook.types.js'

export interface CodebookStatsStyles extends CodebookDefaultStyles {
	checkbox?: IStyleFunctionOrObject<ICheckboxStyleProps, ICheckboxStyles>
}
export interface CodebookStatsFieldProps extends CodebookDefaultProps {
	showExclude?: boolean
	styles?: CodebookStatsStyles
	checkbox?: ICheckboxProps
	histogramColumn?: IColumn
}
