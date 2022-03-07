/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDebounceFn } from 'ahooks'
import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
const currentHelpFileContent = atom<string>({
	key: 'url',
	default: '',
})

export function useHelpFileContent(): [string, SetterOrUpdater<string>] {
	return useRecoilState(currentHelpFileContent)
}

export function useHelpFileContentValue(): string {
	return useRecoilValue(currentHelpFileContent)
}

export function useHelpFileContentSetter(): SetterOrUpdater<string> {
	return useSetRecoilState(currentHelpFileContent)
}

export const useHelpFileContentDebounced = (): [
	string,
	SetterOrUpdater<string>,
] => {
	const [helpFileContent, setHelpFileContent] = useHelpFileContent()
	const debouncedHelpFileContent = useDebounceFn(
		(newHelpFileContent: any) => setHelpFileContent(newHelpFileContent),
		{
			wait: 250,
		},
	)
	return [helpFileContent, debouncedHelpFileContent.run]
}
