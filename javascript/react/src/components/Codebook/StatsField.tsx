/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Label } from '@fluentui/react'
import type { FormEvent } from 'react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { HistogramColumnHeader } from '../ArqueroDetailsList/renderers/HistogramColumnHeader.js'
import { StatsColumnHeader } from '../ArqueroDetailsList/renderers/StatsColumnHeader.js'
import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'

export const StatsField: React.FC<CodebookFieldEditorProps> = memo(
	function StatsField({ field, onChange }) {
		const onChangeExclude = useCallback(
			(
				_?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
				checked?: boolean | undefined,
			) => {
				onChange({ ...field, exclude: !!checked })
			},
			[onChange, field],
		)

		return (
			<Container className="field">
				<Flex>
					<Checkbox checked={field.exclude} onChange={onChangeExclude} />
					<FieldName>{field.name}</FieldName>
				</Flex>
				<StatsColumnHeader field={field}></StatsColumnHeader>
				<HistogramColumnHeader field={field}></HistogramColumnHeader>
			</Container>
		)
	},
)

const Container = styled.div``

const Flex = styled.div`
	display: flex;
`
const FieldName = styled(Label)`
	margin: auto;
`
