/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@datashaper/utilities'
import { memo, useCallback } from 'react'

import { ImportTable } from '../../tables/ImportTable/ImportTable.js'
import type { FileImportProps } from './FileImport.types.js'
import { useOnOpenTable } from './FileTree.hooks.js'

export const FileImport: React.FC<FileImportProps> = memo(function FileImport({
	file,
	setFile,
}) {
	const onOpenTable = useOnOpenTable(file as BaseFile, setFile)
	const onCancelImport = useCallback(() => setFile(undefined), [setFile])

	return file == null ? null : (
		<ImportTable
			onCancel={onCancelImport}
			file={file}
			onOpenTable={onOpenTable}
		/>
	)
})
