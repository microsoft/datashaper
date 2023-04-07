/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Footer } from './Footer.js'
import { Header } from './Header.js'
import { Content } from './Layout.styles.js'

export const Layout: React.FC<
	React.PropsWithChildren<{
		/*nothing*/
	}>
> = memo(function Layout({ children }) {
	return (
		<>
			<Header />
			<Content className={'layout-content-container'}>{children}</Content>
			<Footer />
		</>
	)
})
