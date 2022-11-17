/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import styled from '@essex/styled-components'
import { memo, useCallback } from 'react'

import { CodebookFieldEditor } from './CodebookFieldEditor.js'
import type { CodebookTableEditorProps } from './CodebookTableEditor.types.js'

export const CodebookTableEditor: React.FC<CodebookTableEditorProps> = memo(
	function CodebookTableEditor({
		fields,
		onChange,
		showInlineLabel,
		showFields,
	}) {
		const onChangeField = useCallback(
			(newField: Field) => {
				const fieldIndex = fields.findIndex(x => x.name === newField.name)
				onChange([
					...fields.slice(0, fieldIndex),
					newField,
					...fields.slice(fieldIndex + 1),
				])
			},
			[onChange, fields],
		)

		return (
			<Container>
				{fields.map((f: Field, index: number) => {
					return (
						<CodebookFieldEditor
							key={index}
							field={f}
							onChange={onChangeField}
							showInlineLabel={showInlineLabel}
							showOutsideLabel={index === 0}
							showFields={showFields}
						/>
					)
				})}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	margin-left: 80px;
	overflow: auto;
	.codebook-column:not(:last-child) {
		border-right: unset;
	}
`
