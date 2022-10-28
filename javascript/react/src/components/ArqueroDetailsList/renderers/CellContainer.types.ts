/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'

import type { ColumnClickFunction } from '../index.js'

export interface CellContainerProps {
	onClick?: ColumnClickFunction
	column?: IColumn
	children?: React.ReactNode
}
