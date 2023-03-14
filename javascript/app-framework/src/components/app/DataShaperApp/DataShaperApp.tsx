/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AllotmentHandle } from 'allotment'
import { Allotment } from 'allotment'
import { memo, useCallback, useMemo, useRef } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppServicesContext } from '../../../context/app_services/index.js'

import { DataPackageProvider } from '../../../context/index.js'
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../../empty.js'
import type { ResourceRoute } from '../../../types.js'
import { RenameModal } from '../../modals/index.js'
import { ResourcesPane } from '../ResourcesPane/index.js'
import {
	useAppServices,
	useNarrowExpandCollapseState,
	useFlattened,
	useRegisteredProfiles,
	useRegisterProfileHelp,
} from './DataShaperApp.hooks.js'
import {
	PANE_COLLAPSED_SIZE,
	PANE_EXPANDED_SIZE,
	PANE_MAX_SIZE,
	useFileTreeStyle,
} from './DataShaperApp.styles.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'
import { useResourceRoutes } from './useResourceRoutes.js'

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
	fallback = children,
	defaultHelp = 'resources.index',
}) {
	const ref = useRef<AllotmentHandle | null>(null)
	const [expanded, onToggle, onChangeWidth] = useNarrowExpandCollapseState(ref)

	const navigate = useNavigate()
	const fileTreeStyle = useFileTreeStyle()
	const pathname = useLocation().pathname
	const selectedKey = useMemo(() => decodeURI(pathname), [pathname])
	const onSelect = useCallback(
		(v: ResourceRoute) => {
			if (v.href) {
				navigate(v.href)
			}
		},
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
		help: { currentHelp, onInitializeHelp, helpContent },
	} = useAppServices(defaultHelp)

	const appProfiles = useRegisteredProfiles(api, profiles)
	const resources = useResourceRoutes(api, appProfiles)
	const flattenedRoutes = useFlattened(resources)
	useRegisterProfileHelp(appProfiles, onInitializeHelp)

	return (
		<AppServicesContext.Provider value={api}>
			<Allotment
				className={className}
				onChange={onChangeWidth}
				proportionalLayout={false}
				ref={ref}
				separator={false}
			>
				<Allotment.Pane
					preferredSize={PANE_EXPANDED_SIZE}
					maxSize={PANE_MAX_SIZE}
					minSize={PANE_COLLAPSED_SIZE}
				>
					<ResourcesPane
						resources={resources}
						narrow={!expanded}
						profiles={appProfiles}
						style={fileTreeStyle}
						selectedKey={selectedKey}
						examples={examples}
						onToggleNarrow={onToggle}
						onSelect={onSelect}
						currentHelp={currentHelp}
						helpContent={helpContent}
					/>
				</Allotment.Pane>
				<Allotment.Pane>
					<Routes>
						<Route path="/" element={children} />
						{flattenedRoutes.map(
							(r) =>
								r.renderer && (
									<Route
										key={r.href}
										path={
											(r.children?.length ?? 0) > 0 ? r.href : `${r.href}/*`
										}
										element={<MatchedRoute key={r.href} data={r} />}
									/>
								),
						)}
						<Route path="*" element={fallback} />
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
		</AppServicesContext.Provider>
	)
})

const MatchedRoute: React.FC<{ data: ResourceRoute }> = memo(
	function MatchedRoute({ data: { props, renderer: R, href } }) {
		return R ? <R href={href} {...(props ?? EMPTY_OBJECT)} /> : null
	},
)
