/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { render } from 'react-dom'
import { App } from './components'

function createRoot(): HTMLElement {
	const root = document.createElement('div')
	root.id = 'root'
	document.body.appendChild(root)
	return root
}

function mount(): void {
	try {
		const root = createRoot()
		render(<App />, root)
	} catch (err) {
		console.error('error rendering application', err)
	}
}
mount()
