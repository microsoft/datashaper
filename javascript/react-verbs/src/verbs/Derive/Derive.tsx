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
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleDropdownChange } from '../../common/index.js'
import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'
import { useTableColumnOptions } from '@data-wrangling-components/react-hooks'

/**
 * Provides inputs for a Binarize step.
 */
export const Derive: React.FC<StepComponentProps<DeriveArgs>> = memo(
	withLoadedTable(function Derive({ step, onChange, dataTable }) {
		const handleLeftColumnChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.column1 = val as string),
			onChange,
		)
		const handleRightColumnChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.column2 = val as string),
			onChange,
		)
		const handleOpChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.operator = val as MathOperator),
			onChange,
		)
		const options = useTableColumnOptions(dataTable)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						options={options}
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
						options={options}
						required
						label={'Column two'}
						selectedKey={step.args.column2}
						onChange={handleRightColumnChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	}),
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
