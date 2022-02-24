/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import { memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic } from './hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const { setSteps, steps, tables } = useBusinessLogic()

	return (
		<Container className={'prepare-data-page'}>
			<PrepareDataFull tables={tables} steps={steps} onUpdateSteps={setSteps} />
		</Container>
	)
})

const Container = styled.div`
	height: calc(100vh - 46px);
`
