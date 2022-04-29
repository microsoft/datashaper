/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { JoinArgs } from '@data-wrangling-components/core'
import { JoinStrategy } from '@data-wrangling-components/core'
import {
	dropdownStyles,
	EnumDropdown,
	TableDropdown,
} from '@data-wrangling-components/react-controls'
import { useTableOptions } from '@data-wrangling-components/react-hooks'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'
import styled from 'styled-components'

import { useDropdownChangeHandler } from '../../common/hooks.js'
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
	const handleJoinStrategyChange = useDropdownChangeHandler(
		step,
		(s, val) => (s.args.strategy = val as JoinStrategy),
		onChange,
	)
	const handleRightTableChange = useDropdownChangeHandler(
		step,
		(s, val) => (s.input[NodeInput.Other] = { node: val as string }),
		onChange,
	)
	const tableOptions = useTableOptions(store)

	return (
		<Container>
			<LeftAlignedColumn>
				<TableDropdown
					options={tableOptions}
					label="Join table"
					selectedKey={step.input[NodeInput.Other]?.node}
					onChange={handleRightTableChange}
				/>
			</LeftAlignedColumn>
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
			<JoinInputs step={step} store={store} table={table} onChange={onChange} />
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
