/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import { IRenderFunction, IDetailsColumnProps } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo } from 'react'
import styled from 'styled-components'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	ColumnTransformModal,
	useCommonCommands,
	useToggleTableFeatures,
} from '../../'
import { useDefaultStep } from './hooks'

export const OutputTable: React.FC<{
	output?: ColumnTable
	lastTableName?: string
	onTransform?: (step: Step) => void
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
}> = memo(function OutputTable({
	output,
	onTransform,
	headerCommandBar,
	lastTableName,
}) {
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)
	const { changeTableFeatures, tableFeatures } = useToggleTableFeatures()
	const commands = useCommonCommands(
		showModal,
		changeTableFeatures,
		tableFeatures,
	)
	const defaultStep = useDefaultStep(lastTableName)

	return (
		<>
			{output && (
				<>
					<ColumnTransformModal
						table={output}
						step={defaultStep}
						isOpen={isModalOpen}
						onDismiss={hideModal}
						onTransformRequested={onTransform}
					/>
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
							/>
						</TableContainer>
					</Container>
				</>
			)}
		</>
	)
})

const Container = styled.div`
	width: 95%;
`

const TableContainer = styled.div`
	height: 100%;
`
