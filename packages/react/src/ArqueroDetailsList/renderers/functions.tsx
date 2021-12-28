/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import { IColumn, IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import { ColumnRenderFunction } from '..'
import { DefaultColumnHeader } from './DefaultColumnHeader'
import { HistogramColumnHeader } from './HistogramColumnHeader'
import { DefaultCell, SmartCell } from '.'

export const createRenderDefaultCell = (
	metadata: ColumnMetadata,
	onColumnClick?: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void,
): ColumnRenderFunction =>
	function renderDefaultCell(item?: any, index?: number, column?: IColumn) {
		return (
			<DefaultCell
				item={item}
				index={index}
				column={column}
				metadata={metadata}
				onColumnClick={onColumnClick}
			/>
		)
	}

export const createRenderSmartCell = (
	metadata: ColumnMetadata,
	color?: string,
	onColumnClick?: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void,
): ColumnRenderFunction =>
	function renderSmartCell(item?: any, index?: number, column?: IColumn) {
		return (
			<SmartCell
				item={item}
				index={index}
				column={column}
				metadata={metadata}
				color={color}
				onColumnClick={onColumnClick}
			/>
		)
	}

/**
 * Establish our own default rendering for column headers.
 * This gives us full control over the layout so we can cleanly
 * handle the default while also stacking in advanced render features.
 * @returns
 */
export const createRenderDefaultColumnHeader = (
	originalProps: Partial<IColumn>,
): IRenderFunction<IDetailsColumnProps> =>
	function renderDefaultColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		const p = fixProps(originalProps, props)
		return <DefaultColumnHeader {...p} />
	}

export const createRenderHistogramColumnHeader = (
	originalProps: Partial<IColumn>,
	metadata: ColumnMetadata,
	color?: string,
): IRenderFunction<IDetailsColumnProps> => {
	return function renderHistogramColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		const p = fixProps(originalProps, props)
		return (
			<>
				<DefaultColumnHeader {...p} />
				<HistogramColumnHeader metadata={metadata} color={color} {...p} />
			</>
		)
	}
}

function fixProps(
	original: Partial<IColumn>,
	updated: IDetailsColumnProps,
): IDetailsColumnProps {
	const iconName = original?.iconName
	if (iconName) {
		return {
			...updated,
			column: {
				...updated.column,
				iconName,
			},
		}
	}
	return updated
}
