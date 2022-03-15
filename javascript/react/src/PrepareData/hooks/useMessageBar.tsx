/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MessageBar, MessageBarType } from '@fluentui/react'
import { useMemo } from 'react'

export function useMessageBar(
	message: string | undefined,
	setMessage: (message?: string) => void,
): JSX.Element | null {
	return useMemo(() => {
		if (!message) {
			return null
		}
		return (
			<MessageBar
				messageBarType={MessageBarType.severeWarning}
				truncated={true}
				onDismiss={() => setMessage(undefined)}
				dismissButtonAriaLabel="Close"
				styles={{ root: { zIndex: 20 } }}
			>
				{' '}
				{message}{' '}
			</MessageBar>
		)
	}, [message, setMessage])
}
