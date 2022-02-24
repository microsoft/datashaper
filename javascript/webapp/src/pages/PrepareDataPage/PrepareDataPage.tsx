/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import { memo, useEffect } from 'react'
import styled from 'styled-components'
import { useHelpFileContentSetter } from '../../states/helpFileContent.js'
import { useBusinessLogic } from './hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const { setSteps, steps, tables } = useBusinessLogic()
	const setHelpFileContent = useHelpFileContentSetter()

	useEffect(() => {
		const content = `The pipeline builder web application allows you to perform lightweight data wrangling by constructing a series of transformation steps. At the top left of the window is the list of your input tables. Clicking on any of these tables will display the content in the preview pane to the right.
		\nBelow the tables is a tray for the pipeline's steps. Click "Add step" to create your first transformation. A dialog will open where you can select the type of transformation to apply (i.e., the "verb"). Once you select a verb, the dialog will populate with the required input controls for the verb to execute. Fill these in and click "Save".
		\nThe pipeline you build will run immediately whenever you add or edit steps. The lastest output will be displayed in the bottom half of the window.
		\nYou can add as many steps as you need to craft an output table, and any intermediate tables that are created by the steps are available for use by following steps as well.`

		setHelpFileContent(content)
	})

	return (
		<Container>
			<PrepareDataFull tables={tables} steps={steps} onUpdateSteps={setSteps} />
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`
