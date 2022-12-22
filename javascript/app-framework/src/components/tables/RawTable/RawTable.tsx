/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import { MessageBarType } from '@fluentui/react'
import { memo } from 'react'

import {
	DatasetContainer,
	DetailsListContainer,
	Message,
	useHeaderStyles,
} from './RawTable.styles.js'
import type { RawTableProps } from './RawTable.types.js'
import { RawTableDefaultFeatures } from './RawTable.types.js'

export const RawTable: React.FC<RawTableProps> = memo(function RawTable({
	table,
	error,
	features = RawTableDefaultFeatures,
	...props
}) {
	const headerStyles = useHeaderStyles()
	return (
		<>
			{error && (
				<Message messageBarType={MessageBarType.error} isMultiline={false}>
					{error}
				</Message>
			)}

			<DatasetContainer>
				<ArqueroTableHeader table={table} styles={headerStyles} />
				<DetailsListContainer>
					<ArqueroDetailsList
						compact
						sortable
						isHeaderFixed
						showColumnBorders
						table={table}
						features={features}
						{...props}
					/>
				</DetailsListContainer>
			</DatasetContainer>
		</>
	)
})
