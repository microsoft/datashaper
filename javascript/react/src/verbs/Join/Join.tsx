/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinStep } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useHandleDropdownChange } from '../../common/hooks.js'
import { LeftAlignedColumn } from '../../common/index.js'
import { JoinStrategyDropdown } from '../../controls/dropdowns/JoinStrategyDropdown.js'
import { dropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'
import { JoinInputs } from '../shared/index.js'

/**
 * Provides inputs for a Join step.
 */
export const Join: React.FC<StepComponentProps> = memo(function Join({
	step,
	store,
	table,
	onChange,
}) {
	const internal = useMemo(() => step as JoinStep, [step])

	const handleJoinStrategyChange = useHandleDropdownChange(
		internal,
		'args.strategy',
		onChange,
	)

	return (
		<Container>
			<JoinInputs step={step} store={store} table={table} onChange={onChange} />
			<LeftAlignedColumn>
				<JoinStrategyDropdown
					required
					selectedKey={internal.args.strategy}
					styles={dropdownStyles}
					onChange={handleJoinStrategyChange}
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
