/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { lazy, memo } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Pages } from './Pages.js'

const PrepareDataPage = lazy(() =>
	/* webpackChunkName: "PrepareDataPage " */ import(
		'../pages/PrepareDataPage/PrepareDataPage.js'
	).then(module => ({
		default: module.PrepareDataPage,
	})),
)

const DebugPage = lazy(() =>
	/* webpackChunkName: "DebugPage " */ import(
		'../pages/DebugPage/DebugPage.js'
	).then(module => ({
		default: module.DebugPage,
	})),
)

export const RouteOptions: React.FC = memo(function RouteOptions() {
	return (
		<Routes>
			<Route path="/" element={<PrepareDataPage />} />
			<Route path={Pages.Prepare.path} element={<PrepareDataPage />} />
			<Route path={Pages.Debug.path} element={<DebugPage />} />
		</Routes>
	)
})
