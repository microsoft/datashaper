/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { debugPage } from '../pages/DebugPage.js'
import { prepareDataPage } from '../pages/PrepareDataPage.js'

export function useGuidanceIndex(): {
	debugPage: string
	prepareDataPage: string
} {
	return {
		debugPage: debugPage.default,
		prepareDataPage: prepareDataPage.default,
	}
}
