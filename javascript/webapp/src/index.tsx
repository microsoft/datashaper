/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { App } from './components'

function mount(): void {
	try {
		const root = document.getElementById('root')
		initializeIcons(undefined, { disableWarnings: true })
		render(<App />, root)
	} catch (err) {
		console.error('error rendering application', err)
	}
}
mount()
