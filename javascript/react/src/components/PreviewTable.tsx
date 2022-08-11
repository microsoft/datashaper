/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import {
	ArqueroDetailsList,
	StatsColumnType,
} from './ArqueroDetailsList/index.js'
import { ArqueroTableHeader } from './ArqueroTableHeader/index.js'
import { DetailText } from './DetailText.js'
import { useToggleTableFeatures } from './PreviewTable.hooks.js'
import { Container, TextContainer } from './PreviewTable.styles.js'
import type { PreviewTableProps } from './PreviewTable.types.js'

const statsColumnTypes = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

export const PreviewTable: React.FC<PreviewTableProps> = memo(
	function PreviewTable({
		table,
		headerCommandBar,
		name,
		metadata,
		onChangeMetadata,
	}) {
		const { tableFeatures } = useToggleTableFeatures()

		return (
			<>
				{table ? (
					<Container>
						<ArqueroTableHeader name={name} table={table} />
						<ArqueroDetailsList
							isSortable
							compact
							showColumnBorders
							isHeadersFixed
							metadata={metadata}
							onChangeMetadata={onChangeMetadata}
							features={{
								...tableFeatures,
								statsColumnTypes: statsColumnTypes,
								commandBar: headerCommandBar ? headerCommandBar : undefined,
							}}
							table={table}
						/>
					</Container>
				) : (
					<TextContainer>
						<DetailText text="(No table selected)" />
					</TextContainer>
				)}
			</>
		)
	},
)
