/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { LoadingOrchestrator } from './loadingOrchestrator.js'
import type { OrchestratorType } from './OrchestratorType.js'

const orchestrators: Partial<Record<OrchestratorType, LoadingOrchestrator>> = {}

export function getLoadingOrchestrator(type: OrchestratorType) {
	const existing = orchestrators[type]

	if (!existing) {
		const newOrchestrator = new LoadingOrchestrator()

		orchestrators[type] = newOrchestrator

		return newOrchestrator
	}

	return existing
}
