/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	aggregateStep,
	binarizeStep,
	binStep,
	booleanStep,
	convertStep,
	dedupeStep,
	deriveStep,
	eraseStep,
	fetchStep,
	fillStep,
	filterStep,
	foldStep,
	groupbyStep,
	imputeStep,
	mergeStep,
	orderbyStep,
	pivotStep,
	recodeStep,
	renameStep,
	rollupStep,
	sampleStep,
	selectStep,
	spreadStep,
	unfoldStep,
	ungroupStep,
	unorderStep,
	unrollStep,
	windowStep,
} from './stepFunctions/index.js'
import { makeInputNode,makeStepNode } from './util/factories.js'

export const bin = makeStepNode(binStep)
export const aggregate = makeStepNode(aggregateStep)
export const binarize = makeStepNode(binarizeStep)
export const boolean = makeStepNode(booleanStep)
export const convert = makeStepNode(convertStep)
export const dedupe = makeStepNode(dedupeStep)
export const derive = makeStepNode(deriveStep)
export const erase = makeStepNode(eraseStep)
export const fetch = makeInputNode(fetchStep)
export const fill = makeStepNode(fillStep)
export const filter = makeStepNode(filterStep)
export const fold = makeStepNode(foldStep)
export const groupby = makeStepNode(groupbyStep)
export const impute = makeStepNode(imputeStep)
export const merge = makeStepNode(mergeStep)
export const orderby = makeStepNode(orderbyStep)
export const pivot = makeStepNode(pivotStep)
export const recode = makeStepNode(recodeStep)
export const rename = makeStepNode(renameStep)
export const rollup = makeStepNode(rollupStep)
export const sample = makeStepNode(sampleStep)
export const select = makeStepNode(selectStep)
export const spread = makeStepNode(spreadStep)
export const unfold = makeStepNode(unfoldStep)
export const ungroup = makeStepNode(ungroupStep)
export const unorder = makeStepNode(unorderStep)
export const unroll = makeStepNode(unrollStep)
export const window = makeStepNode(windowStep)
