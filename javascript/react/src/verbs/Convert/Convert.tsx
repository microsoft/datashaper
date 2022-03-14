/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertStep } from '@data-wrangling-components/core'
import { ParseType } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { useHandleDropdownChange } from '../../common/hooks.js'
import { LeftAlignedColumn } from '../../common/index.js'
import { EnumDropdown } from '../../controls/EnumDropdown.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps> = memo(function Convert({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as ConvertStep, [step])

	const handleTypeChange = useHandleDropdownChange(
		internal,
		'args.type',
		onChange,
	)

	return (
		<Container>
			<LeftAlignedColumn>
				<ColumnListInputs
					label={'Columns to convert'}
					step={step}
					store={store}
					onChange={onChange}
				/>
			</LeftAlignedColumn>
			<LeftAlignedColumn>
				<EnumDropdown
					required
					label={'Data type'}
					enumeration={ParseType}
					selectedKey={internal.args.type}
					onChange={handleTypeChange}
				/>
			</LeftAlignedColumn>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
