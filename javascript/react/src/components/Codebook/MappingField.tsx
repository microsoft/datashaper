/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Label, TextField } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import type { CodebookFieldEditorProps } from './CodebookFieldEditor.types.js'

export const MappingField: React.FC<CodebookFieldEditorProps> = memo(
	function MappingField({ field }) {
		return (
			<MappingContainer className="field">
				<FlexColumn style={{ flex: 1 }}>
					<Label style={{ paddingTop: 'unset' }}>Value</Label>
					<TextField disabled={field.exclude} name="unit" value={field.unit} />
				</FlexColumn>
				<FlexColumn style={{ flex: 2 }}>
					<Label style={{ paddingTop: 'unset' }}>Display</Label>
					<TextField disabled={field.exclude} name="unit" value={field.unit} />
				</FlexColumn>
				<FlexColumn>
					<Label style={{ paddingTop: 'unset' }}>Null</Label>

					<Checkbox disabled={field.exclude} />
				</FlexColumn>
			</MappingContainer>
		)
	},
)

const Flex = styled.div`
	display: flex;
`

const MappingContainer = styled(Flex)`
	column-gap: 5px;
`
const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
`
