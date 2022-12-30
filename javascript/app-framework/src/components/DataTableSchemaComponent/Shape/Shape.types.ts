/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataShape } from '@datashaper/schema'

export interface ShapeProps {
	shape?: DataShape
	onChange?: (shape: DataShape) => void
}
