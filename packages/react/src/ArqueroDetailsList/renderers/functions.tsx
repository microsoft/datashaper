/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { ColumnRenderFunction } from '..'
import { DefaultCell } from '.'

export const renderDefaultCell: ColumnRenderFunction = (
	item?: any,
	index?: number,
	column?: IColumn,
) => {
	return <DefaultCell item={item} index={index} column={column} />
}
