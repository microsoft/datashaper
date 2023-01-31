/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Codebook as CodebookComponent } from '@datashaper/react'
import type { CodebookTableStyles } from '@datashaper/react'
import type { Codebook } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { memo } from 'react'
import { useHelpOnMount } from '../../../hooks/useHelpOnMount.js'

import { useOnFieldsChanged } from './CodebookEditor.hooks.js'
import type { PluginComponentProps } from '../../../types.js'

export const CodebookEditor: React.FC<PluginComponentProps<Codebook>> = memo(
	function CodebookEditor({ resource }) {
		const handleFieldsChanged = useOnFieldsChanged(resource)
		const fields = useObservableState(resource.fields$, resource.fields)
		useHelpOnMount('resources.codebook.index')
		return (
			<CodebookComponent
				fields={fields}
				onChangeFields={handleFieldsChanged}
				styles={styles}
			/>
		)
	},
)

const styles: CodebookTableStyles = {
	tableWrapper: {
		padding: 30,
	},
}
