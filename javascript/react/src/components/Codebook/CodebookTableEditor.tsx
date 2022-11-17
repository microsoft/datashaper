/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { CodebookFieldEditor } from './CodebookFieldEditor.js'
import type { CodebookFields } from './CodebookFieldEditor.types.js'

export const CodebookTableEditor: React.FC<{
	fields: Field[]
	onChange: (fields: Field[]) => void
	showInlineLabel?: boolean
	showFields?: CodebookFields[]
}> = memo(function CodebookTableEditor({
	fields,
	onChange,
	showInlineLabel,
	showFields,
}) {
	const onChangeField = useCallback(
		(newField: Field) => {
			const arr = [...fields]
			const index = arr.findIndex(x => x.name === newField.name)
			onChange([...arr.slice(0, index), newField, ...arr.slice(index + 1)])
		},
		[onChange, fields],
	)

	return (
		<div>
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
		</div>
	)
})

const Container = styled.div`
	display: flex;
	margin-left: 80px;
	overflow: auto;
	.codebook-column:not(:last-child) {
		border-right: unset;
	}
`
