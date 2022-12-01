/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ICheckboxProps, ICheckboxStyles, IColumn } from '@fluentui/react'
import type { CSSProperties } from 'react'

import type { CodebookDefaultProps } from './Codebook.types.js'

export interface CodebookStatsStyles {
	root?: CSSProperties
	checkbox?: ICheckboxStyles
}
export interface CodebookStatsFieldProps extends CodebookDefaultProps {
	showExclude?: boolean
	styles?: CodebookStatsStyles
	checkbox?: ICheckboxProps
	histogramColumn?: IColumn
}
