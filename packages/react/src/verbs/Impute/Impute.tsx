/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { ImputeInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for an Input step.
 */
export const Impute: React.FC<StepComponentProps> = memo(function Impute({
	step,
	store,
	table,
	onChange,
}) {
	return (
		<Container>
			<ImputeInputs
				step={step}
				store={store}
				table={table}
				onChange={onChange}
			/>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
