/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Icon } from '@fluentui/react'
import { mergeStyles, registerIcons } from '@fluentui/react/lib/Styling'

interface CustomIconProps {
	width?: string
	height?: string
	color?: string
}

registerIcons({
	icons: {
		History: (
			<svg
				width="25"
				height="25"
				viewBox="0 0 25 25"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					className="history-icon-path"
					d="M22.7108 12.9689C22.711 11.0231 22.1435 9.11939 21.0779 7.49126C20.0122 5.86312 18.4947 4.58127 16.7113 3.80281C14.9279 3.02436 12.9562 2.78312 11.0378 3.10867C9.11931 3.43421 7.33752 4.31241 5.91079 5.6356H7.71078C7.976 5.6356 8.23035 5.74096 8.41789 5.92849C8.60542 6.11603 8.71078 6.37038 8.71078 6.6356C8.71078 6.90082 8.60542 7.15517 8.41789 7.34271C8.23035 7.53024 7.976 7.6356 7.71078 7.6356H3.71079C3.44557 7.6356 3.19122 7.53024 3.00368 7.34271C2.81615 7.15517 2.71079 6.90082 2.71079 6.6356V2.6356C2.71079 2.37038 2.81615 2.11603 3.00368 1.92849C3.19122 1.74096 3.44557 1.6356 3.71079 1.6356C3.97601 1.6356 4.23036 1.74096 4.41789 1.92849C4.60543 2.11603 4.71079 2.37038 4.71079 2.6356V4.02493C6.81802 2.14082 9.52272 1.06107 12.3482 0.976019C15.1736 0.890963 17.9383 1.80606 20.1551 3.56C22.3718 5.31395 23.8983 7.79414 24.4653 10.5634C25.0323 13.3327 24.6036 16.2132 23.2546 18.6973C21.9056 21.1813 19.723 23.1094 17.0916 24.1417C14.4601 25.1741 11.5487 25.2443 8.87052 24.34C6.19234 23.4358 3.91935 21.6151 2.45219 19.199C0.985042 16.7828 0.41792 13.9263 0.850795 11.1329C0.890943 10.8974 1.01418 10.6841 1.19814 10.5317C1.3821 10.3793 1.61461 10.2979 1.85346 10.3023C2.46679 10.3023 2.90812 10.8863 2.81879 11.4916C2.61731 12.8514 2.69835 14.2381 3.05685 15.5652C3.41534 16.8923 4.0436 18.1312 4.90237 19.2046C5.76115 20.2779 6.832 21.1627 8.04807 21.8037C9.26413 22.4446 10.5993 22.828 11.9701 22.9298C13.341 23.0316 14.7181 22.8497 16.0155 22.3954C17.3129 21.9411 18.5028 21.2242 19.5107 20.2895C20.5186 19.3547 21.323 18.2222 21.8736 16.9627C22.4242 15.7031 22.7092 14.3436 22.7108 12.9689ZM13.3774 7.30227C13.3774 7.03705 13.2721 6.7827 13.0845 6.59516C12.897 6.40762 12.6427 6.30227 12.3774 6.30227C12.1122 6.30227 11.8579 6.40762 11.6703 6.59516C11.4828 6.7827 11.3774 7.03705 11.3774 7.30227V13.3023C11.3774 13.8543 11.8254 14.3023 12.3774 14.3023H15.7108C15.976 14.3023 16.2303 14.1969 16.4179 14.0094C16.6054 13.8218 16.7108 13.5675 16.7108 13.3023C16.7108 13.037 16.6054 12.7827 16.4179 12.5952C16.2303 12.4076 15.976 12.3023 15.7108 12.3023H13.3774V7.30227Z"
					fill="black"
				/>
			</svg>
		),
	},
})

const defaultIconClass = mergeStyles({
	height: 25,
	width: 25,
})

export const HistoryIcon = (props: CustomIconProps): JSX.Element => {
	const { width, height, color } = props
	return (
		<Icon
			iconName="History"
			className={mergeStyles(defaultIconClass, {
				width,
				height,
				selectors: { '.history-icon-path': { fill: color } },
			})}
		/>
	)
}
