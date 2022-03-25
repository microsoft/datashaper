/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SetOp } from './types.js'
import { setOperationNodeFactory } from './nodeFactories/index.js'

export const concat = setOperationNodeFactory(SetOp.Concat)
