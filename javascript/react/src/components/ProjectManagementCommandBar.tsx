/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CommandBar, MessageBar, MessageBarType } from '@fluentui/react'
import { memo, useState } from 'react'

import {
	useOnUpdateWorkflowJson,
	useProjectManagementCommands,
} from './ProjectManagementCommandBar.hooks.js'
import type { ProjectManagementCommandBarProps } from './ProjectManagementCommandBar.types.js'

export const ProjectManagementCommandBar: React.FC<ProjectManagementCommandBarProps> =
	memo(function ProjectManagementCommandBar({
		workflow,
		tables,
		outputTables,
		onUpdateWorkflow,
		onUpdateTables,
		itemProps,
		...props
	}) {
		const [error, setError] = useState('')
		const onUpdateWorkflowJson = useOnUpdateWorkflowJson(onUpdateWorkflow)
		const commands = useProjectManagementCommands(
			workflow,
			tables,
			outputTables,
			itemProps,
			onUpdateWorkflowJson,
			onUpdateTables,
			setError,
		)

		return (
			<>
				{error ? (
					<MessageBar
						messageBarType={MessageBarType.error}
						isMultiline={false}
						onDismiss={() => setError('')}
						dismissButtonAriaLabel="Close"
					>
						{error}
					</MessageBar>
				) : null}

				<CommandBar items={commands} {...props} />
			</>
		)
	})
