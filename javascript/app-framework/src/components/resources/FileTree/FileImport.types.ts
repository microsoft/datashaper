/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@datashaper/utilities'

export interface FileImportProps {
	file: BaseFile | undefined
	setFile: (file: BaseFile | undefined) => void
}
