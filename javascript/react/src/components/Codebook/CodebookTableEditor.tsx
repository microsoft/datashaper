/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import styled from '@essex/styled-components'
import { memo } from 'react'

import { CodebookFieldEditor } from './CodebookFieldEditor.js'
import type { CodebookTableEditorProps } from './CodebookTableEditor.types.js'

export const CodebookTableEditor: React.FC<CodebookTableEditorProps> = memo(
	function CodebookTableEditor({ fields, onChange, showFields, hideLabel }) {
		return (
			<Container>
				{fields.map((f: Field, index: number) => {
					return (
						<CodebookFieldEditor
							key={index}
							field={f}
							onChange={(newField: Field) =>
								onChange([
									...fields.slice(0, index),
									newField,
									...fields.slice(index + 1),
								])
							}
							showFields={showFields}
							hideLabel={index > 0 || hideLabel}
							tableView
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
