/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import localforage from 'localforage'

// import type { Settings } from '../models/Settings.js'

// export async function setDarkMode(isDarkMode: boolean): Promise<void> {
// 	await localforage.setItem('isDarkMode', isDarkMode).catch((error) => {
// 		console.log('error saving into indexDB')
// 	})
// }

// export async function isDarkMode(): Promise<boolean> {
// 	const darkMode = await localforage.getItem('isDarkMode')
// 	let darkModeCasted = false

// 	if (darkMode !== undefined) darkModeCasted = darkMode as boolean

// 	return darkModeCasted
// }

// async function setDefaultDarkModeValue(): Promise<void> {
// 	const darkMode = await localforage.getItem('isDarkMode')
// 	if (darkMode === undefined) setDarkMode(false)
// }

// export function setDefaultSettings(): void {
// 	setDefaultDarkModeValue()
// }

// export async function getDefaultSettings(): Promise<Settings> {
// 	const settingsResponse: Settings = {
// 		isDarkMode: await isDarkMode(),
// 	}

// 	return settingsResponse
// }
