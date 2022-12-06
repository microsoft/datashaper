/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ICheckboxProps, ICheckboxStyles, IColumn } from '@fluentui/react'
import type { CSSProperties } from 'react'

import type { CodebookPropsBase } from './Codebook.types.js'

export interface CodebookStatsStyles {
	root?: CSSProperties
	checkbox?: Partial<ICheckboxStyles>
}
export interface CodebookStatsFieldProps extends CodebookPropsBase {
	showExclude?: boolean
	styles?: CodebookStatsStyles
	checkbox?: Partial<ICheckboxProps>
	histogramColumn?: IColumn
}
