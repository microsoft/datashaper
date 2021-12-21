/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { ColumnRenderFunction } from '..'
import { BooleanCell, DefaultCell, SmartCell, SparklineCell } from '.'

export const renderDefaultCell: ColumnRenderFunction = (
	item?: any,
	index?: number,
	column?: IColumn,
) => {
	return <DefaultCell item={item} index={index} column={column} />
}

export const renderSmartCell: ColumnRenderFunction = (
	item?: any,
	index?: number,
	column?: IColumn,
) => {
	return <SmartCell item={item} index={index} column={column} />
}

export const renderBooleanCell: ColumnRenderFunction = (
	item?: any,
	index?: number,
	column?: IColumn,
) => {
	return <BooleanCell item={item} index={index} column={column} />
}

export const renderSparklineCell: ColumnRenderFunction = (
	item?: any,
	index?: number,
	column?: IColumn,
) => {
	return <SparklineCell item={item} index={index} column={column} />
}
