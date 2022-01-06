/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface ColumnConfig {
	width?: number
	iconName?: string
}

export type ColumnConfigMap = Record<string, ColumnConfig>
