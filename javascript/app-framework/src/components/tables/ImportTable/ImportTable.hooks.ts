/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat, DataOrientation, type CodebookSchema } from '@datashaper/schema'
import { type TableMetadata, introspect, readTable } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'
import { extension, guessDelimiter } from '@datashaper/utilities'
import { DataTable } from '@datashaper/workflow'
import { table as atable } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { generateCodebook } from '@datashaper/tables'

export function useFileAttributes(file: BaseFile): {
	delimiter: string
	extension: string
	format: DataFormat
	content: string | undefined
} {
	const [content, setContent] = useState<string | undefined>()
	useEffect(() => {
		file.toText().then(setContent)
	}, [file])

	return useMemo(() => {
		const delimiter = guessDelimiter(file.name)
		const fileExtension = extension(file.path)
		const format = fileExtension.toLocaleLowerCase() as DataFormat
		return {
			delimiter,
			extension: fileExtension,
			format,
			content,
		}
	}, [file, content])
}

export function usePreview(
	file: BaseFile,
	autoType: boolean,
): {
	table: ColumnTable | undefined
	metadata: TableMetadata | undefined
	previewError: string | undefined
	onLoadPreview: (schema: DataTable) => void
} {
	const [table, setTable] = useState<ColumnTable | undefined>()
	const [metadata, setMetadata] = useState<TableMetadata | undefined>()
	const [previewError, setPreviewError] = useState<string | undefined>()

	const onLoadPreview = useCallback(
		(schema: DataTable) => {
			const f = async () => {
				try {
					const loadedTable = await readTable(file, schema.toSchema(), {
						autoType,
					})
					setPreviewError(undefined)
					setTable(loadedTable)
					if (loadedTable) {
						setMetadata(introspect(loadedTable, false))
					}
				} catch (_) {
					setPreviewError(
						'The selected configuration is not valid for this table.',
					)
					setTable(atable({}))
					setMetadata(undefined)
				}
			}
			void f()
		},
		[setTable, setMetadata, setPreviewError, file, autoType],
	)

	return {
		table,
		metadata,
		previewError,
		onLoadPreview,
	}
}

export function useDraftSchema(
	delimiter: string,
	format: DataFormat,
	onChange: (schema: DataTable) => void,
): DataTable {
	return useMemo(() => {
		const schema = new DataTable({
			format,
			parser: {
				delimiter,
			},
			shape: {
				orientation:
					format === DataFormat.CSV
						? DataOrientation.Values
						: DataOrientation.Records,
			},
		})
		schema.onChange(() => onChange(schema))
		onChange(schema)
		return schema
	}, [format, delimiter, onChange])
}

export function useCodebook(
	table: ColumnTable | undefined,
	autoType: boolean,
	format: DataFormat,
): {
	codebook: CodebookSchema | undefined
	isLoading: boolean
	columnBeingInferred: string | undefined
	progress: number
} {
	const [codebook, setCodebook] = useState<CodebookSchema | undefined>(
		undefined,
	)
	const [columnBeingInferred, setColumnBeingInferred] = useState<
		string | undefined
	>(undefined)
	const [isLoading, setIsLoading] = useState(true)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		if (table && autoType) {
			setIsLoading(true)
			setCodebook(undefined)
			setColumnBeingInferred(undefined)
			setProgress(0)

			generateCodebook(table, {
				autoType,
				format,
				onInferring: setColumnBeingInferred,
				onProgress: setProgress
			})
				.then(setCodebook)
				.catch((err) => console.error(err))
				.finally(() => {
					setColumnBeingInferred(undefined)
					setIsLoading(false)
					setProgress(0)
				})
		}
	}, [
		table,
		autoType,
		format,
		setIsLoading,
		setCodebook,
		setColumnBeingInferred,
		setProgress,
	])

	return {
		codebook,
		isLoading,
		columnBeingInferred,
		progress,
	}
}
