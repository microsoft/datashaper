/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useContext } from 'react'

import type { PersistenceService } from '../context/index.js'
import { PersistenceContext } from '../context/index.js'

export function usePersistenceService(): PersistenceService {
	return useContext(PersistenceContext)
}
