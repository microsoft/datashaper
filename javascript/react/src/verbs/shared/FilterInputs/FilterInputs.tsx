/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow } from '../../../common/index.js'
import type { StepComponentProps } from '../../../types.js'
import { FilterFunction } from '../FilterFunction/index.js'

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
