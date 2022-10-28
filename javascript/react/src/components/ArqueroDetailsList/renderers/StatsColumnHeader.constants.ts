/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StatsColumnType } from '../ArqueroDetailsList.types.js'

export const pretty: Record<string, string> = {
	distinct: 'unique',
	invalid: 'empty',
}

export const DEFAULT_STATS: StatsColumnType[] = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]
