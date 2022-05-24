import './Button.css'

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<{
	/**
	 * Button contents
	 */
	label: string
	/**
	 * Is this the principal call to action on the page?
	 */
	primary?: boolean
	/**
	 * What background color to use
	 */
	backgroundColor?: string
	/**
	 * How large should the button be?
	 */
	size?: 'small' | 'medium' | 'large'
	/**
	 * Optional click handler
	 */
	onClick?: () => void
}> = ({ primary, backgroundColor, size, label, ...props }) => {
	const mode = primary
		? 'storybook-button--primary'
		: 'storybook-button--secondary'
	return (
		<button
			type="button"
			className={['storybook-button', `storybook-button--${size}`, mode].join(
				' ',
			)}
			style={backgroundColor && { backgroundColor }}
			{...props}
		>
			{label}
		</button>
	)
}
