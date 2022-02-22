import { default as localforage } from 'localforage'

export async function setDarkMode(isDarkMode: boolean) {
	await localforage.setItem('isDarkMode', isDarkMode).catch(error => {
		console.log('error saving into indexDB')
	})
}

export async function isDarkMode(): Promise<boolean> {
	let darkMode = await localforage.getItem('isDarkMode')
	let darkModeCasted: boolean = false

	if (darkMode !== undefined) darkModeCasted = darkMode as boolean

	return darkModeCasted
}

async function setDefaultDarkModeValue() {
	let darkMode = await localforage.getItem('isDarkMode')
	if (darkMode !== undefined) setDarkMode(false)
}

export async function setDefaultSettings() {
	setDefaultDarkModeValue()
}
