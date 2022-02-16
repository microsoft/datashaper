/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { runPipeline } from '@data-wrangling-components/core'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	ColumnTransformModal,
} from '@data-wrangling-components/react'
import { IContextualMenuItem } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { loadCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useState, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'

/**
 * This is a page for testing out built-in table transform mechanisms
 */
export const TransformPage: React.FC = memo(function PerfMage() {
	const [table, setTable] = useState<ColumnTable | undefined>()
	useEffect(() => {
		const f = async () => {
			const root = await loadCSV('data/stocks.csv', {})
			setTable(root)
		}
		f()
	}, [])

	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)

	const commands = useCommands(showModal)

	const handleTransformRequested = useCallback(
		async step => {
			if (table && step) {
				const output = await runPipeline(table, [step])
				setTable(output)
			}
		},
		[table],
	)

	if (!table) {
		return null
	}
	return (
		<Container>
			<ColumnTransformModal
				table={table}
				isOpen={isModalOpen}
				onDismiss={hideModal}
				onTransformRequested={handleTransformRequested}
			/>
			<Table>
				<ArqueroTableHeader table={table} farCommands={commands} />
				<ArqueroDetailsList
					table={table}
					isHeadersFixed
					features={{
						smartCells: true,
						smartHeaders: true,
					}}
				/>
			</Table>
		</Container>
	)
})

const Container = styled.div`
	padding: 0px 20px 0px 20px;
`

const Table = styled.div`
	margin-top: 12px;
	width: 800ox;
	height: 600px;
`

function useCommands(showModal: any) {
	const dccmd = useDeriveColumnCommand(showModal)
	return useMemo(() => [dccmd], [dccmd])
}

function useDeriveColumnCommand(
	onClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void,
) {
	const cmd = useMemo(() => {
		return {
			key: 'derive-column',
			text: 'Create column',
			iconProps: {
				iconName: 'Add',
			},
			onClick,
		}
	}, [onClick])
	return cmd
}
