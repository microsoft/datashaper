/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import {
	container,
	createPipeline,
	createTableStore,
} from '@data-wrangling-components/core'
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	ColumnTransformModal,
	createDefaultHeaderCommandBar,
} from '@data-wrangling-components/react'
import type { IContextualMenuItem } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useThematic } from '@thematic/react'
import { loadCSV } from 'arquero'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { from } from 'rxjs'
import styled from 'styled-components'

/**
 * This is a page for testing out built-in table transform mechanisms
 */
export const TransformPage: React.FC = memo(function PerfMage() {
	const store = useMemo(() => createTableStore(), [])
	const pipeline = useMemo(() => createPipeline(store), [store])
	const [outputTable, setOutputTable] = useState<TableContainer | undefined>()
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		const f = async () => {
			const root = await loadCSV('data/stocks.csv', {
				autoMax: 1000000,
			})
			store.set('input', from([container('input', root)]))
			setIsLoaded(true)
			return store.onItemChange('output', t => setOutputTable(t))
		}
		void f()
	}, [store, setIsLoaded])

	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)

	const commandBar = useCommandBar(showModal)

	const handleTransformRequested = useCallback(
		step => {
			pipeline.clear()
			pipeline.addAll([{ ...step, outputs: { default: 'output' } }])
			if (isLoaded) {
				hideModal()
			}
		},
		[hideModal, pipeline, isLoaded],
	)

	if (!outputTable?.table) {
		return null
	}
	return (
		<Container>
			<ColumnTransformModal
				table={outputTable.table}
				isOpen={isModalOpen}
				onDismiss={hideModal}
				onTransformRequested={handleTransformRequested}
			/>
			<Table>
				<ArqueroTableHeader table={outputTable.table} commandBar={commandBar} />
				<ArqueroDetailsList
					table={outputTable.table}
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
	width: 800px;
	height: 600px;
`

function useCommandBar(showModal: any) {
	const theme = useThematic()
	const dccmd = useDeriveColumnCommand(showModal)
	return useMemo(
		() =>
			createDefaultHeaderCommandBar(
				{
					items: [dccmd],
				},
				theme,
			),
		[theme, dccmd],
	)
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
