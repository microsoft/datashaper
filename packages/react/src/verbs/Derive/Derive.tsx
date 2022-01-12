/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DeriveStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'

import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import {
	useHandleDropdownChange,
	useHandleTextfieldChange,
	useLoadTable,
	LeftAlignedRow,
} from '../../common'
import { MathOperatorDropdown, TableColumnDropdown } from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Binarize step.
 */
export const Derive: React.FC<StepComponentProps> = memo(function Derive({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as DeriveStep, [step])

	const tbl = useLoadTable(input || step.input, table, store)

	const handleLeftColumnChange = useHandleDropdownChange(
		internal,
		'args.column1',
		onChange,
	)
	const handleRightColumnChange = useHandleDropdownChange(
		internal,
		'args.column2',
		onChange,
	)
	const handleOpChange = useHandleDropdownChange(
		internal,
		'args.operator',
		onChange,
	)
	const handleToChange = useHandleTextfieldChange(internal, 'args.to', onChange)

	return (
		<Container>
			<LeftAlignedRow>
				<TextField
					required
					label={'New column name'}
					placeholder={'Column name'}
					value={internal.args.to}
					styles={columnDropdownStyles}
					onChange={handleToChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TableColumnDropdown
					table={tbl}
					required
					label={'Column one'}
					selectedKey={internal.args.column1}
					onChange={handleLeftColumnChange}
				/>
				<MathOperatorDropdown
					selectedKey={internal.args.operator}
					onChange={handleOpChange}
				/>
				<TableColumnDropdown
					table={tbl}
					required
					label={'Column two'}
					selectedKey={internal.args.column2}
					onChange={handleRightColumnChange}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
