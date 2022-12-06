/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { type Value,DataType } from '@datashaper/schema'
import { useCallback } from 'react'

export function useHandleKeyChange(
	mapList: Record<Value, Value>,
	onChange?: (mapping: Record<Value, Value>) => void,
): (previousKey: Value, newKey: Value) => void {
	return useCallback(
		(previousKey, newKey) => {
			const mapping: Record<Value, Value> = {}

			for (const key in mapList) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				key === previousKey.toString()
					? (mapping[newKey] = mapList[key])
					: (mapping[key] = mapList[key]!)
			}

			onChange?.(mapping)
		},
		[mapList, onChange],
	)
}

export function useHandleValueChange(
	mapList: Record<Value, Value>,
	dataType?: DataType,
	onChange?: (mapping: Record<Value, Value>) => void,
): (key: Value, newValue: Value) => void {
	return useCallback(
		(key, newValue) => {
			const mapping: Record<Value, Value> = {}

			for (const keyElement in mapList) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				keyElement === key.toString()
					? (mapping[keyElement] =
							dataType === DataType.Date ? new Date(newValue) : newValue)
					: (mapping[keyElement] = mapList[keyElement]!)
			}

			onChange?.(mapping)
		},
		[onChange, dataType, mapList],
	)
}

export function useHandleDelete(
	mapList: Record<Value, Value>,
	onChange?: (mapping: Record<Value, Value>) => void,
): (key: Value) => void {
	return useCallback(
		key => {
			const mapping = { ...mapList }
			delete mapping[key]
			onChange?.(mapping)
		},
		[mapList, onChange],
	)
}
