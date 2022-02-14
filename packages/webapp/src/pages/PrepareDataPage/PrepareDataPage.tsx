/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic, useDropzoneProps } from './hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const {
		setSteps,
		steps,
		files,
		handleDropFiles,
		handleDeleteFile,
		onChangeSpecification,
		onResetSteps,
		onResetFullData,
	} = useBusinessLogic()

	const dropzone = useDropzoneProps(
		handleDropFiles,
		onResetSteps,
		onResetFullData,
		onChangeSpecification,
	)

	return (
		<Container>
			<PrepareDataFull
				dropzoneProps={dropzone}
				onDeleteFile={handleDeleteFile}
				files={files}
				steps={steps}
				onUpdateSteps={setSteps}
			/>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`
