/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Label } from '@fluentui/react'
import { memo } from 'react'

import { ArqueroTableHeader } from '../../../ArqueroTableHeader/ArqueroTableHeader.js'
import { ArqueroDetailsList } from '../../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../../ArqueroDetailsList.types.js'
import { Table } from '../ArqueroDetailsListStories.styles.js'
import { useGrouping } from './RowGrouping.hooks.js'
import { ButtonContainer, GroupByToggle } from './RowGrouping.styles.js'

export const RowGrouping: React.FC<ArqueroDetailsListProps> = memo(
	function RowGrouping({ table, ...args }) {
		const { grouped, metadata, onGroupChange } = useGrouping(table)

		if (!(grouped && metadata)) {
			return <div>Loading...</div>
		}

		return (
			<Table>
				<Label>Group by: </Label>
				<ButtonContainer>
					<GroupByToggle
						label="Symbol"
						onText="On"
						offText="Off"
						onChange={(_e, checked) => onGroupChange('Symbol', checked)}
					/>
					<GroupByToggle
						label="Month"
						onText="On"
						offText="Off"
						onChange={(_e, checked) => onGroupChange('Month', checked)}
					/>
				</ButtonContainer>

				<ArqueroTableHeader table={grouped} />
				<ArqueroDetailsList {...args} table={grouped} metadata={metadata} />
			</Table>
		)
	},
)
