/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field, FieldMetadata, ValidationResult } from '@datashaper/schema'
import type {
	IColumn,
	IDetailsColumnProps,
	IRenderFunction,
} from '@fluentui/react'

import type {
	ArqueroDetailsListFeatures,
	DropdownOptionSelect,
	StatsColumnType,
} from '../ArqueroDetailsList.types.js'
import type { ColumnRenderFunction, ColumnSelectFunction } from '../index.js'
import { CommandBarContainer } from './CommandBarContainer.js'
import { DefaultColumnHeader } from './DefaultColumnHeader.js'
import { FeaturesCell } from './FeaturesCell.js'
import { HistogramColumnHeader } from './HistogramColumnHeader.js'
import { SmartCell, StatsColumnHeader } from './index.js'

export const createRenderSmartCell = (
	field: Field,
	metadata?: FieldMetadata,
	color?: string,
	onSelect?: ColumnSelectFunction,
	onCellDropdownSelect?: DropdownOptionSelect,
	validationResult?: ValidationResult,
): ColumnRenderFunction =>
	function renderSmartCell(item?: any, index?: number, column?: IColumn) {
		return (
			<SmartCell
				item={item}
				index={index}
				column={column}
				field={field}
				metadata={metadata}
				color={color}
				onSelect={onSelect}
				onCellDropdownSelect={onCellDropdownSelect}
				validationResult={validationResult}
			/>
		)
	}

export const createRenderFeaturesCell = (
	features: ArqueroDetailsListFeatures,
	field?: Field,
	metadata?: FieldMetadata,
	color?: string,
	onSelect?: ColumnSelectFunction,
	onCellDropdownSelect?: DropdownOptionSelect,
	validationResult?: ValidationResult,
): ColumnRenderFunction =>
	function renderFeaturesCell(item?: any, index?: number, column?: IColumn) {
		return (
			<FeaturesCell
				index={index || 0}
				item={item}
				column={column}
				onCellDropdownSelect={onCellDropdownSelect}
				onSelect={onSelect}
				field={field}
				metadata={metadata}
				color={color}
				features={features}
				validationResult={validationResult}
			/>
		)
	}

export const createRenderColumnHeader = (
	renderers: IRenderFunction<IDetailsColumnProps>[],
): IRenderFunction<IDetailsColumnProps> =>
	function renderColumnHeader(props?, defaultRender?) {
		if (!(props && defaultRender)) {
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
	sortable: boolean,
	validationResult?: ValidationResult,
	onSelect?: ColumnSelectFunction,
	onSort?: ColumnSelectFunction,
): IRenderFunction<IDetailsColumnProps> =>
	function renderDefaultColumnHeader(props?, defaultRender?) {
		if (!(props && defaultRender)) {
			return null
		}
		const p = fixProps(originalProps, props)
		return (
			<DefaultColumnHeader
				{...p}
				sortable={sortable}
				onSelect={onSelect}
				onSort={onSort}
				validationResult={validationResult}
			/>
		)
	}

export const createRenderStatsColumnHeader = (
	field: Field,
	metadata?: FieldMetadata,
	onSelect?: ColumnSelectFunction,
	stats?: StatsColumnType[],
): IRenderFunction<IDetailsColumnProps> => {
	return function renderStatsColumnHeader(props?, defaultRender?) {
		if (!(props && defaultRender)) {
			return null
		}
		return (
			<StatsColumnHeader
				onSelect={onSelect}
				field={field}
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
		if (!(props && defaultRender)) {
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
	metadata?: FieldMetadata,
	color?: string,
	onSelect?: ColumnSelectFunction,
): IRenderFunction<IDetailsColumnProps> => {
	return function renderHistogramColumnHeader(props?, defaultRender?) {
		if (!(props && defaultRender)) {
			return null
		}
		return (
			<HistogramColumnHeader
				onSelect={onSelect}
				field={field}
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
