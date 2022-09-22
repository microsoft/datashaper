/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ArqueroDetailsListProps } from '@datashaper/react'
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import { memo } from 'react'

import { Table } from '../ArqueroDetailsList.styles.js'
import { useBigTable } from './Performance.hooks.js'

export const Performance: React.FC<ArqueroDetailsListProps> = memo(
	function Performance({ table, ...args }) {
		const { local, metadata } = useBigTable(table)

		if (!local || !metadata) {
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
