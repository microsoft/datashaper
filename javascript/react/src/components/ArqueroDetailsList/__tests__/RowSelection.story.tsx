/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IObjectWithKey } from '@fluentui/react'
import { SelectionMode } from '@fluentui/react'
import type { ComponentStory } from '@storybook/react'
import { useCallback, useState } from 'react'

import { ArqueroDetailsList } from '../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../ArqueroDetailsList.types.js'

export const Template: ComponentStory<typeof ArqueroDetailsList> = (
	args: ArqueroDetailsListProps,
	{ loaded: { stocks } }: any,
): JSX.Element => {
	const [selections, setSelection] = useState<IObjectWithKey[]>([])

	const onRowSelect = useCallback(
		(selected: IObjectWithKey[]) => {
			setSelection(selected)
		},
		[setSelection],
	)

	return (
		<>
			<b>Rows selecteds: {selections.length}</b>
			<ArqueroDetailsList onRowSelect={onRowSelect} {...args} table={stocks} />
		</>
	)
}

export const RowSelectionStory = Template.bind({})
RowSelectionStory.args = {
	selectionMode: SelectionMode.multiple,
	showColumnBorders: true,
	selectionPreservedOnEmptyClick: true,
}
