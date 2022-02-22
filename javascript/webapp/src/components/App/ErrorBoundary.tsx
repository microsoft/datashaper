import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'
import Redbox from 'redbox-react'

export const ErrorBoundary: React.FC = ({ children }) => (
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
