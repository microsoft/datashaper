/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata } from '@data-wrangling-components/core'
import {
	IColumn,
	IDetailsColumnProps,
	IDetailsGroupDividerProps,
	IRenderFunction,
} from '@fluentui/react'
import styled from 'styled-components'
import { ColumnClickFunction, ColumnRenderFunction } from '..'
import { GroupHeader } from '../../controls'
import { DetailsListFeatures, DropdownOptionSelect } from '../types'
import { DefaultColumnHeader } from './DefaultColumnHeader'
import { FeaturesCell } from './FeaturesCell'
import { HistogramColumnHeader } from './HistogramColumnHeader'
import { SmartCell, StatsColumnHeader } from '.'

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
	metadata: ColumnMetadata,
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

export function createLazyLoadingGroupHeader(
	props: IDetailsGroupDividerProps | undefined,
	columnMetadata: ColumnMetadata | undefined,
	children: any,
): any {
	if (!props || !columnMetadata) {
		return null
	}
	return (
		<GroupHeader props={props} columnMeta={columnMetadata} lazyLoadGroups>
			{children}
		</GroupHeader>
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

export const createRenderCommandBarColumnHeader = (
	renderers: IRenderFunction<IDetailsColumnProps>[],
): IRenderFunction<IDetailsColumnProps> => {
	return function renderCommandBarColumnHeader(props?, defaultRender?) {
		if (!props || !defaultRender) {
			return null
		}
		return (
			<CommandBarContainer key={Math.random()} className="command-bar">
				{renderers.map((renderer, i) => (
					<div key={i}>{renderer(props)}</div>
				))}
			</CommandBarContainer>
		)
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

const CommandBarContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px 0px;
	border-top: 1px solid ${({ theme }) => theme.application().faint().hex()};
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`
