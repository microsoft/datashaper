/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseStep } from '@data-wrangling-components/core'
import { NodeInput } from '@data-wrangling-components/core'
import cloneDeep from 'lodash-es/cloneDeep.js'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { LeftAlignedRow, useLoadTable } from '../../common/index.js'
import { ColumnValueComboBox } from '../../controls/ColumnValueComboBox.js'
import { dropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Erase: React.FC<StepComponentProps> = memo(function Erase({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as EraseStep, [step])

	const tbl = useLoadTable(
		input || step.inputs[NodeInput.Input]?.node,
		table,
		store,
	)

	const handleComboBoxChange = useCallback(
		(_event, option, value) => {
			const update = cloneDeep(step)
			set(update, 'args.value', option ? option.key : value)
			onChange && onChange(update)
		},
		[step, onChange],
	)

	return (
		<Container>
			<LeftAlignedRow>
				<ColumnValueComboBox
					required
					table={tbl}
					label={'Value to be erased'}
					placeholder={'value'}
					columnName={internal.args.column}
					text={internal.args.value && `${internal.args.value}`}
					selectedKey={internal.args.value}
					onChange={handleComboBoxChange}
					styles={dropdownStyles}
				/>
			</LeftAlignedRow>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`
