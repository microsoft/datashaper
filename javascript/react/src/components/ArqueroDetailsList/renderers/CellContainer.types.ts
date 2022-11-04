/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'

import type { ColumnSelectFunction } from '../index.js'

export interface CellContainerProps {
	onClick?: ColumnSelectFunction
	column?: IColumn
	children?: React.ReactNode
}
