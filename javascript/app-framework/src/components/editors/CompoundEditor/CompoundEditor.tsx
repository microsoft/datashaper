/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useMemo } from 'react'

import type {
	EditorConfig,
	CompoundEditorProps,
} from './CompoundEditor.types.js'
import { ViewOptions } from './ViewOptions.js'

export const CompoundEditor: React.FC<CompoundEditorProps> = memo(
	function CompoundEditor({ resource, editors }) {
		const [selectedKey, setSelectedKey] = useState<string>(
			editors[editors.length - 1]!.key,
		)
		const options = useViewOptions(editors)
		const Renderer = useRenderer(editors, selectedKey)
		return (
			<>
				<ViewOptions
					options={options}
					selectedKey={selectedKey}
					onChange={setSelectedKey}
				/>
				<Renderer resource={resource} />
			</>
		)
	},
)

function useRenderer(editors: EditorConfig[], selectedKey: string) {
	return editors.find((editor) => editor.key === selectedKey)!.renderer
}

function useViewOptions(editors: EditorConfig[]) {
	return useMemo(
		() =>
			editors.map((editor) => ({
				key: editor.key,
				text: '',
				title: editor.title,
				iconProps: {
					iconName: editor.iconName,
				},
			})),
		[editors],
	)
}
