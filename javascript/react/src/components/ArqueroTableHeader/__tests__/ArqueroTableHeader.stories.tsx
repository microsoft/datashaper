/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader } from '@datashaper/react'
import { table } from 'arquero'
import { useState } from 'react'

const meta = {
	title: 'Arquero Table Header',
}

export default meta

const mockTable = table({
	ID: [1, 2, 3, 4, 5, 6],
	FY20: [10000, 56000, 45000, 5000, 8900, 90000],
	FY21: [5000, 4000, 45000, 6000, 9000, 78000],
})

/**
 * ArqueroTableHeaderStory is a ArqueroTableHeader based
 */
export const ArqueroTableHeaderStory = (): JSX.Element => {
	const [tableName, setTableName] = useState('Table1')

	return (
		<ArqueroTableHeader
			table={mockTable}
			name={tableName}
			showRowCount={true}
			showColumnCount={true}
			visibleColumns={['ID', 'FY20', 'FY21']}
			onRenameTable={name => setTableName(name)}
		/>
	)
}

ArqueroTableHeaderStory.story = {
	name: 'ArqueroTableHeader',
}
