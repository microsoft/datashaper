/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow } from '../../common'
import { StepComponentProps } from '../../types'
import { FilterFunction } from '../FilterFunction'

/**
 * The filter inputs for a step.
 * Input table is expected to be provided in the step input.
 */
export const FilterInputs: React.FC<StepComponentProps> = memo(
	function FilterInputs({ step, store, table, onChange, input }) {
		return (
			<Container>
				<LeftAlignedRow>
					<FilterFunction
						input={input}
						step={step}
						store={store}
						table={table}
						onChange={onChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
