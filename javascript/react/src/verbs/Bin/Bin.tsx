/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinStep } from '@data-wrangling-components/core'
import { BinStrategy } from '@data-wrangling-components/core'
import { Checkbox, Position, SpinButton } from '@fluentui/react'
import { memo, useMemo } from 'react'
import { Case, If, Switch as RawSwitch, Then as RawThen } from 'react-if'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	LeftAlignedRowWithGap,
	useHandleCheckboxChange,
	useHandleDropdownChange,
	useHandleSpinButtonChange,
} from '../../common/index.js'
import { EnumDropdown } from '../../controls/EnumDropdown.js'
import { narrowDropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'

// children was removed from FC; react-if has not been updated yet
const Switch = RawSwitch as React.FC<React.PropsWithChildren<unknown>>
const Then = RawThen as React.FC<React.PropsWithChildren<unknown>>

/**
 * Provides inputs for a binning step.
 */
export const Bin: React.FC<StepComponentProps> = memo(function Bin({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as BinStep, [step])

	const handleBinStrategyChange = useHandleDropdownChange(
		internal,
		'args.strategy',
		onChange,
	)

	const handleBinCountChange = useHandleSpinButtonChange(
		internal,
		'args.fixedcount',
		onChange,
	)
	const handleBinSizeChange = useHandleSpinButtonChange(
		internal,
		'args.fixedwidth',
		onChange,
	)

	const handleMinChange = useHandleSpinButtonChange(
		internal,
		'args.min',
		onChange,
	)

	const handleMaxChange = useHandleSpinButtonChange(
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
			<LeftAlignedRowWithGap>
				<EnumDropdown
					required
					enumeration={BinStrategy}
					label={'Bin strategy'}
					selectedKey={internal.args.strategy}
					onChange={handleBinStrategyChange}
					styles={narrowDropdownStyles}
				/>
				<Switch>
					<Case condition={internal.args.strategy === BinStrategy.FixedCount}>
						<SpinButton
							key={`spin-count`}
							label={'Bin count'}
							labelPosition={Position.top}
							min={1}
							max={100}
							step={1}
							value={
								internal.args.fixedcount
									? `${internal.args.fixedcount}`
									: undefined
							}
							styles={narrowDropdownStyles}
							onChange={handleBinCountChange}
						/>
					</Case>
					<Case condition={internal.args.strategy === BinStrategy.FixedWidth}>
						<SpinButton
							key={`spin-size`}
							label={'Bin size'}
							labelPosition={Position.top}
							value={
								internal.args.fixedwidth
									? `${internal.args.fixedwidth}`
									: undefined
							}
							styles={narrowDropdownStyles}
							onChange={handleBinSizeChange}
						/>
					</Case>
				</Switch>
			</LeftAlignedRowWithGap>
			<If condition={internal.args.strategy !== BinStrategy.Auto}>
				<Then>
					<LeftAlignedRowWithGap>
						<SpinButton
							label={'Min boundary'}
							labelPosition={Position.top}
							value={internal.args.min ? `${internal.args.min}` : undefined}
							styles={narrowDropdownStyles}
							onChange={handleMinChange}
						/>
						<SpinButton
							label={'Max boundary'}
							labelPosition={Position.top}
							value={internal.args.max ? `${internal.args.max}` : undefined}
							styles={narrowDropdownStyles}
							onChange={handleMaxChange}
						/>
					</LeftAlignedRowWithGap>
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
