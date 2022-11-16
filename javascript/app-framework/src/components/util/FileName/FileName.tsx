/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { memo } from 'react'

import { FileNameContainer, LabelName } from './FileName.styles.js'
import type { FileNameProps } from './FileName.types.js'

export const FileName: React.FC<FileNameProps> = memo(function FileName({
	name,
	setName,
	path,
}) {
	return (
		<FileNameContainer>
			<LabelName>Name: </LabelName>
			<TextField
				onChange={(_, value) => setName(value ?? '')}
				description={path ?? ''}
				value={name}
				name="fileName"
				title="file name"
				autoComplete="off"
			/>
		</FileNameContainer>
	)
})
