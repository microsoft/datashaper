/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IModalProps } from '@fluentui/react'

import type { StepListItemProps } from '../StepListItem/index.js'

export interface StepEditorModalProps extends IModalProps, StepListItemProps {
	target?: string
}
