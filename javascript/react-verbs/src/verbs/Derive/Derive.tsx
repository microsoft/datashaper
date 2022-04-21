/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveArgs } from '@data-wrangling-components/core'
import { MathOperator } from '@data-wrangling-components/core'
import {
	EnumDropdown,
	TableColumnDropdown,
} from '@data-wrangling-components/react-controls'
import { NodeInput } from '@essex/dataflow'
import { memo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleDropdownChange,
	useLoadTable,
} from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a Binarize step.
 */
export const Derive: React.FC<StepComponentProps<DeriveArgs>> = memo(
	function Derive({ step, store, table, onChange, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)

		const handleLeftColumnChange = useHandleDropdownChange(
			step,
			'args.column1',
			onChange,
		)
		const handleRightColumnChange = useHandleDropdownChange(
			step,
			'args.column2',
			onChange,
		)
		const handleOpChange = useHandleDropdownChange(
			step,
			'args.operator',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						table={tbl}
						required
						label={'Column one'}
						selectedKey={step.args.column1}
						onChange={handleLeftColumnChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<EnumDropdown
						required
						enumeration={MathOperator}
						label={'Operation'}
						selectedKey={step.args.operator}
						onChange={handleOpChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TableColumnDropdown
						table={tbl}
						required
						label={'Column two'}
						selectedKey={step.args.column2}
						onChange={handleRightColumnChange}
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
