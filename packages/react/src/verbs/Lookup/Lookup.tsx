/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LookupStep } from '@data-wrangling-components/core'
import { Label } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { LeftAlignedColumn } from '../../common'
import { ColumnListInputs, JoinInputs } from '../../controls'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Lookup step.
 */
export const Lookup: React.FC<StepComponentProps> = memo(function Lookup({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as LookupStep, [step])

	return (
		<Container>
			<JoinInputs step={step} store={store} onChange={onChange} />
			<LeftAlignedColumn>
				<Label>Columns to copy</Label>
				<ColumnListInputs
					step={step}
					store={store}
					onChange={onChange}
					input={internal.args.other}
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
