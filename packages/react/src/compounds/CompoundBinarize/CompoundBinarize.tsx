/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeStep } from '@data-wrangling-components/core'
import { ActionButton, TextField } from '@fluentui/react'
import { memo, useMemo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useLoadTable } from '../../common'
import { FilterInputs, TableColumnDropdown } from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import type { StepComponentProps } from '../../types'
import {
	createBinarize,
	defaults,
	getBinarizeSteps,
	getColumn,
	getTo,
	updateBinarize,
	updateColumn,
	updateTo,
} from '../generators/binarize'

/**
 * Provides only the essential inputs for a multi-step binarize.
 */
export const CompoundBinarize: React.FC<StepComponentProps> = memo(
	function CompoundBinarize({ step, store, table, onChange, input }) {
		const internal = useMemo(() => defaults(step), [step])

		const tbl = useLoadTable(input || internal.input, table, store)

		const [to, setTo] = useState<string | undefined>(getTo(internal))
		const [column, setColumn] = useState<string | undefined>(
			getColumn(internal),
		)

		const handleToChange = useCallback(
			(e, value) => {
				setTo(value)
				const updated = updateTo(internal, value)
				onChange && onChange(updated)
			},
			[internal, onChange, setTo],
		)

		const handleColumnChange = useCallback(
			(e, opt) => {
				setColumn(opt.key)
				const updated = updateColumn(internal, opt.key)
				onChange && onChange(updated)
			},
			[internal, onChange, setColumn],
		)

		const handleBinarizeChange = useCallback(
			(step: BinarizeStep, index: number) => {
				const updated = updateBinarize(internal, step, index)
				onChange && onChange(updated)
			},
			[internal, onChange],
		)

		const handleButtonClick = useCallback(() => {
			const updated = createBinarize(internal, column)
			onChange && onChange(updated)
		}, [internal, onChange, column])

		const stepInputs = useMemo(() => {
			return getBinarizeSteps(internal).map((step, index) => {
				return (
					<FilterInputs
						key={`compound-binarize-${index}`}
						input={internal.input}
						step={step}
						store={store}
						onChange={s => handleBinarizeChange(s as BinarizeStep, index)}
					/>
				)
			})
		}, [internal, store, handleBinarizeChange])

		return (
			<Container>
				<LeftAlignedRow>
					<TextField
						required
						label={'New column name'}
						placeholder={'Column name'}
						value={to}
						styles={columnDropdownStyles}
						onChange={handleToChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TableColumnDropdown
						required
						label={'Column to binarize'}
						table={tbl}
						selectedKey={column}
						onChange={handleColumnChange}
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
