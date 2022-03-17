/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@data-wrangling-components/core'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo } from 'react'
import styled from 'styled-components'

import type { SaveMetadataFunction } from '../../index.js'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	StatsColumnType,
} from '../../index.js'
import { DetailText } from '../DetailText/index.js'
import { useToggleTableFeatures } from '../hooks/index.js'

const statsColumnTypes = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

export const PreviewTable: React.FC<{
	table?: ColumnTable
	name?: string
	metadata?: TableMetadata
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
	onChangeMetadata?: SaveMetadataFunction
}> = memo(function PreviewTable({
	table,
	headerCommandBar,
	name,
	metadata,
	onChangeMetadata,
}) {
	const { tableFeatures } = useToggleTableFeatures()

	return (
		<>
			{table ? (
				<Container>
					<ArqueroTableHeader
						name={name}
						table={table}
						// farCommands={commands}
					/>
					<ArqueroDetailsList
						isSortable
						compact
						showColumnBorders
						isHeadersFixed
						metadata={metadata}
						onChangeMetadata={onChangeMetadata}
						features={{
							...tableFeatures,
							statsColumnTypes: statsColumnTypes,
							commandBar: headerCommandBar ? headerCommandBar : undefined,
						}}
						table={table}
					/>
				</Container>
			) : (
				<TextContainer>
					<DetailText text="(No table selected)" />
				</TextContainer>
			)}
		</>
	)
})

const Container = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const TextContainer = styled.div`
	display: flex;
	height: 100%;
	align-items: center;
`
