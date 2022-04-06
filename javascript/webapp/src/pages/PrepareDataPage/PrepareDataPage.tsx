/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { DropzoneStyles } from '@data-wrangling-components/react'
import {
	Dropzone,
	PrepareDataFull,
	ProjectMgmtCommandBar,
	useHandleFileUpload,
} from '@data-wrangling-components/react'
import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileExtensions } from '@data-wrangling-components/utilities'
import { MessageBar, MessageBarType } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useTablesState } from './hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [steps, setSteps] = useState<Step[]>([])
	const [outputTable, setOutputTable] = useState<TableContainer>()
	const [tables, updateTables] = useTablesState()
	const handleFileUpload = useHandleFileUpload(setSteps, updateTables)
	const [message, setMessage] = useState<string>()

	const handleDropAcceppted = useCallback(
		(fc: FileCollection) => {
			setMessage(undefined)
			handleFileUpload(fc)
		},
		[setMessage, handleFileUpload],
	)

	return (
		<Container className={'prepare-data-page'}>
			<Dropzone
				acceptedFileTypes={[
					FileExtensions.csv,
					FileExtensions.zip,
					FileExtensions.json,
				]}
				onDropAccepted={handleDropAcceppted}
				onDropRejected={setMessage}
				showPlaceholder={false}
				dropzoneOptions={{ noClick: true }}
				styles={dropzoneStyles as DropzoneStyles}
			/>
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
					styles={{ root: { zIndex: 20 } }}
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

const dropzoneStyles = {
	container: {
		position: 'absolute',
		width: '98%',
		height: '2rem',
		borderColor: 'transparent',
		margin: '0 1%',
		padding: 0,
		borderRadius: 0,
		overflow: 'hidden',
	},
	dragReject: {
		width: '100%',
		height: '100%',
		zIndex: 100,
	},
}
