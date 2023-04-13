/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const state = atom({
	key: 'framework-application-settings',
	default: {},
})

/**
 * Get the recoil state tuple for top-level application settings
 * @returns
 */
export function useApplicationSettings(): [any, SetterOrUpdater<any>] {
	return useRecoilState(state)
}

/**
 * Get the application settings value only.
 * @returns
 */
export function useApplicationSettingsValue(): any {
	return useRecoilValue(state)
}

/**
 * Get the setter for application settings.
 * @returns
 */
export function useSetApplicationSettings(): SetterOrUpdater<any> {
	return useSetRecoilState(state)
}
