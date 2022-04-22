/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldArgs } from '@data-wrangling-components/core'
import { dropdownStyles } from '@data-wrangling-components/react-controls'
import { TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useHandleTextFieldChange } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Fold: React.FC<StepComponentProps<FoldArgs>> = memo(function Fold({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const handleToChange = useHandleTextFieldChange(
		step,
		(s, val) => (s.args.to![0] = val as string),
		onChange,
	)
	const handleToChange2 = useHandleTextFieldChange(
		step,
		(s, val) => (s.args.to![1] = val as string),
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<ColumnListInputs
					step={step}
					store={store}
					table={table}
					onChange={onChange}
					input={input}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TextField
					required
					label={'Key name to use'}
					placeholder={'Key name to use'}
					value={step.args.to !== undefined ? step.args.to[0] : ''}
					styles={dropdownStyles}
					onChange={handleToChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TextField
					required
					label={'Value name to use'}
					placeholder={'Value name to use'}
					value={step.args.to !== undefined ? step.args.to[1] : ''}
					styles={dropdownStyles}
					onChange={handleToChange2}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
