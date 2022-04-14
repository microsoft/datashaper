/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupStep } from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { LeftAlignedColumn } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs, JoinInputs } from '../shared/index.js'

/**
 * Provides inputs for a Lookup step.
 */
export const Lookup: React.FC<StepComponentProps> = memo(function Lookup({
	step,
	store,
	table,
	onChange,
}) {
	const internal = useMemo(() => step as LookupStep, [step])

	return (
		<Container>
			<JoinInputs
				label="lookup"
				step={step}
				store={store}
				table={table}
				onChange={onChange}
			/>
			<LeftAlignedColumn>
				<ColumnListInputs
					label={'Columns to copy'}
					step={step}
					store={store}
					onChange={onChange}
					input={internal.input[NodeInput.Other]?.node}
				/>
			</LeftAlignedColumn>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
