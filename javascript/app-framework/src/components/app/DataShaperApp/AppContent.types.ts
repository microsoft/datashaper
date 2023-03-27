/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import type { AppServices } from '../../../types.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'

export interface AppContentProps {
	profiles: DataShaperAppProps['profiles']
	children: React.ReactNode
	fallback: React.ReactNode
	api: AppServices
	rename: RenameModalState
}

interface RenameModalState {
	resource: Resource | undefined
	isOpen: boolean
	onDismiss: () => void
	onAccept: (name: string | undefined) => void
}
