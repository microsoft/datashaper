/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import { JoinStrategy } from '@data-wrangling-components/core'
import {
	dropdownStyles,
	EnumDropdown,
} from '@data-wrangling-components/react-controls'
import { memo } from 'react'
import styled from 'styled-components'

import { useHandleDropdownChange } from '../../common/hooks.js'
import { LeftAlignedColumn } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { JoinInputs } from '../shared/index.js'

/**
 * Provides inputs for a Join step.
 */
export const Join: React.FC<StepComponentProps<JoinArgs>> = memo(function Join({
	step,
	store,
	table,
	onChange,
}) {
	const handleJoinStrategyChange = useHandleDropdownChange(
		step,
		(s, val) => (s.args.strategy = val as JoinStrategy),
		onChange,
	)

	return (
		<Container>
			<JoinInputs step={step} store={store} table={table} onChange={onChange} />
			<LeftAlignedColumn>
				<EnumDropdown
					required
					label={'Join strategy'}
					enumeration={JoinStrategy}
					selectedKey={step.args.strategy || JoinStrategy.Inner}
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
