/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ResourceSlotFieldWell } from '../../../types.js'
import type { BindingChangeHandler } from './ResourceTree.types.js'

export interface FieldWellsProps {
	fields: ResourceSlotFieldWell[]
	onBindingChange?: BindingChangeHandler
}
