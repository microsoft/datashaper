/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Allotment, AllotmentHandle } from 'allotment'
import { memo, useRef } from 'react'
import { EMPTY_ARRAY } from '../../../empty.js'
import { ResourceTreeViewMode } from '../../../types.js'
import {
	useAppServices,
	useNarrowExpandCollapseState,
} from './AppLayout.hooks.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'
import { AppContent } from './AppContent.js'
import { AppResources } from './AppResources.js'
import {
	PANE_COLLAPSED_SIZE,
	PANE_EXPANDED_SIZE,
	PANE_MAX_SIZE,
} from './AppLayout.styles.js'

export const AppLayout: React.FC<DataShaperAppProps> = memo(function AppInner({
	className,
	examples = EMPTY_ARRAY,
	profiles,
	children,
	fallback = children,
	defaultHelp = 'resources.index',
	defaultResourceTreeViewMode = ResourceTreeViewMode.Expanded,
}) {
	const ref = useRef<AllotmentHandle | null>(null)
	const [expanded, onToggle, onChangeWidth] = useNarrowExpandCollapseState(
		defaultResourceTreeViewMode !== ResourceTreeViewMode.Collapsed,
		ref,
	)
	const { api, rename, help } = useAppServices(defaultHelp)
	const content = (
		<AppContent
			api={api}
			rename={rename}
			profiles={profiles}
			fallback={fallback}
		>
			{children}
		</AppContent>
	)

	return defaultResourceTreeViewMode === ResourceTreeViewMode.Hidden ? (
		content
	) : (
		<Allotment
			className={className}
			onChange={onChangeWidth}
			ref={ref}
			proportionalLayout={false}
			separator={false}
		>
			<Allotment.Pane {...resourcePaneProps}>
				<AppResources
					api={api}
					profiles={profiles}
					help={help}
					examples={examples}
					expanded={expanded}
					onToggleNarrow={onToggle}
				/>
			</Allotment.Pane>
			<Allotment.Pane>{content}</Allotment.Pane>
		</Allotment>
	)
})

const resourcePaneProps = {
	preferredSize: PANE_EXPANDED_SIZE,
	maxSize: PANE_MAX_SIZE,
	minSize: PANE_COLLAPSED_SIZE,
}
