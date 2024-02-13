/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnArgs,
	InputColumnListArgs,
	OutputColumnArgs,
} from '@datashaper/schema'
import {
	isInputColumnListStep,
	isInputColumnStep,
	isOutputColumnStep,
	NodeInput,
} from '@datashaper/workflow'
import { MultiDropdown } from '@essex/components'
import { TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { useColumnNames } from '../../hooks/columns/useColumnNames.js'
import { useSimpleDropdownOptions } from '../../hooks/fluent/useSimpleDropdownOptions.js'
import { useWorkflowDataTable } from '../../hooks/index.js'
import { TableColumnDropdown } from '../controls/TableColumnDropdown/TableColumnDropdown.js'
import { dropdownStyles } from '../styles.js'
import {
	getSimpleDropdownOptions,
	useColumnFilter,
	useDefaultOutputNameInitially,
	useInputColumnChanged,
	useInputColumnListAllChanged,
	useInputColumnListChanged,
	useOutputColumnChanged,
	useStepArgsComponent,
	useStepChangeHandler,
} from './StepForm.hooks.js'
import { Container } from './StepForm.styles.js'
import type { StepFormProps } from './StepForm.types.js'
import { getInputNode } from '../../util.js'

/**
 * Let's us render the Steps in a loop while memoizing all the functions
 */
export const StepForm: React.FC<StepFormProps> = memo(function StepForm({
	step: s,
	output,
	workflow: g,
	metadata,
	index,
	onChange,
	onChangeOutput: changeOutput,
	hideInputColumn,
}) {
	/* Current Table Selection */
	const tableId = getInputNode(s, NodeInput.Source)
	const table = useWorkflowDataTable(tableId, g)

	/* Column Options */
	const columns = useColumnNames(table, useColumnFilter(s, table))
	const columnOptions = useSimpleDropdownOptions(columns)

	/* The step args component */
	const StepArgs = useStepArgsComponent(s)

	/* Change Events */
	const change = useStepChangeHandler(index, onChange)
	const onInputColumnChange = useInputColumnChanged(s, change, table)
	const onInputColumnListChange = useInputColumnListChanged(s, change)
	const onInputColumnListChangeAll = useInputColumnListAllChanged(s, change)
	const onOutputColumnChange = useOutputColumnChanged(s, change)

	/* Side Effects */
	useDefaultOutputNameInitially(s, output, changeOutput)

	const name = useMemo(() => {
		const parts = s.verb.split('.')
		return parts[parts.length - 1]
	}, [s.verb])
	return StepArgs == null ? null : (
		<Container className='step-component'>
			{/* Input Column List */}
			{isInputColumnListStep(s) ? (
				<MultiDropdown
					required={true}
					label={'Columns'}
					placeholder={'Choose columns'}
					styles={dropdownStyles}
					selectedKeys={(s.args as InputColumnListArgs).columns}
					options={getSimpleDropdownOptions(columns)}
					onChange={onInputColumnListChange}
					onChangeAll={onInputColumnListChangeAll}
				/>
			) : null}

			{/* Input Column */}
			{!hideInputColumn && isInputColumnStep(s) ? (
				<TableColumnDropdown
					required
					options={columnOptions}
					label={`Column to ${name}`}
					selectedKey={(s.args as InputColumnArgs).column}
					onChange={onInputColumnChange}
				/>
			) : null}

			<StepArgs
				step={s}
				workflow={g}
				metadata={metadata}
				output={output}
				onChangeOutput={changeOutput}
				onChange={change}
			/>

			{/* Output Column */}
			{isOutputColumnStep(s) ? (
				<TextField
					required
					label={'New column name'}
					placeholder={'Column name'}
					value={(s.args as OutputColumnArgs).to}
					styles={dropdownStyles}
					onChange={onOutputColumnChange}
				/>
			) : null}
		</Container>
	)
})
