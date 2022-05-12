/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnArgs,
	OutputColumnArgs,
} from '@data-wrangling-components/core'
import {
	isInputColumnStep,
	isInputTableStep,
	isOutputColumnStep,
} from '@data-wrangling-components/core'
import { NodeInput } from '@essex/dataflow'
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import { TableColumnDropdown } from '../controls/TableColumnDropdown.js'
import { TableDropdown } from '../controls/TableDropdown.js'
import { useDataTable } from '../hooks/useDataTable.js'
import { useSimpleDropdownOptions } from '../hooks/useSimpleDropdownOptions.js'
import { useTableColumnNames } from '../hooks/useTableColumnNames.js'
import { useTableNames } from '../hooks/useTableNames.js'
import { dropdownStyles } from '../styles.js'
import {
	useColumnFilter,
	useDefaultOutputNameInitially,
	useInputColumnChangeHandler,
	useInputTableChangeHandler,
	useOutputColumnChangedHandler,
	useOutputTableChangedHandler,
	useStepArgsComponent,
	useStepChangeHandler,
} from './StepComponent.hooks.js'
import { Container } from './StepComponent.styles.js'
import type { StepComponentProps } from './StepComponent.types.js'

/**
 * Let's us render the Steps in a loop while memoing all the functions
 */
export const StepComponent: React.FC<StepComponentProps> = memo(
	function StepComponent({
		step,
		output,
		graph,
		index,
		inputTableLabel,
		inputColumnLabel,
		outputColumnLabel,
		outputTableLabel,
		outputTableDisabled,
		onChange,
		onChangeOutput,
	}) {
		/* Current Table Selection */
		const tableId = step.input[NodeInput.Source]?.node
		const table = useDataTable(tableId, graph)

		/* Table Options */
		const tables = useTableNames(graph)
		const tableOptions = useSimpleDropdownOptions(tables)

		/* Column Options */
		const columns = useTableColumnNames(table, useColumnFilter(step, table))
		const columnOptions = useSimpleDropdownOptions(columns)

		const StepArgs = useStepArgsComponent(step)
		const onStepChange = useStepChangeHandler(index, onChange)
		const handleInputTableChanged = useInputTableChangeHandler(
			step,
			graph,
			onStepChange,
		)
		const handleInputColumnChanged = useInputColumnChangeHandler(
			step,
			onStepChange,
		)
		const handleOutputColumnChanged = useOutputColumnChangedHandler(
			step,
			onStepChange,
		)
		const handleOutputTableChanged = useOutputTableChangedHandler(
			step,
			onChangeOutput,
			onStepChange,
		)
		useDefaultOutputNameInitially(step, output, onChangeOutput)

		return StepArgs == null ? null : (
			<Container className="step-component">
				{/* Input Table */}
				{isInputTableStep(step) ? (
					<TableDropdown
						options={tableOptions}
						label={inputTableLabel || 'Input table'}
						selectedKey={tableId}
						onChange={handleInputTableChanged}
					/>
				) : null}

				{/* Input Column */}
				{isInputColumnStep(step) ? (
					<TableColumnDropdown
						required
						options={columnOptions}
						label={inputColumnLabel || `Column to ${step.verb}`}
						selectedKey={(step.args as InputColumnArgs).column}
						onChange={handleInputColumnChanged}
					/>
				) : null}

				<StepArgs
					step={step}
					graph={graph}
					output={output}
					onChangeOutput={onChangeOutput}
					onChange={onStepChange}
				/>

				{/* Output Column */}
				{isOutputColumnStep(step) ? (
					<TextField
						required
						label={outputColumnLabel || 'New column name'}
						placeholder={'Column name'}
						value={(step.args as OutputColumnArgs).to}
						styles={dropdownStyles}
						onChange={handleOutputColumnChanged}
					/>
				) : null}

				{/* Output Table */}
				<TextField
					required
					disabled={outputTableDisabled}
					label={outputTableLabel || 'Output table'}
					placeholder={'Table name'}
					value={output ?? step.id}
					styles={dropdownStyles}
					onChange={handleOutputTableChanged}
				/>
			</Container>
		)
	},
)
