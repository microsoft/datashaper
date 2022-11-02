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
	isInputTableStep,
	isOutputColumnStep,
	NodeInput,
} from '@datashaper/workflow'
import { MultiDropdown } from '@essex/components'
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import { useColumnNames } from '../../hooks/columns/useColumnNames.js'
import { useWorkflowDataTable } from '../../hooks/index.js'
import { useSimpleDropdownOptions } from '../../hooks/useSimpleDropdownOptions.js'
import { useTableDropdownOptions } from '../../hooks/useTableDropdownOptions.js'
import { dropdownStyles } from '../../styles.js'
import { TableColumnDropdown } from '../controls/TableColumnDropdown/TableColumnDropdown.js'
import { TableDropdown } from '../controls/TableDropdown/TableDropdown.js'
import {
	getSimpleDropdownOptions,
	useColumnFilter,
	useDefaultOutputNameInitially,
	useInputColumnChanged,
	useInputColumnListAllChanged,
	useInputColumnListChanged,
	useInputTableChanged,
	useOutputColumnChanged,
	useOutputTableChanged,
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
		step: s,
		output,
		workflow: g,
		metadata,
		index,
		inputTableLabel,
		inputColumnLabel,
		outputColumnLabel,
		outputTableLabel,
		outputTableDisabled,
		onChange,
		onChangeOutput: changeOutput,
		hideInput,
		hideInputColumn,
		hideOutput,
	}) {
		/* Current Table Selection */
		const tableId = s.input[NodeInput.Source]?.node
		const table = useWorkflowDataTable(tableId, g)

		/* Table Options */
		const tableOptions = useTableDropdownOptions(g)
		/* Column Options */
		const columns = useColumnNames(table, useColumnFilter(s, table))
		const columnOptions = useSimpleDropdownOptions(columns)

		/* The step args component */
		const StepArgs = useStepArgsComponent(s)

		/* Change Events */
		const change = useStepChangeHandler(index, onChange)
		const onInputTableChange = useInputTableChanged(s, change)
		const onInputColumnChange = useInputColumnChanged(s, change, table)
		const onInputColumnListChange = useInputColumnListChanged(s, change)
		const onInputColumnListChangeAll = useInputColumnListAllChanged(s, change)
		const onOutputColumnChange = useOutputColumnChanged(s, change)
		const onOutputTableChange = useOutputTableChanged(s, changeOutput, change)

		/* Side Effects */
		useDefaultOutputNameInitially(s, output, changeOutput)

		return StepArgs == null ? null : (
			<Container className="step-component">
				{/* Input Table */}
				{!hideInput && isInputTableStep(s) ? (
					<TableDropdown
						required
						options={tableOptions}
						label={inputTableLabel || 'Input table'}
						selectedKey={tableId ?? null}
						onChange={onInputTableChange}
					/>
				) : null}

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
						label={inputColumnLabel || `Column to ${s.verb}`}
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
						label={outputColumnLabel || 'New column name'}
						placeholder={'Column name'}
						value={(s.args as OutputColumnArgs).to}
						styles={dropdownStyles}
						onChange={onOutputColumnChange}
					/>
				) : null}

				{/* Output Table */}
				{!hideOutput && (
					<TextField
						required
						disabled={outputTableDisabled}
						label={outputTableLabel || 'Output table'}
						placeholder={'Table name'}
						value={output ?? s.id}
						styles={dropdownStyles}
						onChange={onOutputTableChange}
					/>
				)}
			</Container>
		)
	},
)
