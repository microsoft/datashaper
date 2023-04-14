/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initializeIcons } from '@fluentui/font-icons-mdl2'
import { createRoot } from 'react-dom/client'

import { App } from './App/index.js'

function mount(): void {
	try {
		const rootElement = document.getElementById('root')
		if (rootElement == null) {
			throw new Error('could not create root element')
		}
		const root = createRoot(rootElement)
		root.render(<App />)
	} catch (err) {
		console.error('error rendering application', err)
	}
}
initializeIcons(undefined, { disableWarnings: true })
mount()
