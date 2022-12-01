/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AllotmentHandle } from 'allotment'
import { Allotment } from 'allotment'
import { memo, useCallback, useRef } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { DataPackageProvider } from '../../../context/index.js'
import { EMPTY_ARRAY } from '../../../empty.js'
import type { ResourceRoute } from '../../../types.js'
import { RenameModal } from '../../modals/index.js'
import { ResourcesPane } from '../ResourcesPane/index.js'
import {
	useAppServices,
	useExpandedState,
	useFlattened,
	useRegisteredProfiles,
} from './DataShaperApp.hooks.js'
import { useFileTreeStyle } from './DataShaperApp.styles.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'
import { useResourceRoutes } from './useResourceRoutes.js'

const PANE_EXPANDED_SIZE = 300
const PANE_COLLAPSED_SIZE = 60

/**
 * A component for rendering a data-shaper application.
 * This includes a resource management UI area and a main area that renders selected content based on its profile type.
 * It is expected that this application is rendered under a react-router Router component.
 *
 */
export const DataShaperApp: React.FC<DataShaperAppProps> = memo(
	function DataShaperApp(props) {
		return (
			<DataPackageProvider>
				{/* use a new component to allow for the new datapackage to exist in context */}
				<AppInner {...props} />
			</DataPackageProvider>
		)
	},
)

const AppInner: React.FC<DataShaperAppProps> = memo(function AppInner({
	className,
	examples = EMPTY_ARRAY,
	profiles,
	children,
}) {
	const ref = useRef<AllotmentHandle | null>(null)
	const [expanded, onToggle, onChangeWidth] = useExpandedState(ref)

	const navigate = useNavigate()
	const fileTreeStyle = useFileTreeStyle()
	const selectedKey = useLocation().pathname
	const onSelect = useCallback(
		(v: ResourceRoute) => navigate(v.href),
		[navigate],
	)
	const {
		api,
		rename: {
			isOpen: isRenameOpen,
			resource: renameResource,
			onDismiss: onCancelRename,
			onAccept: onAcceptRename,
		},
	} = useAppServices()

	const plugins = useRegisteredProfiles(api, profiles)
	const resources = useResourceRoutes(api, plugins)
	const flattenedRoutes = useFlattened(resources)

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
				<ResourcesPane
					resources={resources}
					expanded={expanded}
					plugins={plugins}
					style={fileTreeStyle}
					selectedKey={selectedKey}
					examples={examples}
					onToggleExpanded={onToggle}
					onSelect={onSelect}
				/>
			</Allotment.Pane>
			<Allotment.Pane>
				<Routes>
					<Route path="/" element={children} />
					{flattenedRoutes.map(r => (
						<Route
							key={r.href}
							path={r.href}
							element={<r.renderer {...r.props} />}
						/>
					))}
					<Route path="*" element={<NoMatch />} />
				</Routes>
				<>
					<RenameModal
						resource={renameResource}
						isOpen={isRenameOpen}
						onDismiss={onCancelRename}
						onAccept={onAcceptRename}
					/>
				</>
			</Allotment.Pane>
		</Allotment>
	)
})

function NoMatch() {
	return <div style={{ padding: 25 }}>No Route Matched</div>
}
