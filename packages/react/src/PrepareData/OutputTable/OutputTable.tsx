/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { ICommandBarItemProps } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	ColumnTransformModal,
	useDeriveColumnCommand,
} from '../../'

export const OutputTable: React.FC<{
	output?: TableContainer
	onTransform?: (step: Step) => void
}> = memo(function OutputTable({ output, onTransform }) {
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)

	const commands = useCommands(showModal)

	const defaultStep = useMemo((): Step => {
		return {
			input: output?.name,
			output: output?.name,
		} as Step
	}, [output])

	if (!output || !output?.table) return null

	return (
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
					showColumnBorders
					styles={{ root: { maxHeight: '39vh' } }}
					table={output?.table}
					compact
					isHeadersFixed
				/>
			</Container>
		</>
	)
})

const Container = styled.div`
	max-height: inherit;
`

function useCommands(showModal: any): ICommandBarItemProps[] {
	const dccmd = useDeriveColumnCommand(showModal)
	return useMemo(() => [dccmd], [dccmd])
}
