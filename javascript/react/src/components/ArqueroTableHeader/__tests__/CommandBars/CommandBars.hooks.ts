/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICheckboxProps } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { useMemo, useState } from 'react'

import { createDefaultHeaderCommandBar } from '../../../../component-factories.js'

export function useCheckboxes(): {
	near: boolean
	far: boolean
	checkboxes: ICheckboxProps[]
} {
	const [near, setNear] = useState<boolean>(true)
	const [far, setFar] = useState<boolean>(true)

	const checkboxes = useMemo(() => {
		return [
			{
				label: 'Show main bar',
				checked: near,
				onChange: (
					_ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
					checked?: boolean,
				) => setNear(checked!),
			},
			{
				label: 'Show far bar',
				checked: far,
				onChange: (
					_ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
					checked?: boolean,
				) => setFar(checked!),
			},
		]
	}, [near, far, setNear, setFar])
	return {
		near,
		far,
		checkboxes,
	}
}

export function useCommandBar(): JSX.Element {
	// TODO: this theme is not coming from the story context correcty
	const theme = useThematic()

	const items = useMemo(
		() => [
			{
				key: 'add',
				text: 'Add',
				iconProps: {
					iconName: 'Add',
				},
			},
			{
				key: 'delete',
				text: 'Delete',
				iconProps: {
					iconName: 'Delete',
				},
			},
		],
		[],
	)
	return useMemo(
		() => createDefaultHeaderCommandBar({ items }, theme),
		[items, theme],
	)
}

export function useFarCommandBar(): JSX.Element {
	// TODO: this theme is not coming from the story context correcty
	const theme = useThematic()

	const items = useMemo(
		() => [
			{
				key: 'download',
				iconProps: {
					iconName: 'Download',
				},
			},
		],
		[],
	)
	return useMemo(
		() => createDefaultHeaderCommandBar({ items }, theme, true),
		[items, theme],
	)
}
