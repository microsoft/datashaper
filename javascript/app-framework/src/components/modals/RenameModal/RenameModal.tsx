import {
	DefaultButton,
	PrimaryButton,
	FontWeights,
	getTheme,
	IButtonStyles,
	IconButton,
	IIconProps,
	mergeStyleSets,
	Modal,
	TextField,
} from '@fluentui/react'
import { memo, useCallback, useState } from 'react'
import type { RenameModalProps } from './RenameModal.types.js'

export const RenameModal: React.FC<RenameModalProps> = memo(
	function RenameModal({ isOpen, resource, onAccept, onDismiss }) {
		const [result, setResult] = useState(resource?.title)
		const onOkClick = useCallback(() => onAccept(result), [result])
		const onTextFieldChange = useCallback(
			(_ev: unknown, v: string | undefined) => setResult(v),
			[setResult],
		)
		return (
			<Modal
				titleAriaId={'rename-modal'}
				isOpen={isOpen}
				onDismiss={onDismiss}
				isBlocking={false}
				containerClassName={contentStyles.container}
			>
				<div className={contentStyles.header}>
					<span id={'title'}>Rename Resource</span>
					<IconButton
						styles={iconButtonStyles}
						iconProps={cancelIcon}
						ariaLabel="Close popup modal"
						onClick={onDismiss}
					/>
				</div>
				<div className={contentStyles.body}>
					<TextField
						label="Rename resource"
						defaultValue={resource?.name}
						onChange={onTextFieldChange}
					/>
					<div style={buttonRowStyle}>
						<PrimaryButton
							text="OK"
							style={okButtonStyle}
							onClick={onOkClick}
						/>
						<DefaultButton text="Cancel" onClick={onDismiss} />
					</div>
				</div>
			</Modal>
		)
	},
)

const theme = getTheme()
const iconButtonStyles: Partial<IButtonStyles> = {
	root: {
		color: theme.palette.neutralPrimary,
		marginLeft: 'auto',
		marginTop: '4px',
		marginRight: '2px',
	},
	rootHovered: {
		color: theme.palette.neutralDark,
	},
}
const buttonRowStyle: React.CSSProperties = {
	marginTop: 5,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-end',
}
const okButtonStyle = { marginRight: 5 }
const cancelIcon: IIconProps = { iconName: 'Cancel' }
const contentStyles = mergeStyleSets({
	container: {
		display: 'flex',
		flexFlow: 'column nowrap',
		alignItems: 'stretch',
	},
	header: [
		theme.fonts.xLargePlus,
		{
			flex: '1 1 auto',
			borderTop: `4px solid ${theme.palette.themePrimary}`,
			color: theme.palette.neutralPrimary,
			display: 'flex',
			alignItems: 'center',
			fontWeight: FontWeights.semibold,
			padding: '12px 12px 14px 24px',
		},
	],
	body: {
		flex: '4 4 auto',
		padding: '0 24px 24px 24px',
		overflowY: 'hidden',
		selectors: {
			p: { margin: '14px 0' },
			'p:first-child': { marginTop: 0 },
			'p:last-child': { marginBottom: 0 },
		},
	},
})
