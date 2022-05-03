import { useMemo } from 'react'

export function useStaticValue<T>(value: T): T {
	return useMemo<T>(() => value, [])
}
