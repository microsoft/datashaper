/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchArgs } from '@data-wrangling-components/core'
import { dropdownStyles } from '@data-wrangling-components/react-controls'
import { Position, SpinButton, TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import {
	useHandleSpinButtonChange,
	useHandleTextFieldChange,
} from '../../common/hooks.js'
import { LeftAlignedRow } from '../../common/styles.js'
import type { StepComponentProps } from '../../types'

import { num } from '@data-wrangling-components/primitives'

/**
 * Provides inputs for a Fetch step.
 */
export const Fetch: React.FC<StepComponentProps<FetchArgs>> = memo(
	function Fetch({ step, onChange }) {
		const handleUrlChange = useHandleTextFieldChange(
			step,
			(s, val) => (s.args.url = val as string),
			onChange,
		)

		const handleDelimiterChange = useHandleTextFieldChange(
			step,
			(s, val) => (s.args.delimiter = val),
			onChange,
		)

		const handleAutoMaxChange = useHandleSpinButtonChange(
			step,
			(s, val) => (s.args.autoMax = num(val)),
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TextField
						required
						label={'URL'}
						value={step.args.url && `${step.args.url}`}
						placeholder={'URL to public dataset'}
						styles={dropdownStyles}
						onChange={handleUrlChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TextField
						label={'Delimiter'}
						value={step.args.delimiter && `${step.args.delimiter}`}
						placeholder={'Column delimiter'}
						styles={dropdownStyles}
						onChange={handleDelimiterChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<SpinButton
						key={`Automax`}
						label={'Automax'}
						labelPosition={Position.top}
						min={0}
						max={10000000}
						step={1}
						value={step.args.autoMax ? `${step.args.autoMax}` : undefined}
						styles={dropdownStyles}
						onChange={handleAutoMaxChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
