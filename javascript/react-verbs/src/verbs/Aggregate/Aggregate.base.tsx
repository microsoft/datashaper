/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FieldAggregateOperation,
	AggregateArgs,
} from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import styled from 'styled-components'
import { useMemo } from 'react'
import type { StepComponentBaseProps } from '../../types.js'
import { LeftAlignedRow } from '../../common/index.js'
import { FormInput, FormInputType, VerbInput } from '../../common/VerbInput.js'
import { getEnumDropdownOptions } from '@data-wrangling-components/react-controls'

/**
 * Just the group/column/op inputs for an aggregation.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const AggregateBase: React.FC<
	StepComponentBaseProps<AggregateArgs> & {
		columnOptions: IDropdownOption[]
	}
> = function AggregateBase({ step, onChange, columnOptions }) {
	const verbInputs = useMemo<FormInput<AggregateArgs>[]>(
		() => [
			{
				label: 'Column to group by',
				type: FormInputType.Enum,
				options: columnOptions,
				current: step.args.groupby,
				updater: (s, key) => (s.args.groupby = key as string),
				required: true,
				wrapper: LeftAlignedRow,
			},
			{
				label: 'Function',
				type: FormInputType.Enum,
				options: getEnumDropdownOptions(FieldAggregateOperation),
				current: step.args.operation,
				updater: (s, key) =>
					(s.args.operation = key as FieldAggregateOperation),
				required: true,
				wrapper: LeftAlignedRow,
			},
		],
		[],
	)

	return (
		<Container>
			<VerbInput step={step} inputs={verbInputs} onChange={onChange} />
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`
