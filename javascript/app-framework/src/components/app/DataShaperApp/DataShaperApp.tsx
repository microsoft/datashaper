/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { type AllotmentHandle, Allotment } from 'allotment'
import { memo, useCallback, useRef } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { EMPTY_ARRAY } from '../../../empty.js'
import type { ResourceTreeData } from '../FileTree/index.js'
import { FileTree } from '../FileTree/index.js'
import {
	useDataPackageResourceRoutes,
	useOnChangeWidth,
	useOnToggle,
	useRegisteredProfiles,
} from './DataShaperApp.hooks.js'
import { useFileTreeStyle } from './DataShaperApp.styles.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'

const PANE_EXPANDED_SIZE = 300
const PANE_COLLAPSED_SIZE = 60

/**
 * A component for rendering a data-shaper application.
 * This includes a resource management UI area and a main area that renders selected content based on its profile type.
 * It is expected that this application is rendered under a react-router Router component.
 *
 */
export const DataShaperApp: React.FC<DataShaperAppProps> = memo(
	function DataShaperApp({
		className,
		examples = EMPTY_ARRAY,
		profiles,
		children,
	}) {
		const navigate = useNavigate()
		const fileTreeStyle = useFileTreeStyle()
		const ref = useRef<AllotmentHandle | null>(null)
		const [
			expanded,
			{ toggle: toggleExpanded, setTrue: expand, setFalse: collapse },
		] = useBoolean(true)
		const onToggle = useOnToggle(ref, expanded, toggleExpanded)
		const onChangeWidth = useOnChangeWidth(expanded, collapse, expand)

		const selectedKey = useLocation().pathname
		const onSelect = useCallback(
			(v: ResourceTreeData) => {
				navigate(v.href)
			},
			[navigate],
		)

		const plugins = useRegisteredProfiles(profiles)
		const routes = useDataPackageResourceRoutes(plugins)

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
						examples={examples}
						selectedKey={selectedKey}
						plugins={plugins}
						onSelect={onSelect}
					/>
				</Allotment.Pane>
				<Allotment.Pane>
					<Routes>
						<Route path="/" element={children} />
						{routes.map(r => (
							<Route
								key={r.path}
								path={r.path}
								element={<r.renderer {...r.props} />}
							/>
						))}
						<Route path="*" element={<NoMatch />} />
					</Routes>
				</Allotment.Pane>
			</Allotment>
		)
	},
)

function NoMatch() {
	return <div style={{ padding: 25 }}>No Route Matched</div>
}
