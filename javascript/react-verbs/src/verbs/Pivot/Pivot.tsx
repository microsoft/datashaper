/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
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
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Pivot: React.FC<StepComponentProps<PivotArgs>> = memo(
	withLoadedTable(function Pivot({ step, onChange, dataTable }) {
		const handleKeyColumnChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.key = val as string),
			onChange,
		)

		const handleValueColumnChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.value = val as string),
			onChange,
		)

		const handleOpChange = useHandleDropdownChange(
			step,
			(s, val) => (s.args.operation = val as FieldAggregateOperation),
			onChange,
		)
		const options = useTableColumnOptions(dataTable)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						options={options}
						label={'Column used as key'}
						selectedKey={step.args.key}
						onChange={handleKeyColumnChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						options={options}
						label={'Column used as value'}
						selectedKey={step.args.value}
						onChange={handleValueColumnChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<EnumDropdown
						required
						enumeration={FieldAggregateOperation}
						label={'Function'}
						selectedKey={step.args.operation}
						onChange={handleOpChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	}),
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-content: flex-start;
	justify-content: flex-start;
`
