/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Resource } from '@datashaper/workflow'
import { memo } from 'react'
import type { ProfileComponentProps } from '../../../types.js'
import { LanguageEditor } from '../LanguageEditor/index.js'
import { useContent, useOnChange } from './ResourceSchemaEditor.hooks.js'

export const ResourceSchemaEditor: React.FC<ProfileComponentProps<Resource>> =
	memo(function ResourceSchemaEditor({ resource }) {
		const content = useContent(resource)
		const onChange = useOnChange(resource)
		return (
			<LanguageEditor content={content} onChange={onChange} language={'json'} />
		)
	})
