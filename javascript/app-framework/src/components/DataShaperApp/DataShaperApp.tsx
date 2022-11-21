/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { type AllotmentHandle, Allotment } from 'allotment'
import { memo, useRef } from 'react'

import { FileTree } from '../resources/index.js'
import { ContentSelector } from './ContentSelector.js'
import {
	useHandlerArgs,
	useOnChangeWidth,
	useOnToggle,
} from './DataShaperApp.hooks.js'
import { useFileTreeStyle } from './DataShaperApp.styles.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'

const PANE_EXPANDED_SIZE = 300
const PANE_COLLAPSED_SIZE = 60

const emptyArray = Object.freeze([]) as any

export const DataShaperApp: React.FC<DataShaperAppProps> = memo(
	function DataShaperApp({
		className,
		examples = emptyArray,
		appResources = emptyArray,
		selectedKey,
		handlers,
		onSelect,
		children,
	}) {
		const fileTreeStyle = useFileTreeStyle()
		const ref = useRef<AllotmentHandle | null>(null)
		const [
			expanded,
			{ toggle: toggleExpanded, setTrue: expand, setFalse: collapse },
		] = useBoolean(true)
		const onToggle = useOnToggle(ref, expanded, toggleExpanded)
		const onChangeWidth = useOnChangeWidth(expanded, collapse, expand)
		const { handler, args } = useHandlerArgs(selectedKey)

		return (
			<Allotment
				className={className}
				onChange={onChangeWidth}
				proportionalLayout={false}
				ref={ref}
				separator={false}
			>
				<Allotment.Pane
					preferredSize={PANE_EXPANDED_SIZE}
					maxSize={PANE_EXPANDED_SIZE}
					minSize={PANE_COLLAPSED_SIZE}
				>
					<FileTree
						expanded={expanded}
						toggleExpanded={onToggle}
						style={fileTreeStyle}
						appResources={appResources}
						examples={examples}
						selectedKey={selectedKey}
						onSelect={onSelect}
					/>
				</Allotment.Pane>
				<Allotment.Pane>
					<ContentSelector handler={handler} args={args} handlers={handlers}>
						{children}
					</ContentSelector>
				</Allotment.Pane>
			</Allotment>
		)
	},
)
