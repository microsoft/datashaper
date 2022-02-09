/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { ICommandBarItemProps } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { IContextualMenuItem } from 'office-ui-fabric-react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	ColumnTransformModal,
} from '../../'

export const OutputTable: React.FC<{
	output?: TableContainer
	onTransform: (step: Step) => void
}> = memo(function OutputTable({ output, onTransform }) {
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)

	const commands = useCommands(showModal)

	const defaultStep = {
		input: 'join-2',
		output: 'join-2',
	} as Step

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
					visibleRows={1}
					table={output?.table}
					farCommands={commands}
				/>
				<ArqueroDetailsList
					compact
					showColumnBorders
					styles={{ root: { maxHeight: '39vh' } }}
					isHeadersFixed
					table={output?.table}
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

function useDeriveColumnCommand(
	onClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void,
): ICommandBarItemProps {
	const cmd = useMemo(() => {
		return {
			key: 'derive-column',
			text: 'Create column',
			iconProps: {
				iconName: 'Add',
			},
			onClick,
		} as ICommandBarItemProps
	}, [onClick])
	return cmd
}
