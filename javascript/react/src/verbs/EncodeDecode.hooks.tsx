/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Field } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'
import { useMemo } from 'react'

export function useCodebookContent(
	metadata: TableMetadata | undefined,
): CodebookSchema {
	return useMemo(() => {
		const codebookResult: CodebookSchema = {
			$schema: 'http://json-schema.org/draft-07/schema#',
			id: 'http://json-schema.org/draft-07/schema#',
			name: 'Generator',
			fields: [],
		}

		if (metadata != null) {
			for (const key in metadata.columns) {
				const field = metadata.columns[key] as Field
				codebookResult.fields.push(field)
			}
		}

		return codebookResult
	}, [metadata])
}
