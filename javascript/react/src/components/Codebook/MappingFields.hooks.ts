/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

export function useChangeMappingValue(
	onChange: (mapping: Record<any, any>) => void,
	values?: Record<any, any>,
): (previousValue: any, value?: any) => void {
	return useCallback(
		(previousValue: any, newValue?: any) => {
			if (!values || !newValue) return
			let mapping: Record<any, any> = {}
			Object.keys(values).forEach((prevVal: any) => {
				if (prevVal === previousValue) {
					mapping = { ...mapping, [newValue]: values[prevVal] }
				} else {
					mapping = { ...mapping, [prevVal]: values[prevVal] }
				}
			})
			onChange(mapping)
		},
		[onChange, values],
	)
}
export function useChangeMappingDisplay(
	onChange: (mapping: Record<any, any>) => void,
	values?: Record<any, any>,
): (actualValue: any, newDisplayValue?: any) => void {
	return useCallback(
		(actualValue: number, newDisplayValue?: any) => {
			if (!values) return
			let mapping: Record<any, any> = {}
			Object.keys(values).forEach((val: any) => {
				if (actualValue === val) {
					mapping = { ...mapping, [val]: newDisplayValue }
				} else {
					mapping = { ...mapping, [val]: values[val] }
				}
			})
			onChange(mapping)
		},
		[onChange, values],
	)
}
export function useChangeMappingNull(
	onChange: (mapping: Record<any, any>) => void,
	values?: Record<any, any>,
): (actualValue: any, isNull?: any) => void {
	return useCallback(
		(actualValue: number, isNull = false) => {
			if (!values) return
			let mapping: Record<any, any> = {}
			Object.keys(values).forEach((val: any) => {
				if (actualValue === val) {
					const value = isNull ? null : ''
					mapping = { ...mapping, [val]: value }
				} else {
					mapping = { ...mapping, [val]: values[val] }
				}
			})
			onChange(mapping)
		},
		[onChange, values],
	)
}
