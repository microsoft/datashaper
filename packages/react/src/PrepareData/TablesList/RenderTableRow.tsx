/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsRowProps, IRenderFunction } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

export function useRenderRow(
	isTableSelected: (tableName: string) => boolean,
): IRenderFunction<IDetailsRowProps> {
	return useCallback(
		(props?, defaultRender?) => {
			if (!props) {
				return null
			}
			return (
				<RenderTableRow
					defaultRender={defaultRender}
					isTableSelected={isTableSelected}
					props={props}
				/>
			)
		},
		[isTableSelected],
	)
}

export const RenderTableRow: React.FC<{
	isTableSelected: (tableName: string) => boolean
	defaultRender?: any
	props?: IDetailsRowProps
}> = memo(function RenderTableRow({ isTableSelected, props, defaultRender }) {
	return defaultRender ? (
		<TableSelect selected={isTableSelected(props?.item.name)}>
			{defaultRender(props)}
		</TableSelect>
	) : null
})

const TableSelect = styled.div<{ selected: boolean }>`
	.ms-DetailsRow {
		width: 100%;
	}

	.ms-GroupSpacer {
		background-color: ${({ theme, selected }) =>
			selected ? theme.application().faint().hex() : 'inherit'};
	}

	.ms-DetailsRow-fields {
		background-color: ${({ theme, selected }) =>
			selected ? theme.application().faint().hex() : 'inherit'};
		justify-content: space-between;
		width: 100%;
	}
`
