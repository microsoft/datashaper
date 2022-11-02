/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICheckboxProps, ICommandBarProps } from '@fluentui/react'
import { useMemo, useState } from 'react'

import { useHeaderCommandBarDefaults } from '../../../../hooks/index.js'

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

export function useCommandBar(): ICommandBarProps {
	const items = useMemo(
		() => [
			{
				key: 'add',
				text: 'Normal',
				iconProps: {
					iconName: 'Add',
				},
			},
			{
				key: 'delete',
				text: 'Disabled',
				disabled: true,
				iconProps: {
					iconName: 'Delete',
				},
			},
			{
				key: 'checked',
				text: 'Checked',
				checked: true,
				iconProps: {
					iconName: 'CheckboxComposite',
				},
			},
		],
		[],
	)
	return useHeaderCommandBarDefaults({ items })
}

export function useFarCommandBar(): ICommandBarProps {
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
	return useHeaderCommandBarDefaults({ items }, true)
}
