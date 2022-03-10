/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FoldStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleTextfieldChange } from '../../common'
import { dropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types'
import { ColumnListInputs } from '../shared/index.js'

/**
 * Provides inputs for a step that needs lists of columns.
 */
export const Fold: React.FC<StepComponentProps> = memo(function Fold({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as FoldStep, [step])

	const handleToChange = useHandleTextfieldChange(
		internal,
		'args.to[0]',
		onChange,
	)
	const handleToChange2 = useHandleTextfieldChange(
		internal,
		'args.to[1]',
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
					value={internal.args.to !== undefined ? internal.args.to[0] : ''}
					styles={dropdownStyles}
					onChange={handleToChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TextField
					required
					label={'Value name to use'}
					placeholder={'Value name to use'}
					value={internal.args.to !== undefined ? internal.args.to[1] : ''}
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
