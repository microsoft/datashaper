/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import type {
	IColumn,
	IDetailsColumnProps,
	IRenderFunction,
} from '@fluentui/react'

import type {
	DetailsListFeatures,
	DropdownOptionSelect,
	MetadataClickFunction,
	StatsColumnType,
} from '../ArqueroDetailsList.types.js'
import type { ColumnClickFunction, ColumnRenderFunction } from '../index.js'
import { CommandBarContainer } from './CommandBarContainer.js'
import { DefaultColumnHeader } from './DefaultColumnHeader.js'
import { FeaturesCell } from './FeaturesCell.js'
import { HistogramColumnHeader } from './HistogramColumnHeader.js'
import { SmartCell, StatsColumnHeader } from './index.js'

export const createRenderSmartCell = (
	field: Field,
	color?: string,
	onColumnClick?: ColumnClickFunction,
	onCellDropdownSelect?: DropdownOptionSelect,
): ColumnRenderFunction =>
	function renderSmartCell(item?: any, index?: number, column?: IColumn) {
		return (
			<SmartCell
				item={item}
				index={index}
				column={column}
				field={field}
				color={color}
				onColumnClick={onColumnClick}
				onCellDropdownSelect={onCellDropdownSelect}
			/>
		)
	}

export const createRenderFeaturesCell = (
	features: DetailsListFeatures,
	field?: Field,
	color?: string,
	onColumnClick?: ColumnClickFunction,
	onCellDropdownSelect?: DropdownOptionSelect,
): ColumnRenderFunction =>
	function renderDropdownCell(item?: any, index?: number, column?: IColumn) {
		return (
			<FeaturesCell
				index={index || 0}
				item={item}
				column={column}
				onCellDropdownSelect={onCellDropdownSelect}
				onColumnClick={onColumnClick}
				field={field}
				color={color}
				features={features}
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
				{renderers.map((renderer, i) =>
					renderer(
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
	isClickable: boolean,
	isSortable: boolean,
	onColumnHeaderClick?: ColumnClickFunction,
	onSort?: ColumnClickFunction,
): IRenderFunction<IDetailsColumnProps> =>
	function renderDefaultColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		const p = fixProps(originalProps, props)
		return (
			<DefaultColumnHeader
				{...p}
				isClickable={isClickable}
				isSortable={isSortable}
				onClick={onColumnHeaderClick}
				onSort={onSort}
			/>
		)
	}

export const createRenderStatsColumnHeader = (
	field: Field,
	onClick?: MetadataClickFunction,
	stats?: StatsColumnType[],
): IRenderFunction<IDetailsColumnProps> => {
	return function renderStatsColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		return (
			<StatsColumnHeader
				onClick={onClick}
				field={field}
				stats={stats}
				{...props}
			/>
		)
	}
}

export const createRenderCommandBarColumnHeader = (
	renderers: IRenderFunction<IDetailsColumnProps>[],
): IRenderFunction<IDetailsColumnProps> => {
	return function renderCommandBarColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}

		return (
			<CommandBarContainer
				key={props.key}
				props={props}
				renderers={renderers}
			/>
		)
	}
}

export const createRenderHistogramColumnHeader = (
	field: Field,
	color?: string,
	onClick?: MetadataClickFunction,
): IRenderFunction<IDetailsColumnProps> => {
	return function renderHistogramColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		return (
			<HistogramColumnHeader
				onClick={onClick}
				field={field}
				color={color}
				{...props}
			/>
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
