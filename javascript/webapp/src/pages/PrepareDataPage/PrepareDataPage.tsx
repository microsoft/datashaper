/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import type { DropzoneStyles } from '@data-wrangling-components/react'
import {
	Dropzone,
	PrepareDataFull,
	ProjectMgmtCommandBar,
	useHandleFileUpload,
} from '@data-wrangling-components/react'
import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileExtensions } from '@data-wrangling-components/utilities'
import type { TableContainer } from '@essex/arquero'
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
				acceptedFileTypes={FILE_TYPES}
				onDropAccepted={handleDropAcceppted}
				onDropRejected={setMessage}
				showPlaceholder={false}
				dropzoneOptions={DROPZONE_OPTIONS}
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

const FILE_TYPES = [FileExtensions.csv, FileExtensions.zip, FileExtensions.json]
const DROPZONE_OPTIONS = { noClick: true }
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
