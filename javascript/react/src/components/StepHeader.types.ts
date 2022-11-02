/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import type { CSSProperties } from 'react'

export interface StepHeaderStyles {
	/**
	 * Root container of the header.
	 * Note that if this is in a CollapsiblePanel like our StepHistoryList, this will only be the internal section.
	 */
	root?: CSSProperties
	/**
	 * The printed step #
	 */
	index?: CSSProperties
	/**
	 * The step name (step.id)
	 */
	name?: CSSProperties
	/**
	 * The step name when selected.
	 * If you want more selection styling control in the header, modulate all of the styles manually.
	 */
	selected?: CSSProperties
	/**
	 * The details text (i.e., column list, etc.)
	 */
	details?: CSSProperties
}

export interface StepHeaderProps {
	step: Step
	index: number
	selected?: boolean
	styles?: StepHeaderStyles
}
