/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FillArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'

/**
 * Executes an arquero derive to fill a new column with fixed values.
 * Note this is not the same as imputing, which fills missing values.
 * This is intended to create an entirely new column.
 */
export const fill = makeStepNode<FillArgs>((input, { value, to }) => {
	const fn = (_d: any, $: any) => $.value
	return input.params({ value }).derive({ [to]: fn })
})
