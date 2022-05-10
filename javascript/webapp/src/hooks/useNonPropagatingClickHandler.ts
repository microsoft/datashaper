import { useCallback } from 'react'

export function useNonPropagatingClickHandler(
	onClick: () => void,
): (e: React.MouseEvent) => void {
	return useCallback(
		(e: React.MouseEvent<unknown>) => {
			e.stopPropagation()
			onClick()
		},
		[onClick],
	)
}
