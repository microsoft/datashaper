/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameArgs } from '@datashaper/schema'
import type { Step } from '@datashaper/workflow'
import styled from '@essex/styled-components'
import type { IDropdownOption } from '@fluentui/react'
import {
	ActionButton,
	Icon,
	IconButton,
	Label,
	TextField,
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useMemo } from 'react'

import { EMPTY_OBJECT } from '../../../../empty.js'
import {
	useColumnNames,
	useOnDeleteStepColumn,
	useSimpleDropdownOptions,
	useStepInputTable,
} from '../../../../hooks/index.js'
import { TableColumnDropdown } from '../../../controls/index.js'
import { narrowerDropdownStyles } from '../styles.js'
import type { StepFormProps } from '../types.js'
import {
	useDisabled,
	useHandleAddButtonClick,
	useHandleColumnChange,
} from './RenameForm.hooks.js'

/**
 * Provides inputs for a RenameStep.
 */
export const RenameForm: React.FC<StepFormProps<RenameArgs>> = memo(
	function RenameForm({ step, workflow, input, onChange }) {
		const dataTable = useStepInputTable(step, workflow, input)
		const handleColumnChange = useHandleColumnChange(step, onChange)
		const handleColumnDelete = useOnDeleteStepColumn(step, onChange)
		const handleButtonClick = useHandleAddButtonClick(step, dataTable, onChange)
		const columnPairs = useColumnPairs(
			dataTable,
			step,
			handleColumnChange,
			handleColumnDelete,
		)
		const disabled = useDisabled(step, dataTable)

		return (
			<Container>
				<Label required>Column renames</Label>
				<ColumnPairs>{columnPairs}</ColumnPairs>
				<ActionButton
					onClick={handleButtonClick}
					iconProps={addIconProps}
					disabled={disabled}
				>
					Add rename
				</ActionButton>
			</Container>
		)
	},
)

function useColumnPairs(
	table: ColumnTable | undefined,
	step: Step<RenameArgs>,
	onChange: (previous: string, oldName: string, newName: string) => void,
	onDelete: (name: string) => void,
) {
	return useMemo(() => {
		const { columns } = step.args
		return Object.entries(columns || EMPTY_OBJECT).map((column, index) => {
			const [oldname] = column
			return (
				<ColumnPair
					key={`column-rename-${oldname}-${index}`}
					table={table}
					column={column}
					step={step}
					onChange={onChange}
					onDelete={onDelete}
				/>
			)
		})
	}, [table, step, onChange, onDelete])
}

const ColumnPair: React.FC<{
	table: ColumnTable | undefined
	column: [string, string]
	step: Step<RenameArgs>
	onChange: (previous: string, oldName: string, newName: string) => void
	onDelete: (name: string) => void
}> = memo(function ColumnPair({ table, column, step, onChange, onDelete }) {
	const [oldname, newname] = column
	const columnFilter = (name: string) => {
		if (name === oldname) {
			return true
		}
		if (step.args.columns?.[name]) {
			return false
		}
		return true
	}
	const handleColumnChange = (
		_e: React.FormEvent<HTMLDivElement>,
		opt?: IDropdownOption<any> | undefined,
	) => onChange(oldname, (opt?.key as string) || oldname, newname)
	const handleTextChange = (
		_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		newValue?: string,
	) => {
		onChange(oldname, oldname, newValue ?? '')
	}
	const handleDeleteClick = () => onDelete(oldname)
	const columns = useColumnNames(table, columnFilter)
	const options = useSimpleDropdownOptions(columns)

	return (
		<ColumnPairContainer>
			<TableColumnDropdown
				options={options}
				label={undefined}
				selectedKey={oldname}
				onChange={handleColumnChange}
				styles={narrowerDropdownStyles}
			/>
			<Icon
				iconName={'Forward'}
				styles={{ root: { marginLeft: 4, marginRight: 4 } }}
			/>
			<TextField
				placeholder={'New name'}
				value={newname}
				onChange={handleTextChange}
				styles={narrowerDropdownStyles}
			/>
			<IconButton
				title={'Remove this rename'}
				iconProps={deleteIconProps}
				onClick={handleDeleteClick}
			/>
		</ColumnPairContainer>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
`

const ColumnPairs = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`

const ColumnPairContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
`

const addIconProps = { iconName: 'Add' }
const deleteIconProps = { iconName: 'Delete' }
