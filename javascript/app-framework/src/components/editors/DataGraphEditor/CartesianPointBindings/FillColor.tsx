/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { ColorBinding } from '@datashaper/workflow'

import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { Column } from './Column.js'
import styled from 'styled-components'
import { Dropdown } from '@fluentui/react'

export interface FillColorProps {
	binding: ColorBinding
	table: ColumnTable | undefined
}

export const FillColor: React.FC<FillColorProps> = memo(
	function FillColor({ binding, table }) {
		return (
			<FlexContainer>
				<Column table={table} binding={binding} />
				<Dropdown
					label={'Color scale'}
					options={scaleOptions}
					onChange={(_, option) => {
						binding.scale = option?.key as string
					}}
					selectedKey={binding.scale}
				/>
			</FlexContainer>
		)
	},
)

const FlexContainer = styled.div`
		display: flex;
		flex-direction: column;
		gap: 12px;
	`

	const scaleOptions = [{
		key: 'nominal',
		text: 'Nominal'
	}, {
		key: 'nominalMuted',
		text: 'Nominal Muted'
	}, {
		key: 'nominalBold',
		text: 'Nominal Bold'
	}]