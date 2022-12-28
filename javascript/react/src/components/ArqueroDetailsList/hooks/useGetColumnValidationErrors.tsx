/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Constraints, FieldError } from '@datashaper/schema'
import { useMemo } from 'react'

export function useGetColumnValidationErrors(
	header: string,
	errors?: FieldError[],
): JSX.Element | undefined {
	return useMemo(() => {
		if (errors && errors.length > 0) {
			return (
				<>
					<p>{header}</p>
					<ul>
						{errors.map((e: FieldError) => (
							<li key={e.rule}>{getMessage(e)}</li>
						))}
					</ul>
				</>
			)
		}
	}, [header, errors])
}

const getMessage = (error: FieldError) => {
	const constraint = error.constraints[error.rule as keyof Constraints]
	return `${error.rule}: ${constraint}`
}
