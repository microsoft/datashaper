/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import type { IRenderFunction, IDetailsColumnProps } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo } from 'react'
import styled from 'styled-components'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	useCommonCommands,
} from '../../index.js'
import { useToggleTableFeatures } from '../hooks'

export const OutputTable: React.FC<{
	output?: ColumnTable
	onTransform?: (step: Step) => void
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
}> = memo(function OutputTable({ output, onTransform, headerCommandBar }) {
	const { changeTableFeatures, tableFeatures } = useToggleTableFeatures()
	const commands = useCommonCommands(
		undefined,
		changeTableFeatures,
		tableFeatures,
	)
	return (
		<>
			{output && (
				<Container>
					<ArqueroTableHeader
						table={output}
						farCommands={onTransform && commands}
					/>
					<TableContainer>
						<ArqueroDetailsList
							features={{
								...tableFeatures,
								commandBar: headerCommandBar ? headerCommandBar : undefined,
							}}
							showColumnBorders
							table={output}
							compact
							isHeadersFixed
							isSortable
						/>
					</TableContainer>
				</Container>
			)}
		</>
	)
})

const Container = styled.div`
	width: 100%;
	min-width: 300px;
`

const TableContainer = styled.div`
	height: 99%;
	border: 1px solid ${({ theme }) => theme.application().faint().hex()}};
`
