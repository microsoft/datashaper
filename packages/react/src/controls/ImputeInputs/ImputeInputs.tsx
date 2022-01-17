/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ImputeStep } from '@data-wrangling-components/core'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { TableColumnDropdown } from '..'
import {
	useLoadTable,
	LeftAlignedRow,
	useHandleDropdownChange,
	useHandleTextfieldChange,
} from '../../common'
import { StepComponentProps } from '../../types'
import { TextField } from '@fluentui/react'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const ImputeInputs: React.FC<StepComponentProps> = memo(
	function ImputeInputs({ step, store, table, onChange, input }) {
		const internal = useMemo(() => step as ImputeStep, [step])

		const tbl = useLoadTable(input || internal.input, table, store)

		const handleRollupColumnChange = useHandleDropdownChange(
			internal,
			'args.to',
			onChange,
		)

		const handleValueChange = useHandleTextfieldChange(
			internal,
			'args.value',
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						table={tbl}
						label={'Column to impute'}
						selectedKey={internal.args.to}
						onChange={handleRollupColumnChange}
					/>
					<TextField
						required
						label={'Fill value'}
						value={`${internal.args.value}`}
						placeholder={'text, number, or boolean'}
						onChange={handleValueChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`
