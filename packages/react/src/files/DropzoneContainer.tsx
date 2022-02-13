/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, Spinner } from '@fluentui/react'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { Dropzone, DropzoneProps } from '@data-wrangling-components/react'

export const DropzoneContainer: FC<{
	loading: boolean
	dropzoneProps: DropzoneProps
}> = memo(function DropzoneContainer({ dropzoneProps, loading }) {
	const {
		onDrop,
		onDropAccepted,
		onDropRejected,
		acceptedFileTypes,
		filesCount,
		placeholder = 'Drop files here',
		disabled,
		dropzoneOptions,
	} = dropzoneProps

	return (
		<Drop>
			<Dropzone
				onDrop={onDrop}
				onDropAccepted={onDropAccepted}
				onDropRejected={onDropRejected}
				acceptedFileTypes={acceptedFileTypes ?? []}
				styles={styles}
				disabled={disabled}
				dropzoneOptions={dropzoneOptions}
			>
				{loading ? (
					<>
						<Spinner />
						{filesCount?.total && (
							<Text>
								Loading ({filesCount?.completed ?? 0}/{filesCount?.total})
							</Text>
						)}
					</>
				) : (
					<Text>
						<FluentIcon iconName="Upload" />
						{placeholder}
					</Text>
				)}
			</Dropzone>
		</Drop>
	)
})

const Drop = styled.div`
	display: inline-table;
	height: 50px;
	margin: 15px 0px 15px 0px;
`

const Text = styled.span`
	margin-left: 4px;
	font-size: 13px;
`
const FluentIcon = styled(Icon)`
	color: ${({ theme }) => theme.application().accent().hex()};
`

const styles = {
	container: {
		margin: '0',
	},
}
