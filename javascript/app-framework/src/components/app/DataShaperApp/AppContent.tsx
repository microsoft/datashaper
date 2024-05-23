/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppServicesContext } from '../../../context/app_services/index.js'

import { EMPTY_OBJECT } from '../../../empty.js'
import type { ResourceRoute } from '../../../types.js'
import { RenameModal } from '../../modals/index.js'
import type { AppContentProps } from './AppContent.types.js'
import { useFlattened } from './AppLayout.hooks.js'
import { useResourceRoutes } from './useResourceRoutes.js'

export const AppContent: React.FC<AppContentProps> = memo(function AppContent({
	api,
	rename: {
		resource: renameResource,
		isOpen: isRenameOpen,
		onDismiss: onCancelRename,
		onAccept: onAcceptRename,
	},
	appProfiles,
	children,
	fallback,
}) {
	const resources = useResourceRoutes(api, appProfiles)
	const flattenedRoutes = useFlattened(resources)
	return (
		<AppServicesContext.Provider value={api}>
			<Routes>
				<Route path="/" element={children} />
				{flattenedRoutes.map(
					(r) =>
						r.renderer && (
							<Route
								key={`route-${r.href}`}
								path={(r.children?.length ?? 0) > 0 ? r.href : `${r.href}/*`}
								element={<MatchedRoute key={`matched-${r.href}`} data={r} />}
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
		</AppServicesContext.Provider>
	)
})

const MatchedRoute: React.FC<{ data: ResourceRoute }> = memo(
	function MatchedRoute({ data: { props, renderer: R, href } }) {
		return R ? <R href={href} {...(props ?? EMPTY_OBJECT)} /> : null
	},
)
