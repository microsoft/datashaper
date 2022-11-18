/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type IColumn, Checkbox } from '@fluentui/react'
import { type FormEvent, memo, useCallback } from 'react'

import { StatsColumnType } from '../ArqueroDetailsList/ArqueroDetailsList.types.js'
import { HistogramColumnHeader } from '../ArqueroDetailsList/renderers/HistogramColumnHeader.js'
import { StatsColumnHeader } from '../ArqueroDetailsList/renderers/StatsColumnHeader.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'
import { Container, FieldName, Flex } from './StatsField.styles.js'

const DEFAULT_STATS = [
	StatsColumnType.Count,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Example,
]

const histogramColumn = { currentWidth: 210 } as IColumn
export const StatsField: React.FC<CodebookFieldEditorProps> = memo(
	function StatsField({ field, onChange, tableView }) {
		const onChangeExclude = useCallback(
			(
				_?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
				checked?: boolean | undefined,
			) => {
				onChange({ ...field, exclude: !checked })
			},
			[onChange, field],
		)

		return (
			<Container className="field">
				<Flex>
					{tableView && (
						<Checkbox checked={!field.exclude} onChange={onChangeExclude} />
					)}
					<FieldName>{field.name}</FieldName>
				</Flex>
				<StatsColumnHeader
					stats={DEFAULT_STATS}
					field={field}
				></StatsColumnHeader>
				<HistogramColumnHeader
					column={histogramColumn}
					field={field}
				></HistogramColumnHeader>
			</Container>
		)
	},
)
