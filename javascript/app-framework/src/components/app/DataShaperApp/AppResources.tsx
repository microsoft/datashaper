/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback, useMemo } from 'react'
import { ResourcesPane } from '../ResourcesPane/ResourcesPane.js'
import {
	useRegisterProfileHelp,
	useRegisteredProfiles,
} from './AppLayout.hooks.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { useResourceRoutes } from './useResourceRoutes.js'
import type { ResourceRoute } from '../../../types.js'
import { useFileTreeStyle } from './AppLayout.styles.js'
import type { AppResourcesProps } from './AppResources.types.js'

export const AppResources: React.FC<AppResourcesProps> = memo(
	function AppResources({
		api,
		profiles,
		examples,
		help: { currentHelp, helpContent, onInitializeHelp },
		expanded,
		onToggleNarrow,
	}) {
		const navigate = useNavigate()
		const pathname = useLocation().pathname
		const appProfiles = useRegisteredProfiles(api, profiles)
		const resources = useResourceRoutes(api, appProfiles)
		const fileTreeStyle = useFileTreeStyle()
		const selectedKey = useMemo(() => decodeURI(pathname), [pathname])
		const onSelect = useCallback(
			(v: ResourceRoute) => {
				if (v.href) {
					navigate(v.href)
				}
			},
			[navigate],
		)

		useRegisterProfileHelp(appProfiles, onInitializeHelp)

		return (
			<ResourcesPane
				resources={resources}
				narrow={!expanded}
				profiles={appProfiles}
				style={fileTreeStyle}
				selectedKey={selectedKey}
				examples={examples}
				onToggleNarrow={onToggleNarrow}
				onSelect={onSelect}
				currentHelp={currentHelp}
				helpContent={helpContent}
			/>
		)
	},
)
