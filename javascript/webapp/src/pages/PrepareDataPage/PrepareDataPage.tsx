/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	PrepareDataFull,
	ProjectMgmtCommandBar,
} from '@data-wrangling-components/react'
import { memo } from 'react'
import styled from 'styled-components'

import { useSteps, useTables } from './PrepareDataPage.hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	
	const {
		steps,
		onUpdateSteps
	} = useSteps()
	
	const {
		tables,
		onAddTables,
		output,
		onUpdateOutput
	} = useTables()

	return (
		<Container className={'prepare-data-page'}>
			<ProjectMgmtCommandBar
				tables={tables}
				steps={steps}
				outputTable={output}
				onUpdateSteps={onUpdateSteps}
				onUpdateTables={onAddTables}
				styles={mgmtStyles}
			/>
			<Wrapper>
				<PrepareDataFull
					tables={tables}
					steps={steps}
					onUpdateSteps={onUpdateSteps}
					onOutputTable={onUpdateOutput}
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
