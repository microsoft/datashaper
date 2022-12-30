/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	DataShape,
	DataTableSchema,
	ParserOptions,
} from '@datashaper/schema'
import { DataFormat, DataOrientation } from '@datashaper/schema'
import type { IChoiceGroupOption } from '@fluentui/react'
import { useCallback } from 'react'

export function useChangeHandlers(
	schema: Partial<DataTableSchema>,
	onChange?: (update: Partial<DataTableSchema>) => void,
): {
	onChangeFileType: any
	onChangeParser: any
	onChangeShape: any
} {
	const onChangeFileType = useCallback(
		(
			_?: React.FormEvent<HTMLElement | HTMLInputElement>,
			option?: IChoiceGroupOption,
		) => {
			const update = {
				...schema,
				format: option?.key as DataFormat,
			}
			if (option?.key === DataFormat.CSV) {
				update.shape = { orientation: DataOrientation.Values }
			} else if (option?.key === DataFormat.JSON) {
				update.shape = { orientation: DataOrientation.Records }
			}
			onChange?.(update)
		},
		[schema, onChange],
	)

	const onChangeParser = useCallback(
		(parser: ParserOptions) => {
			onChange?.({
				...schema,
				parser,
			})
		},
		[schema, onChange],
	)

	const onChangeShape = useCallback(
		(shape: DataShape) => {
			onChange?.({
				...schema,
				shape,
			})
		},
		[schema, onChange],
	)

	return {
		onChangeFileType,
		onChangeParser,
		onChangeShape,
	}
}
