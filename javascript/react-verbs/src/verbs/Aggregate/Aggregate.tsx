/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AggregateArgs } from '@data-wrangling-components/core'
import { FieldAggregateOperation } from '@data-wrangling-components/core'
import {
	EnumDropdown,
	TableColumnDropdown,
} from '@data-wrangling-components/react-controls'
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleDropdownChange } from '../../common/index.js'
import { withLoadedTable } from '../../common/withLoadedTable.js'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Aggregate = memo(
	withLoadedTable<AggregateArgs>(function Aggregate({
		step,
		onChange,
		dataTable,
	}) {
		const handleGroupColumnChange = useHandleDropdownChange(
			step,
			(s, key) => (s.args.groupby = key as string),
			onChange,
		)

		const handleOpChange = useHandleDropdownChange(
			step,
			(s, key) => (s.args.operation = key as FieldAggregateOperation),
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						table={dataTable}
						label={'Column to group by'}
						selectedKey={step.args.groupby}
						onChange={handleGroupColumnChange}
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
	justify-content: flex-start;
`
