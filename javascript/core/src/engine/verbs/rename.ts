/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doRename = wrapColumnStep<RenameArgs>((input, { columns }) =>
	input.rename(columns),
)

export const rename = makeStepFunction(doRename)
export const renameNode = makeStepNode(doRename)
