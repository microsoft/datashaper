/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'

export const rename = makeStepNode<RenameArgs>((input, { columns }) =>
	input.rename(columns),
)
