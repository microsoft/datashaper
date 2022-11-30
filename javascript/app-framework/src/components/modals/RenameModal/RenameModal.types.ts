/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'

export interface RenameModalProps {
	resource?: Resource
	isOpen: boolean
	onDismiss: () => void
	onAccept: (newName: string | undefined) => void
}
