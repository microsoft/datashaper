/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { LoadingOrchestrator } from './loadingOrchestrator.js'
import type { LoadingOrchestratorType } from './loadingOrchestratorType.js'

const orchestrators: Partial<
	Record<LoadingOrchestratorType, LoadingOrchestrator>
> = {}

export function getLoadingOrchestrator(
	type: LoadingOrchestratorType,
): LoadingOrchestrator {
	const existing = orchestrators[type]

	if (!existing) {
		const newOrchestrator = new LoadingOrchestrator()

		orchestrators[type] = newOrchestrator

		return newOrchestrator
	}

	return existing
}
