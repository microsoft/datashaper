/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IModalProps } from '@fluentui/react'

import type { StepEditorProps } from '../StepEditor/index.js'

export interface StepEditorModalProps extends IModalProps, StepEditorProps {
	target?: string
}
