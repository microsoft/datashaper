/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FetchStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { LeftAlignedRow, useHandleTextfieldChange } from '../../index.js'
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

	return (
		<Container>
			<LeftAlignedRow>
				<TextField
					required
					label={'URL'}
					value={internal.args.url && `${internal.args.url}`}
					placeholder={'URL to public dataset'}
					onChange={handleUrlChange}
				/>
			</LeftAlignedRow>
			<LeftAlignedRow>
				<TextField
					label={'Delimiter'}
					value={internal.args.delimiter && `${internal.args.delimiter}`}
					placeholder={'Column delimiter'}
					onChange={handleDelimiterChange}
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
