import { useCallback } from 'react'
import type { ColumnSpreadProps } from './ColumnSpread.types.js'

export function useHandleColumnChange(onChange: ColumnSpreadProps['onChange']) {
	return useCallback(
		(_e: any, opt: string | undefined) => {
			opt && onChange?.(opt)
		},
		[onChange],
	)
}
