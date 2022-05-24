/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { debugPage } from '../pages/DebugPage.js'
import { perfPage } from '../pages/PerfPage.js'
import { prepareDataPage } from '../pages/PrepareDataPage.js'

export function useGuidanceIndex(): {
	debugPage: string
	perfPage: string
	prepareDataPage: string
} {
	return {
		debugPage: debugPage.default,
		perfPage: perfPage.default,
		prepareDataPage: prepareDataPage.default,
	}
}
