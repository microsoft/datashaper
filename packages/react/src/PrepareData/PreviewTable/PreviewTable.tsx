/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableMetadata } from '@data-wrangling-components/core'
import { IDetailsColumnProps, IRenderFunction, useTheme } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo } from 'react'
import styled from 'styled-components'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	StatsColumnType,
	useCommonCommands,
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
	selectedMetadata?: TableMetadata
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
}> = memo(function PreviewTable({
	table,
	selectedMetadata,
	headerCommandBar,
	name,
}) {
	const { changeTableFeatures, tableFeatures } = useToggleTableFeatures({
		statsColumnHeaders: true,
		histogramColumnHeaders: true,
	})
	const commands = useCommonCommands(null, changeTableFeatures, tableFeatures)
	const theme = useTheme()

	return (
		<>
			{table ? (
				<Container>
					<ArqueroTableHeader
						name={name}
						table={table}
						farCommands={commands}
						bgColor={theme.palette.neutralSecondary}
					/>
					<ArqueroDetailsList
						isSortable
						compact
						showColumnBorders
						isHeadersFixed
						metadata={selectedMetadata}
						features={{
							...tableFeatures,
							statsColumnTypes: statsColumnTypes,
							commandBar: headerCommandBar ? headerCommandBar : undefined,
						}}
						table={table}
					/>
				</Container>
			) : (
				<DetailText text="Select a table to preview" />
			)}
		</>
	)
})

const Container = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 99%;
	margin-left: 20px;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()}};
`
