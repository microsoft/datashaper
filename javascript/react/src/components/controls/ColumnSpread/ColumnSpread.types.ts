/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface ColumnSpreadProps {
	column: string
	onChange?: (column: string) => void
	onDelete?: () => void
}
