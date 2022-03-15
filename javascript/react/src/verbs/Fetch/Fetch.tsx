/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchStep } from '@data-wrangling-components/core'
import { Position, SpinButton, TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { dropdownStyles } from '../../controls/styles.js'
import {
	LeftAlignedRow,
	useHandleSpinButtonChange,
	useHandleTextfieldChange,
} from '../../index.js'
import type { StepComponentProps } from '../../types'

/**
 * Provides inputs for a Fetch step.
 */
export const Fetch: React.FC<StepComponentProps> = memo(function Fetch({
	step,
	onChange,
}) {
	const internal = useMemo(() => step as FetchStep, [step])

	const handleUrlChange = useHandleTextfieldChange(
		internal,
		'args.url',
		onChange,
	)

	const handleDelimiterChange = useHandleTextfieldChange(
		internal,
		'args.delimiter',
		onChange,
	)

	const handleAutoMaxChange = useHandleSpinButtonChange(
		internal,
		'args.autoMax',
		onChange,
	)

	return (
		<Container>
			<LeftAlignedRow>
				<TextField
					required
					label={'URL'}
					value={internal.args.url && `${internal.args.url}`}
					placeholder={'URL to public dataset'}
					styles={dropdownStyles}
					onChange={handleUrlChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TextField
					label={'Delimiter'}
					value={internal.args.delimiter && `${internal.args.delimiter}`}
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
					value={internal.args.autoMax ? `${internal.args.autoMax}` : undefined}
					styles={dropdownStyles}
					onChange={handleAutoMaxChange}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`
