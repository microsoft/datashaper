/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DeriveStep } from '@data-wrangling-components/core'
import { MathOperator } from '@data-wrangling-components/core'
import { EnumDropdown , TableColumnDropdown } from '@data-wrangling-components/react-controls'
import { NodeInput } from '@essex/dataflow'
import { memo, useMemo } from 'react'
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
export const Derive: React.FC<StepComponentProps> = memo(function Derive({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as DeriveStep, [step])

	const tbl = useLoadTable(
		input || step.input[NodeInput.Source]?.node,
		table,
		store,
	)

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

	return (
		<Container>
			<LeftAlignedRow>
				<TableColumnDropdown
					table={tbl}
					required
					label={'Column one'}
					selectedKey={internal.args.column1}
					onChange={handleLeftColumnChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<EnumDropdown
					required
					enumeration={MathOperator}
					label={'Operation'}
					selectedKey={internal.args.operator}
					onChange={handleOpChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
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
