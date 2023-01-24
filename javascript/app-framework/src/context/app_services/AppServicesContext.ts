/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createContext } from 'react'
import type { AppServices } from '../../types.js'

export const AppServicesContext = createContext<AppServices>(null as any)
