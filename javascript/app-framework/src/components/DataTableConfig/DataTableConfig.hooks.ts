/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat, DataOrientation } from '@datashaper/schema'
import type { DataTable } from '@datashaper/workflow'
import type { IChoiceGroupOption } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { useCallback } from 'react'

export function useChangeHandlers(resource: DataTable): {
	format: DataFormat
	onChangeFormat: (
		evt?: React.FormEvent<HTMLElement | HTMLInputElement>,
		option?: IChoiceGroupOption,
	) => void
} {
	const format = useObservableState(resource.format$, resource.format)
	const onChangeFormat = useCallback(
		(
			_e?: React.FormEvent<HTMLElement | HTMLInputElement>,
			option?: IChoiceGroupOption,
		) => {
			resource.format = option?.key as DataFormat
			if (option?.key === DataFormat.CSV) {
				resource.shape.orientation = DataOrientation.Values
			} else if (option?.key === DataFormat.JSON) {
				resource.shape.orientation = DataOrientation.Records
			}
		},
		[resource],
	)

	return {
		format,
		onChangeFormat,
	}
}
