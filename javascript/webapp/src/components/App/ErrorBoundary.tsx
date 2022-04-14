/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'
import Redbox from 'redbox-react'

export const ErrorBoundary: React.FC<
	React.PropsWithChildren<{
		/* nothing */
	}>
> = ({ children }) => (
	<ErrorBoundaryLib
		FallbackComponent={ErrorFallback}
		onReset={() => {
			// reset the state of your app so the error doesn't happen again
		}}
	>
		{children}
	</ErrorBoundaryLib>
)

function ErrorFallback({
	error,
}: {
	error: Error
	resetErrorBoundary: () => void
}) {
	return <Redbox error={error} />
}
