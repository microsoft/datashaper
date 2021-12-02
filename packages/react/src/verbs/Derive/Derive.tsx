/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DeriveStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import { internal as ArqueroTypes } from 'arquero'
import React, { memo, useMemo, useState } from 'react'
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
	onChange,
}) {
	const internal = useMemo(() => step as DeriveStep, [step])

	const [table, setTable] = useState<ArqueroTypes.ColumnTable | undefined>()
	useLoadTable(internal.input, store, setTable)

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
	const handleAsChange = useHandleTextfieldChange(internal, 'args.as', onChange)

	return (
		<Container>
			<LeftAlignedRow>
				<TextField
					required
					label={'New column name'}
					placeholder={'Column name'}
					value={internal.args.as}
					styles={columnDropdownStyles}
					onChange={handleAsChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TableColumnDropdown
					table={table}
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
					table={table}
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
