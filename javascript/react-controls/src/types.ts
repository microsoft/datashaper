/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'

export type StepChangeFunction = (step: Step) => void

export type DropdownOptionChangeFunction = (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void
