/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import { IColumn, IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import { ColumnRenderFunction } from '..'
import { DefaultColumnHeader } from './DefaultColumnHeader'
import { HistogramColumnHeader } from './HistogramColumnHeader'
import { Bin } from './types'
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
	color?: string,
): ColumnRenderFunction =>
	function renderSmartCell(item?: any, index?: number, column?: IColumn) {
		return (
			<SmartCell
				item={item}
				index={index}
				column={column}
				metadata={metadata}
				color={color}
			/>
		)
	}

/**
 * Establish our own default rendering for column headers.
 * This gives us full control over the layout so we can cleanly
 * handle the default while also stacking in advanced render features.
 * @returns
 */
export const createRenderDefaultColumnHeader =
	(): IRenderFunction<IDetailsColumnProps> =>
		function renderDefaultColumnHeader(props?, defaultRender?) {
			if (!props) {
				return null
			}
			return <DefaultColumnHeader {...props} />
		}

export const createRenderHistogramColumnHeader = (
	metadata: ColumnMetadata,
	bins: Bin[],
	color?: string,
): IRenderFunction<IDetailsColumnProps> =>
	function renderDefaultColumnHeader(props?, defaultRender?) {
		if (!props) {
			return null
		}
		return (
			<HistogramColumnHeader
				metadata={metadata}
				bins={bins}
				color={color}
				{...props}
			/>
		)
	}
