/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DetailsListFeatures } from '../ArqueroDetailsList.types.js'
import type { RichCellProps } from './types.js'

export interface FeatureCellProps extends RichCellProps {
	features: DetailsListFeatures
}
