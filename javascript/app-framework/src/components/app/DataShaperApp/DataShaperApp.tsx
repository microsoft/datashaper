/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect } from 'react'
import { DataPackageProvider } from '../../../context/index.js'
import type { DataShaperAppProps } from './DataShaperApp.types.js'
import { AppLayout } from './AppLayout.js'
import { useSetApplicationSettings } from '../../../settings/index.js'
import type { ApplicationSettings } from '../../../types.js'

/**
 * A component for rendering a data-shaper application.
 * This includes a resource management UI area and a main area that renders selected content based on its profile type.
 * It is expected that this application is rendered under a react-router Router component.
 *
 */
export const DataShaperApp: React.FC<DataShaperAppProps> = memo(
	function DataShaperApp(props) {
		const { settings } = props
		useSetDefaultSettings(settings)
		return (
			<DataPackageProvider>
				{/* use a new component to allow for the new datapackage to exist in context */}
				<AppLayout {...props} />
			</DataPackageProvider>
		)
	},
)

function useSetDefaultSettings(settings?: ApplicationSettings) {
	const setter = useSetApplicationSettings()
	useEffect(() => {
		setter((prev) => ({ ...prev, ...settings }))
	}, [settings, setter])
}
