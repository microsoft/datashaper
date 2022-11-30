/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import type { Resource } from '@datashaper/workflow'
import type { AllotmentHandle } from 'allotment'
import { Allotment } from 'allotment'
import { memo, useCallback, useRef, useState } from 'react'
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
import { reject } from 'lodash-es'

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
	const [
		isRenameModalOpen,
		{ setTrue: showRenameModal, setFalse: hideRenameModal },
	] = useBoolean(false)
	const [renameResource, setRenameResource] = useState<Resource | undefined>()

	const navigate = useNavigate()
	const fileTreeStyle = useFileTreeStyle()
	const selectedKey = useLocation().pathname
	const onSelect = useCallback(
		(v: ResourceRoute) => navigate(v.href),
		[navigate],
	)
	const [resolve, setResolve] = useState<(value: string) => void>(
		() => () => {},
	)
	const [reject, setReject] = useState<(error: unknown) => void>(() => () => {})
	const api = useAppServices(resource => {
		setRenameResource(resource)
		showRenameModal()
		return new Promise((resolve, reject) => {
			setResolve(resolve)
			setReject(reject)
		})
	})
	const onAcceptRename = useCallback(
		(name: string | undefined) => {
			hideRenameModal()
			if (name != null && renameResource != null) {
				renameResource.name = name
				resolve(name)
			} else {
				reject('invalid name')
			}
		},
		[renameResource, resolve, reject, hideRenameModal],
	)
	const onCancelRename = useCallback(() => {
		hideRenameModal()
		reject('cancelled')
	}, [reject])

	const plugins = useRegisteredProfiles(api, profiles)
	const resources = useResourceRoutes(plugins)
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
						isOpen={isRenameModalOpen}
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
