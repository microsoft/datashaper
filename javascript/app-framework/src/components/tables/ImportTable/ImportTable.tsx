/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat } from '@datashaper/schema'
import { DataOrientation } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { readTable } from '@datashaper/tables'
import {
	extension,
	guessDelimiter,
	removeExtension,
} from '@datashaper/utilities'
import { DataTable } from '@datashaper/workflow'
import { IconButton, Modal, PrimaryButton, TextField } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { DataTableConfig } from '../../DataTableConfig/DataTableConfig.js'
import { RawTable } from '../RawTable/RawTable.js'
import {
	Footer,
	Header,
	HeaderTitle,
	ModalBody,
	modalStyles,
	PreviewContent,
	Sidebar,
} from './ImportTable.styles.js'
import type { ImportTableProps } from './ImportTable.types.js'

const icons = {
	cancel: { iconName: 'Cancel' },
}

export const ImportTable: React.FC<ImportTableProps> = memo(
	function ImportTable({ file, onCancel, onOpenTable }) {
		// discover attributes of the content to craft a draft schema
		const delimiter = useMemo(() => guessDelimiter(file.name), [file])
		const fileExtension = useMemo(() => extension(file.path), [file])
		const format = useMemo(
			() => fileExtension.toLocaleLowerCase() as DataFormat,
			[fileExtension],
		)

		const [name, setName] = useState<string>(removeExtension(file.name ?? ''))

		const [table, setTable] = useState<ColumnTable | undefined>()
		const [previewError, setPreviewError] = useState<string | undefined>()

		const loadPreview = useCallback(
			(schema: DataTable) => {
				const f = async () => {
					try {
						const loadedTable = await readTable(file, schema.toSchema())
						setPreviewError(undefined)
						setTable(loadedTable)
					} catch (_) {
						setPreviewError(
							'The selected configuration is not valid for this table.',
						)
					}
				}
				void f()
			},
			[setTable, setPreviewError, file],
		)

		const draftSchema = useMemo(() => {
			const schema = new DataTable({
				format,
				parser: {
					delimiter,
				},
				shape: {
					orientation: DataOrientation.Values,
				},
			})
			schema.onChange(() => loadPreview(schema))
			return schema
		}, [format, delimiter, loadPreview])

		useEffect(() => loadPreview(draftSchema), [draftSchema, loadPreview])

		const onClickImport = useCallback(() => {
			if (table) {
				const id = `${name}.${fileExtension}`
				const tableContainer = { id, table } as TableContainer
				onOpenTable(tableContainer, draftSchema.toSchema())
			}
		}, [onOpenTable, table, name, fileExtension, draftSchema])

		return (
			<Modal styles={modalStyles} isOpen={true} onDismiss={onCancel} isBlocking>
				<ModalHeader onHideModal={onCancel} />
				<ModalBody>
					<Sidebar>
						<TextField
							label="Table name"
							onChange={(_, value) => setName(value ?? '')}
							description={file.path ?? ''}
							value={name}
							name="fileName"
							title="Table name"
							autoComplete="off"
						/>
						<DataTableConfig resource={draftSchema} />
					</Sidebar>
					<PreviewContent>
						<Preview error={previewError} table={table} />
					</PreviewContent>
				</ModalBody>
				<ModalFooter disabled={!!previewError} onClick={onClickImport} />
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
					ariaLabel="Close popup modal"
					onClick={onHideModal}
				/>
			</Header>
		)
	},
)

const ModalFooter: React.FC<{
	disabled: boolean
	onClick: () => void
}> = memo(function ModalFooter({ disabled, onClick }) {
	return (
		<Footer>
			<PrimaryButton disabled={disabled} text="OK" onClick={onClick} />
		</Footer>
	)
})

export const Preview: React.FC<{
	table?: ColumnTable
	error?: string
	showType?: boolean
}> = memo(function TablePreview({ table, error }) {
	return <>{table && <RawTable error={error} table={table} fill />}</>
})
