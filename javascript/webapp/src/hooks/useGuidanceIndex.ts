/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { debugPage, perfPage, prepareDataPage } from '../pages/index.js'

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
