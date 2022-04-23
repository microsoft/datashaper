/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createRoot } from 'react-dom/client'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'

import { App } from '~components'
import { setDefaultSettings } from '~localStorageHandler'

function mount(): void {
	try {
		const rootElement = document.getElementById('root')
		initializeIcons(undefined, { disableWarnings: true })
		setDefaultSettings()
		const root = createRoot(rootElement!)
		root.render(<App />)
	} catch (err) {
		console.error('error rendering application', err)
	}
}
mount()
