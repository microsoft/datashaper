/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fsp from 'fs/promises'

import {
	CodebookProfile,
	DataTableProfile,
	TableBundleProfile,
	WorkflowProfile,
} from '../resources/index.js'

export const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0))

export function defaultProfiles() {
	return [
		new TableBundleProfile(),
		new DataTableProfile(),
		new CodebookProfile(),
		new WorkflowProfile(),
	]
}

export function readJson(dataPath: string): Promise<any> {
	return readText(dataPath).then((data) => JSON.parse(data))
}

export function readText(dataPath: string): Promise<string> {
	return fsp.readFile(dataPath, 'utf8')
}
