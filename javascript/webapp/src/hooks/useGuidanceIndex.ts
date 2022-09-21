/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { prepareDataPage } from '../pages/PrepareDataPage/PrepareDataPage.js'

export function useGuidanceIndex(): {
	prepareDataPage: string
} {
	return {
		prepareDataPage: prepareDataPage.default,
	}
}
