/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IColumn } from '@fluentui/react'
import type { CSSProperties } from 'react'

import type { CodebookPropsBase } from '../types.js'

export interface CodebookStatsStyles {
	root?: CSSProperties
}
export interface CodebookStatsFieldProps extends CodebookPropsBase {
	styles?: CodebookStatsStyles
	histogramColumn?: IColumn
}
