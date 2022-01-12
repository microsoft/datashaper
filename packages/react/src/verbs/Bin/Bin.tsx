/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { BinStep, BinArgs, BinStrategy } from '@data-wrangling-components/core'
import { Checkbox, TextField } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import { Switch, Case, If, Then } from 'react-if'
import styled from 'styled-components'
import {
	useHandleTextfieldChange,
	LeftAlignedRow,
	useHandleDropdownChange,
	useLoadTable,
	useHandleCheckboxChange,
} from '../../common'
import { TableColumnDropdown, BinStrategyDropdown } from '../../controls'
import { columnDropdownStyles } from '../../controls/styles'
import { StepComponentProps } from '../../types'

/**
 * Provides inputs for a binning step.
 */
export const Bin: React.FC<StepComponentProps> = memo(function Bin({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(
		() =>
			({
				...step,
				args: {
					strategy: BinStrategy.Auto,
					...(step.args as Partial<BinArgs>),
				},
			} as BinStep),
		[step],
	)

	const tbl = useLoadTable(input || step.input, table, store)

	const handleToChange = useHandleTextfieldChange(internal, 'args.to', onChange)

	const handleBinColumnChange = useHandleDropdownChange(
		internal,
		'args.column',
		onChange,
	)

	const handleBinStrategyChange = useHandleDropdownChange(
		internal,
		'args.strategy',
		onChange,
	)

	const handleBinCountChange = useHandleTextfieldChange(
		internal,
		'args.fixedcount',
		onChange,
	)
	const handleBinSizeChange = useHandleTextfieldChange(
		internal,
		'args.fixedwidth',
		onChange,
	)

	const handleMinChange = useHandleTextfieldChange(
		internal,
		'args.min',
		onChange,
	)

	const handleMaxChange = useHandleTextfieldChange(
		internal,
		'args.max',
		onChange,
	)

	const handleClampChange = useHandleCheckboxChange(
		internal,
		'args.clamped',
		onChange,
	)

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
				<TableColumnDropdown
					required
					table={tbl}
					label={'Column to bin'}
					selectedKey={internal.args.column}
					onChange={handleBinColumnChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<BinStrategyDropdown
					required
					selectedKey={internal.args.strategy}
					onChange={handleBinStrategyChange}
				/>
				<Switch>
					<Case condition={internal.args.strategy === BinStrategy.FixedCount}>
						<TextField
							required
							label={'Bin count'}
							placeholder={'number of bins'}
							value={
								internal.args.fixedcount
									? `${internal.args.fixedcount}`
									: undefined
							}
							styles={columnDropdownStyles}
							onChange={handleBinCountChange}
						/>
					</Case>
					<Case condition={internal.args.strategy === BinStrategy.FixedWidth}>
						<TextField
							required
							label={'Bin size'}
							placeholder={'width per bin'}
							value={
								internal.args.fixedwidth
									? `${internal.args.fixedwidth}`
									: undefined
							}
							styles={columnDropdownStyles}
							onChange={handleBinSizeChange}
						/>
					</Case>
				</Switch>
			</LeftAlignedRow>
			<If condition={internal.args.strategy !== BinStrategy.Auto}>
				<Then>
					<LeftAlignedRow>
						<TextField
							label={'Min boundary'}
							placeholder={'min value'}
							value={internal.args.min ? `${internal.args.min}` : undefined}
							styles={columnDropdownStyles}
							onChange={handleMinChange}
						/>
						<TextField
							label={'Max boundary'}
							placeholder={'max value'}
							value={internal.args.max ? `${internal.args.max}` : undefined}
							styles={columnDropdownStyles}
							onChange={handleMaxChange}
						/>
					</LeftAlignedRow>
					<LeftAlignedRow>
						<Checkbox
							label={'Clamp to min/max'}
							checked={internal.args.clamped}
							onChange={handleClampChange}
						/>
					</LeftAlignedRow>
				</Then>
			</If>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
