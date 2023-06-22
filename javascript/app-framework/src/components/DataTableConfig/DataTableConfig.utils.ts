/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat } from '@datashaper/schema'

// TEMP: avoiding arrow for the time being since we have not confirmed support
export const DATA_FORMAT_OPTIONS = [
	{
		key: DataFormat.CSV,
		text: DataFormat.CSV.toUpperCase(),
	},
	{
		key: DataFormat.JSON,
		text: DataFormat.JSON.toUpperCase(),
	},
	{
		key: DataFormat.ARROW,
		text: DataFormat.ARROW.toUpperCase(),
	},
]
