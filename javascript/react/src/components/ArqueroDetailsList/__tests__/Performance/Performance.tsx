/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { ArqueroTableHeader } from '../../../ArqueroTableHeader/ArqueroTableHeader.js'
import { ArqueroDetailsList } from '../../ArqueroDetailsList.js'
import type { ArqueroDetailsListProps } from '../../ArqueroDetailsList.types.js'
import { Table } from '../ArqueroDetailsListStories.styles.js'
import { useBigTable } from './Performance.hooks.js'

export const Performance: React.FC<ArqueroDetailsListProps> = memo(
	function Performance({ table, ...args }) {
		const { local, metadata } = useBigTable(table)

		if (!(local && metadata)) {
			return <div>Loading...</div>
		}

		return (
			<Table>
				<ArqueroTableHeader table={local} />
				<ArqueroDetailsList {...args} table={local} metadata={metadata} />
			</Table>
		)
	},
)
