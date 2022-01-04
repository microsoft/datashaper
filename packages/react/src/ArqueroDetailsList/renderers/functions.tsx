/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import { IColumn, IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import { ColumnClickFunction, ColumnRenderFunction } from '..'
import { DropdownOptionSelect } from '../types'
import { ArrayDropdownCell } from './ArrayDropdownCell'
import { DefaultColumnHeader } from './DefaultColumnHeader'
import { HistogramColumnHeader } from './HistogramColumnHeader'
import { DefaultCell, SmartCell, StatsColumnHeader } from '.'

export const createRenderDefaultCell = (
	metadata: ColumnMetadata,
	onColumnClick?: ColumnClickFunction,
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
	onColumnClick?: ColumnClickFunction,
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

export const createRenderDropdownCell = (
	onCellDropdownSelect?: DropdownOptionSelect,
): ColumnRenderFunction =>
	function renderDropdownCell(item?: any, index?: number, column?: IColumn) {
		return (
			<ArrayDropdownCell
				rowIndex={index || 0}
				item={item}
				column={column}
				onCellDropdownSelect={onCellDropdownSelect}
			/>
		)
	}

export const createRenderColumnHeader = (
	renderers: IRenderFunction<IDetailsColumnProps>[],
): IRenderFunction<IDetailsColumnProps> =>
	function renderColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		return (
			<>
				{renderers.map((r, i) =>
					r(
						{
							key: `renderer-${props.column.key}${i}`,
							...props,
						},
						defaultRender,
					),
				)}
			</>
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

export const createRenderStatsColumnHeader = (
	metadata: ColumnMetadata,
	stats?: string[],
): IRenderFunction<IDetailsColumnProps> => {
	return function renderStatsColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		return <StatsColumnHeader metadata={metadata} stats={stats} {...props} />
	}
}

export const createRenderHistogramColumnHeader = (
	metadata: ColumnMetadata,
	color?: string,
): IRenderFunction<IDetailsColumnProps> => {
	return function renderHistogramColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		return (
			<HistogramColumnHeader metadata={metadata} color={color} {...props} />
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
