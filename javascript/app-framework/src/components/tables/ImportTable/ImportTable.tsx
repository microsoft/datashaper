/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StatsColumnType } from '@datashaper/react'
import type { TableContainer, TableMetadata } from '@datashaper/tables'
import { generateCodebook } from '@datashaper/tables'
import { removeExtension } from '@datashaper/utilities'
import { ReadOnlyTextField } from '@essex/components'
import {
	Checkbox,
	IconButton,
	Label,
	Modal,
	PrimaryButton,
	TextField,
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { memo, useCallback, useState } from 'react'

import { DataTableConfig } from '../../DataTableConfig/DataTableConfig.js'
import { RawTable } from '../RawTable/RawTable.js'
import {
	useDraftSchema,
	useFileAttributes,
	usePreview,
} from './ImportTable.hooks.js'
import {
	Footer,
	Header,
	HeaderTitle,
	MainContent,
	ModalBody,
	modalStyles,
	PreviewContent,
	Sidebar,
	textFieldStyles,
} from './ImportTable.styles.js'
import type { ImportTableProps } from './ImportTable.types.js'
import { DataFormat } from '@datashaper/schema'

const icons = {
	cancel: { iconName: 'Cancel' },
}

export const ImportTable: React.FC<ImportTableProps> = memo(
	function ImportTable({ file, onCancel, onOpenTable }) {
		const { delimiter, format, extension, content } = useFileAttributes(file)
		const isTextFormat = format === DataFormat.CSV || format === DataFormat.JSON
		const isDataFormatTyped = format === DataFormat.ARROW

		const [name, setName] = useState<string>(removeExtension(file.name ?? ''))
		const [autoType, setAutoType] = useState<boolean>(!isDataFormatTyped)

		const { table, metadata, previewError, onLoadPreview } = usePreview(
			file,
			autoType,
		)

		const draftSchema = useDraftSchema(delimiter, format, onLoadPreview)

		const onClickImport = useCallback(() => {
			if (table) {
				const id = `${name}.${extension}`
				const tableContainer = { id, table } as TableContainer
				// TODO: this is a bit inefficient, because a codebook is generated transitively in the readTable method when autoType is true
				// we should separate those two functions. if a table is typed, generating the codebook can be much quicker.
				const codebook = autoType ? generateCodebook(table) : undefined
				onOpenTable(tableContainer, draftSchema.toSchema(), codebook)
			}
		}, [onOpenTable, table, name, extension, draftSchema, autoType])

		return (
			<Modal styles={modalStyles} isOpen={true} onDismiss={onCancel} isBlocking>
				<ModalHeader onHideModal={onCancel} />
				<ModalBody>
					<Sidebar>
						<TextField
							label='Table name'
							onChange={(_, value) => setName(value ?? '')}
							description={file.path ?? ''}
							value={name}
							name='fileName'
							title='Table name'
							autoComplete='off'
						/>
						<DataTableConfig resource={draftSchema} />
					</Sidebar>
					<MainContent>
						{isTextFormat && (
							<>
								<Label>Input text</Label>
								<ReadOnlyTextField
									multiline
									value={content || ''}
									styles={textFieldStyles}
								/>
							</>
						)}
						<Label>Final table</Label>
						<PreviewContent>
							<Preview error={previewError} table={table} metadata={metadata} />
						</PreviewContent>
					</MainContent>
				</ModalBody>
				<ModalFooter
					autotypeDisabled={isDataFormatTyped}
					disabled={!!previewError}
					autoType={autoType}
					onAutoTypeChange={setAutoType}
					onClick={onClickImport}
				/>
			</Modal>
		)
	},
)

const ModalHeader: React.FC<{ onHideModal: () => void }> = memo(
	function ModalHeader({ onHideModal }) {
		return (
			<Header>
				<HeaderTitle>Open table</HeaderTitle>
				<IconButton
					iconProps={icons.cancel}
					ariaLabel='Close popup modal'
					onClick={onHideModal}
				/>
			</Header>
		)
	},
)

const ModalFooter: React.FC<{
	disabled: boolean
	autotypeDisabled?: boolean
	autoType: boolean
	onAutoTypeChange: (checked: boolean) => void
	onClick: () => void
}> = memo(function ModalFooter({
	autotypeDisabled,
	disabled,
	autoType,
	onAutoTypeChange,
	onClick,
}) {
	return (
		<Footer>
			{!autotypeDisabled && (
				<Checkbox
					label={'Discover data types'}
					checked={autoType}
					onChange={(_: any, checked?: boolean) =>
						onAutoTypeChange(checked ?? false)
					}
				/>
			)}
			<PrimaryButton disabled={disabled} text='OK' onClick={onClick} />
		</Footer>
	)
})

export const Preview: React.FC<{
	table?: ColumnTable
	metadata?: TableMetadata
	error?: string
}> = memo(function TablePreview({ table, metadata, error }) {
	return (
		<>
			{table && (
				<RawTable
					error={error}
					table={table}
					metadata={metadata}
					fill
					features={{
						statsColumnHeaders: true,
						statsColumnTypes: [StatsColumnType.Type],
					}}
				/>
			)}
		</>
	)
})
