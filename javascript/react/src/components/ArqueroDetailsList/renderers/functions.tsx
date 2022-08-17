/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnMetadata } from '@datashaper/schema'
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
	metadata: ColumnMetadata,
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
				metadata={metadata}
				color={color}
				onColumnClick={onColumnClick}
				onCellDropdownSelect={onCellDropdownSelect}
			/>
		)
	}

export const createRenderFeaturesCell = (
	features: DetailsListFeatures,
	metadata?: ColumnMetadata,
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
				metadata={metadata}
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
	isClickable: boolean,
	handleColumnHeaderClick?: ColumnClickFunction,
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
				onClick={handleColumnHeaderClick}
			/>
		)
	}

export const createRenderStatsColumnHeader = (
	metadata: ColumnMetadata,
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
				metadata={metadata}
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
	metadata: ColumnMetadata,
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
				metadata={metadata}
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
