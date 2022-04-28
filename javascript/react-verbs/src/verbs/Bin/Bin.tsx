/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@data-wrangling-components/core'
import { BinStrategy } from '@data-wrangling-components/core'
import { num } from '@data-wrangling-components/primitives'
import {
	EnumDropdown,
	narrowDropdownStyles,
} from '@data-wrangling-components/react-controls'
import { Checkbox, Position, SpinButton } from '@fluentui/react'
import { memo } from 'react'
import { Case, If, Switch, Then } from 'react-if'
import styled from 'styled-components'

import type {
	CheckboxChangeHandler,
	SpinButtonChangeHandler,
} from '../../common/hooks.js'
import {
	LeftAlignedRow,
	useCheckboxChangeHandler,
	useDropdownChangeHandler,
	useSpinButtonChangeHandler,
} from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Provides inputs for a binning step.
 */
export const Bin: React.FC<StepComponentProps<BinArgs>> = memo(function Bin({
	step,
	onChange,
}) {
	const handleBinStrategyChange = useDropdownChangeHandler(
		step,
		(s, opt) => (s.args.strategy = opt as BinStrategy),
		onChange,
	)
	const handleBinCountChange = useSpinButtonChangeHandler(
		step,
		(s, opt) => (s.args.fixedcount = num(opt)),
		onChange,
	)
	const handleBinSizeChange = useSpinButtonChangeHandler(
		step,
		(s, opt) => (s.args.fixedwidth = num(opt)),
		onChange,
	)
	const handleMinChange = useSpinButtonChangeHandler(
		step,
		(s, opt) => (s.args.min = num(opt)),
		onChange,
	)
	const handleMaxChange = useSpinButtonChangeHandler(
		step,
		(s, opt) => (s.args.max = num(opt)),
		onChange,
	)
	const handleClampChange = useCheckboxChangeHandler(
		step,
		(s, opt) => (s.args.clamped = opt),
		onChange,
	)
	const handlePrintChange = useCheckboxChangeHandler(
		step,
		(s, opt) => (s.args.printRange = opt),
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRowWithGap>
				<EnumDropdown
					required
					enumeration={BinStrategy}
					label={'Bin strategy'}
					selectedKey={step.args.strategy}
					onChange={handleBinStrategyChange}
					styles={narrowDropdownStyles}
				/>
				<Switch>
					<Case condition={step.args.strategy === BinStrategy.FixedCount}>
						<BinCount
							fixedcount={step.args.fixedcount}
							onBinCountChange={handleBinCountChange}
						/>
					</Case>
					<Case condition={step.args.strategy === BinStrategy.FixedWidth}>
						<BinSize
							fixedwidth={step.args.fixedwidth}
							onBinSizeChange={handleBinSizeChange}
						/>
					</Case>
				</Switch>
			</LeftAlignedRowWithGap>
			<If condition={step.args.strategy !== BinStrategy.Auto}>
				<Then>
					<BinningParams
						min={step.args.min}
						max={step.args.max}
						clamped={step.args.clamped}
						onMinChange={handleMinChange}
						onMaxChange={handleMaxChange}
						onClampChange={handleClampChange}
					/>
				</Then>
			</If>
			<LeftAlignedRow>
				<Checkbox
					label={'Print range as output'}
					checked={step.args.printRange}
					onChange={handlePrintChange}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const BinCount: React.FC<{
	fixedcount: number | undefined
	onBinCountChange: SpinButtonChangeHandler
}> = memo(function BinCount({ fixedcount, onBinCountChange }) {
	return (
		<SpinButton
			key={`spin-count`}
			label={'Bin count'}
			labelPosition={Position.top}
			min={1}
			max={100}
			step={1}
			value={fixedcount ? `${fixedcount}` : undefined}
			styles={narrowDropdownStyles}
			onChange={onBinCountChange}
		/>
	)
})

const BinSize: React.FC<{
	fixedwidth: number | undefined
	onBinSizeChange: SpinButtonChangeHandler
}> = memo(function BinSize({ fixedwidth, onBinSizeChange }) {
	return (
		<SpinButton
			key={`spin-size`}
			label={'Bin size'}
			labelPosition={Position.top}
			value={fixedwidth ? `${fixedwidth}` : undefined}
			styles={narrowDropdownStyles}
			onChange={onBinSizeChange}
		/>
	)
})

const BinningParams: React.FC<{
	min: number | undefined
	max: number | undefined
	clamped: boolean | undefined
	onMinChange: SpinButtonChangeHandler
	onMaxChange: SpinButtonChangeHandler
	onClampChange: CheckboxChangeHandler
}> = memo(function BinningParams({
	min,
	max,
	clamped,
	onMinChange,
	onMaxChange,
	onClampChange,
}) {
	return (
		<>
			<LeftAlignedRowWithGap>
				<SpinButton
					label={'Min boundary'}
					labelPosition={Position.top}
					value={min ? `${min}` : undefined}
					styles={narrowDropdownStyles}
					onChange={onMinChange}
				/>
				<SpinButton
					label={'Max boundary'}
					labelPosition={Position.top}
					value={max ? `${max}` : undefined}
					styles={narrowDropdownStyles}
					onChange={onMaxChange}
				/>
			</LeftAlignedRowWithGap>
			<LeftAlignedRow>
				<Checkbox
					label={'Clamp to min/max'}
					checked={clamped}
					onChange={onClampChange}
				/>
			</LeftAlignedRow>
		</>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const LeftAlignedRowWithGap = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-end;
	margin-bottom: 8px;
	gap: 12px;
`
