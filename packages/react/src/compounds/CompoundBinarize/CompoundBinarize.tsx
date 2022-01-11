/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, TextField } from '@fluentui/react'
import React, { memo, useMemo, useCallback } from 'react'
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
	function CompoundBinarize({ step, store, table, onChange, input }) {
		const internal = useMemo(() => defaults(step), [step])

		const tbl = useLoadTable(input || internal.input, table, store)

		const handleToChange = useCallback(
			(e, v) => {
				const updated = update({
					...internal,
					to: v,
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
						input={step.input}
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
						value={internal.to}
						styles={columnDropdownStyles}
						onChange={handleToChange}
					/>
				</LeftAlignedRow>
				{stepInputs}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={!tbl}
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
