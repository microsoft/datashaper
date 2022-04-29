/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { LookupArgs } from '@data-wrangling-components/core'
import { TableDropdown } from '@data-wrangling-components/react-controls'
import { useTableOptions } from '@data-wrangling-components/react-hooks'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedColumn,
	useDropdownChangeHandler,
} from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs, JoinInputs } from '../shared/index.js'

/**
 * Provides inputs for a Lookup step.
 */
export const Lookup: React.FC<StepComponentProps<LookupArgs>> = memo(
	function Lookup({ step, store, table, onChange }) {
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
				<JoinInputs
					label="lookup"
					step={step}
					store={store}
					table={table}
					onChange={onChange as any}
				/>
				<LeftAlignedColumn>
					<ColumnListInputs
						label={'Columns to copy'}
						step={step}
						store={store}
						onChange={onChange}
						input={step.input[NodeInput.Other]?.node}
					/>
				</LeftAlignedColumn>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
