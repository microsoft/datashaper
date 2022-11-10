/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import { type AllotmentHandle,Allotment } from 'allotment'
import { memo, useCallback, useRef } from 'react'

import type {
	FileDefinition,
	ResourceTreeData} from '../resources/index.js';
import {
	FileTree
} from '../resources/index.js'
import { Content,useFileTreeStyle } from './DataShaperApp.styles.js'

const PANE_EXPANDED_SIZE = 300
const PANE_COLLAPSED_SIZE = 60

export interface DataShaperAppProps {
	examples?: FileDefinition[]

	/**
	 * The application resources to render in the file tree.
	 * TODO: this should be handled internally
	 */
	appResources: ResourceTreeData
	/**
	 * The child node to render
	 * TODO: handle this internally
	 */
	children: React.ReactNode
}

const emptyArray = Object.freeze([]) as any

export const DataShaperApp: React.FC<DataShaperAppProps> = memo(
	function DataShaperApp({
		examples = emptyArray,
		children,
		appResources = emptyArray,
	}) {
		const fileTreeStyle = useFileTreeStyle()
		const ref = useRef<AllotmentHandle | null>(null)
		const [expanded, { toggle: toggleExpanded }] = useBoolean(true)

		const onToggle = useCallback(() => {
			if (expanded) {
				ref?.current?.resize([60])
			} else {
				ref?.current?.reset()
			}
			toggleExpanded()
		}, [expanded, toggleExpanded])

		const changeWidth = useCallback(
			(sizes: number[]) => {
				const [menuSize] = sizes
				if ((menuSize < 150 && expanded) || (menuSize > 150 && !expanded)) {
					toggleExpanded()
				}
			},
			[expanded, toggleExpanded],
		)

		const { run: onChangeWidth } = useDebounceFn(
			(sizes: number[]) => {
				changeWidth(sizes)
			},
			{ wait: 200 },
		)

		return (
			<Content>
				<Allotment
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
						/>
					</Allotment.Pane>
					<Allotment.Pane>{children}</Allotment.Pane>
				</Allotment>
			</Content>
		)
	},
)
