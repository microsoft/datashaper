/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import debugPage from 'raw-loader!../pages/debugPage/README.md'
import perfPage from 'raw-loader!../pages/perfPage/README.md'
import prepareDataPage from 'raw-loader!../pages/prepareDataPage/README.md'

export function useGuidanceIndex(): {
	debugPage: string
	perfPage: string
	prepareDataPage: string
} {
	return {
		debugPage,
		perfPage,
		prepareDataPage,
	}
}
