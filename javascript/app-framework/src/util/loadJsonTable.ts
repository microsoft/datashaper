/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataOrientation } from '@datashaper/schema'
import type { BaseFile, Json } from '@datashaper/utilities'
import { getJsonFileContentFromFile } from '@datashaper/utilities'
import { from, fromJSON } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export async function loadJsonTable(
	file: BaseFile,
	orientation: DataOrientation,
): Promise<ColumnTable> {
	const text = await getJsonFileContentFromFile(file)
	return getJsonContent(orientation, text)
}

function getJsonContent(orientation: DataOrientation, text: string | Json) {
	if (orientation === DataOrientation.Columnar) {
		//autoType json only works for enabling or disabling date types. all other types are always enabled
		return fromJSON(text, {})
	}
	const content =
		typeof text === 'string' ? from(JSON.parse(text) as Json) : from(text)
	return from(content)
}
