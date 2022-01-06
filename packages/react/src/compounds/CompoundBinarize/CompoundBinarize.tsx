/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, TextField } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useLoadTable } from '../../common'
import { FilterInputs } from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'
import { create, defaults, filter, update } from '../generators/binarize'

/**
 * Provides only the essential inputs for a multi-step binarize.
 */
export const CompoundBinarize: React.FC<StepComponentProps> = memo(
	function CompoundBinarize({ step, store, onChange }) {
		const internal = useMemo(() => defaults(step), [step])

		const [table, setTable] = useState<ColumnTable | undefined>()
		useLoadTable(internal.input, store, setTable)

		const handleAsChange = useCallback(
			(e, v) => {
				const updated = update({
					...internal,
					as: v,
				})
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleStepChange = useCallback(
			(s, i) => {
				const updated = update(internal, s, i)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleButtonClick = useCallback(() => {
			const updated = create(internal)
			onChange && onChange(updated)
		}, [internal, onChange])

		const stepInputs = useMemo(() => {
			return filter(internal).map((step, index) => {
				return (
					<FilterInputs
						key={`compound-binarize-${index}`}
						input={internal.input}
						step={step}
						store={store}
						onChange={s => handleStepChange(s, index)}
					/>
				)
			})
		}, [internal, store, handleStepChange])

		return (
			<Container>
				<LeftAlignedRow>
					<TextField
						required
						label={'New column name'}
						placeholder={'Column name'}
						value={internal.as}
						styles={columnDropdownStyles}
						onChange={handleAsChange}
					/>
				</LeftAlignedRow>
				{stepInputs}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!table}
				>
					Add criteria
				</ActionButton>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
