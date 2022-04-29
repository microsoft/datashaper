/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import {
	PrepareDataFull,
	ProjectMgmtCommandBar,
} from '@data-wrangling-components/react'
import type { TableContainer } from '@essex/arquero'
import { MessageBar, MessageBarType } from '@fluentui/react'
import { memo, useState } from 'react'
import styled from 'styled-components'

import { useTablesState } from './PrepareDataPage.hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [steps, setSteps] = useState<Step[]>([])
	const [outputTable, setOutputTable] = useState<TableContainer>()
	const [tables, updateTables] = useTablesState()
	const [message, setMessage] = useState<string>()

	return (
		<Container className={'prepare-data-page'}>
			<ProjectMgmtCommandBar
				tables={tables}
				steps={steps}
				outputTable={outputTable}
				onUpdateSteps={setSteps}
				onUpdateTables={updateTables}
				styles={mgmtStyles}
			/>
			{message && (
				<MessageBar
					messageBarType={MessageBarType.severeWarning}
					truncated={true}
					onDismiss={() => setMessage(undefined)}
					dismissButtonAriaLabel="Close"
					styles={MESSAGE_BAR_STYLES}
				>
					{' '}
					{message}{' '}
				</MessageBar>
			)}
			<Wrapper>
				<PrepareDataFull
					tables={tables}
					steps={steps}
					onUpdateSteps={setSteps}
					onOutputTable={setOutputTable}
				/>
			</Wrapper>
		</Container>
	)
})

const MESSAGE_BAR_STYLES = { root: { zIndex: 20 } }

const Container = styled.div`
	height: calc(100vh - 80px);
	position: relative;
`

const Wrapper = styled.div`
	height: 90%;
`

const mgmtStyles = {
	root: {
		height: 36,
		paddingLeft: 9,
	},
}
