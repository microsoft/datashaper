/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { IRenderFunction, IDetailsColumnProps } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
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
	output?: TableContainer
	onTransform?: (step: Step) => void
	headerCommandBar?: IRenderFunction<IDetailsColumnProps>[]
}> = memo(function OutputTable({ output, onTransform, headerCommandBar }) {
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)
	const { changeTableFeatures, tableFeatures } = useToggleTableFeatures()
	const commands = useCommonCommands(
		showModal,
		changeTableFeatures,
		tableFeatures,
	)
	const defaultStep = useDefaultStep(output)

	return (
		<>
			{output && output?.table && (
				<>
					<ColumnTransformModal
						table={output?.table}
						step={defaultStep}
						isOpen={isModalOpen}
						onDismiss={hideModal}
						onTransformRequested={onTransform}
					/>
					<Container>
						<ArqueroTableHeader
							table={output?.table}
							farCommands={onTransform && commands}
						/>
						<ArqueroDetailsList
							features={{
								...tableFeatures,
								commandBar: headerCommandBar ? headerCommandBar : undefined,
							}}
							showColumnBorders
							table={output?.table}
							compact
							isHeadersFixed
						/>
					</Container>
				</>
			)}
		</>
	)
})

//TODO: fix this
const Container = styled.div`
	height: 90%;
	width: 95%;
	overflow: auto;
`
