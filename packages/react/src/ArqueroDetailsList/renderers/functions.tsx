/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import { ColumnRenderFunction } from '..'
import { DefaultCell, SmartCell } from '.'

export const createRenderDefaultCell = (
	metadata: ColumnMetadata,
): ColumnRenderFunction =>
	function renderDefaultCell(item?: any, index?: number, column?: IColumn) {
		return (
			<DefaultCell
				item={item}
				index={index}
				column={column}
				metadata={metadata}
			/>
		)
	}

export const createRenderSmartCell = (
	metadata: ColumnMetadata,
): ColumnRenderFunction =>
	function renderSmartCell(item?: any, index?: number, column?: IColumn) {
		return (
			<SmartCell
				item={item}
				index={index}
				column={column}
				metadata={metadata}
			/>
		)
	}
