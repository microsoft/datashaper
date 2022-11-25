/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useContext, useMemo } from 'react'

import type {
	PersistenceService} from '../context/index.js';
import {
	DataPackageContext,
	DefaultPersistenceService
} from '../context/index.js'

export function usePersistenceService(): PersistenceService {
	const dataPackage = useContext(DataPackageContext)
	return useMemo(
		() => new DefaultPersistenceService(dataPackage),
		[dataPackage],
	)
}
