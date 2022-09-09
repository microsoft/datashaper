/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnArgs, OutputColumnArgs } from '@datashaper/schema'
import {
	isInputColumnStep,
	isInputTableStep,
	isOutputColumnStep,
	NodeInput,
} from '@datashaper/workflow'
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import { TableColumnDropdown } from '../controls/TableColumnDropdown.js'
import { TableDropdown } from '../controls/TableDropdown.js'
import { useDataTable } from '../hooks/useDataTable.js'
import { useSimpleDropdownOptions } from '../hooks/useSimpleDropdownOptions.js'
import { useTableColumnNames } from '../hooks/useTableColumnNames.js'
import { useTableDropdownOptions } from '../hooks/useTableDropdownOptions.js'
import { dropdownStyles } from '../styles.js'
import {
	useColumnFilter,
	useDefaultOutputNameInitially,
	useInputColumnChanged,
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
		index,
		inputTableLabel,
		inputColumnLabel,
		outputColumnLabel,
		outputTableLabel,
		outputTableDisabled,
		onChange,
		onChangeOutput: changeOutput,
	}) {
		/* Current Table Selection */
		const tableId = s.input[NodeInput.Source]?.node
		const table = useDataTable(tableId, g)

		/* Table Options */
		const tableOptions = useTableDropdownOptions(g)

		/* Column Options */
		const columns = useTableColumnNames(table, useColumnFilter(s, table))
		const columnOptions = useSimpleDropdownOptions(columns)

		/* The step args component */
		const StepArgs = useStepArgsComponent(s)

		/* Change Events */
		const change = useStepChangeHandler(index, onChange)
		const onInputTableChange = useInputTableChanged(s, g, change)
		const onInputColumnChange = useInputColumnChanged(s, change)
		const onOutputColumnChange = useOutputColumnChanged(s, change)
		const onOutputTableChange = useOutputTableChanged(s, changeOutput, change)

		/* Side Effects */
		useDefaultOutputNameInitially(s, output, changeOutput)

		return StepArgs == null ? null : (
			<Container className="step-component">
				{/* Input Table */}
				{isInputTableStep(s) ? (
					<TableDropdown
						required
						options={tableOptions}
						label={inputTableLabel || 'Input table'}
						selectedKey={tableId ?? null}
						onChange={onInputTableChange}
					/>
				) : null}

				{/* Input Column */}
				{isInputColumnStep(s) ? (
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
				<TextField
					required
					disabled={outputTableDisabled}
					label={outputTableLabel || 'Output table'}
					placeholder={'Table name'}
					value={output ?? s.id}
					styles={dropdownStyles}
					onChange={onOutputTableChange}
				/>
			</Container>
		)
	},
)
