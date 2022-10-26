/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface TableCardProps {
	tableName: string
	isSelected: (id: string) => boolean
	onSelect?: (id: string) => void
}
