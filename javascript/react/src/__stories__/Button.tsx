/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import './Button.css'

export interface ButtonProps {
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
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
	primary,
	backgroundColor,
	size,
	label,
	...props
}) => {
	const mode = primary
		? 'storybook-button--primary'
		: 'storybook-button--secondary'
	return (
		<button
			type="button"
			className={['storybook-button', `storybook-button--${size}`, mode].join(
				' ',
			)}
			style={backgroundColor ? { backgroundColor } : undefined}
			{...props}
		>
			{label}
		</button>
	)
}
