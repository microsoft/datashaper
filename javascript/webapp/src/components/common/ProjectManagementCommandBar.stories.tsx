/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useManagementBarDefaults } from '../../hooks/useManagementBarDefaults.js'
import { ProjectManagementCommandBar as ProjectManagementCommandBarComponent } from './ProjectManagementCommandBar.js'
import type { ProjectManagementCommandBarProps } from './ProjectManagementCommandBar.types.js'

const storyMetadata = {
	title: 'Components/ProjectManagementCommandBar',
	component: ProjectManagementCommandBarComponent,
}
export default storyMetadata

export const Primary: React.FC<ProjectManagementCommandBarProps> = (args) => (
	<ProjectManagementCommandBarComponent {...args} />
)

export const InvertedDefaults: React.FC<ProjectManagementCommandBarProps> = (
	args,
) => {
	const props = useManagementBarDefaults(args)
	return <ProjectManagementCommandBarComponent {...props} />
}

export const InvertedCustom: React.FC<ProjectManagementCommandBarProps> = (
	args,
) => {
	const colors = {
		background: 'coral',
		border: 'orange',
		color: 'darkslateblue',
	}
	const props = useManagementBarDefaults(args, colors)
	return <ProjectManagementCommandBarComponent {...props} />
}
