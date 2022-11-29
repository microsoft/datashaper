/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MutableRefObject} from 'react';
import { useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOnOutsideClick(
	ref: MutableRefObject<HTMLElement | null>,
	onClickOutside: () => void,
) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
				onClickOutside()
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref, onClickOutside])
}
