/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import type { MutableSnapshot, Snapshot } from 'recoil'

export interface RecoilBasedProfileHostProps<T extends Resource> {
	resource: T
	loadState: (resource: T, snap: MutableSnapshot) => void
	saveState: (resource: T, snap: Snapshot) => void
	children: React.ReactNode
}
