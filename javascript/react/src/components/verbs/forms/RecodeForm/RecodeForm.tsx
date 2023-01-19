/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecodeArgs, Value } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import styled from '@essex/styled-components'
import { ActionButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { useMappingPairs } from '../../../../hooks/controls/useMappingPairs.js'
import {
	useColumnType,
	useHandleDelete,
	useHandleKeyChange,
	useHandleValueChange,
	useStepInputTable,
} from '../../../../hooks/index.js'
import type { StepFormProps } from '../types.js'
import {
	useColumnValues,
	useDisabled,
	useHandleAddButtonClick,
} from './RecodeForm.hooks.js'

/**
 * Provides inputs for a RecodeStep.
 */
export const RecodeForm: React.FC<StepFormProps<RecodeArgs>> = memo(
	function RecodeForm({ step, workflow, input, table, onChange }) {
		const dataTable = useStepInputTable(step, workflow, input, table)
		const dataType = useColumnType(dataTable, step.args.column)
		const initialValues = useColumnValues(step, dataTable)
		const values =
			dataType === DataType.Date
				? initialValues.map((e) => e.toISOString())
				: initialValues

		const onUpdateMapping = useCallback(
			(mapping: Record<Value, Value>) => {
				onChange?.({
					...step,
					args: {
						...step.args,
						mapping,
					},
				})
			},
			[onChange, step],
		)

		const handleRecodeKeyChange = useHandleKeyChange(
			step.args.mapping,
			onUpdateMapping,
		)
		const handleRecodeValueChange = useHandleValueChange(
			step.args.mapping,
			dataType,
			onUpdateMapping,
		)
		const handleRecodeDelete = useHandleDelete(
			step.args.mapping,
			onUpdateMapping,
		)
		const handleButtonClick = useHandleAddButtonClick(step, values, onChange)

		const columnPairs = useMappingPairs(
			step.args.mapping,
			dataType,
			handleRecodeKeyChange,
			handleRecodeValueChange,
			handleRecodeDelete,
		)

		const disabled = useDisabled(step, values)

		return (
			<Container>
				<ColumnPairs>{columnPairs}</ColumnPairs>
				<ActionButton
					onClick={handleButtonClick}
					iconProps={addIconProps}
					disabled={disabled}
				>
					Add mapping
				</ActionButton>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
`
const ColumnPairs = styled.div`
	margin-top: 8px;
	display: flex;
	flex-direction: column;
	gap: 5px;
`

const addIconProps = { iconName: 'Add' }
