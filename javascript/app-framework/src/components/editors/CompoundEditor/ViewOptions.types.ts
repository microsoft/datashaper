/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import { icons } from './ViewOptions.styles.js'

export enum ViewType {
	Interactive = 'interactive',
	RawFile = 'rawFile',
}

export const viewOptions = [
	{
		key: ViewType.RawFile,
		text: '',
		iconProps: icons.rawFile,
		title: 'View raw text',
	},
	{
		key: ViewType.Interactive,
		text: '',
		iconProps: icons.interactive,
		title: 'View interactive options',
	},
]

export interface ViewOptionsProps {
	options: IChoiceGroupOption[]
	selectedKey: string
	onChange: (key: string) => void
}
