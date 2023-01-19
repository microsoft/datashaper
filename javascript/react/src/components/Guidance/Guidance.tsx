/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import Markdown from 'markdown-to-jsx'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
	useGoBack,
	useGoHome,
	useGuidance,
	useHandleClick,
} from './Guidance.hooks.js'
import { ButtonWrapper, Container, Icon, icons } from './Guidance.styles.js'
import type { GuidanceProps } from './Guidance.types.js'

/**
 * A component for rendering guidance information on verb usage.
 */
export const Guidance: React.FC<GuidanceProps> = memo(function Guidance({
	name = '',
	index,
}) {
	const markdownContainer = useRef<HTMLDivElement>(null)
	const guidance = useGuidance(index)
	const [_name, setName] = useState<string[]>([name])

	if (name !== _name[0]) {
		setName([name])
	}

	const handleClick = useHandleClick(setName)
	const goHome = useGoHome(name, setName)
	const goBack = useGoBack(setName)

	const preProcess = useCallback((text: string): string => {
		const r = /(?<=##.*?\n)([\s\S]*)/g
		const content = text.replace(r, `<div className="details">$1</div>`)
		return content
	}, [])

	const md = useMemo((): string => {
		const text = guidance(_name[_name.length - 1] || '')
		return preProcess(text)
	}, [_name, guidance, preProcess])

	useEffect(() => {
		if (markdownContainer?.current) {
			const links = markdownContainer.current.querySelectorAll('a')
			links.forEach((link) => {
				link.addEventListener('click', (e) => {
					e.preventDefault()
					handleClick((e.target as HTMLAnchorElement).href)
				})
			})
		}
	}, [handleClick, _name, markdownContainer])

	const handleHeaderClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			const target: HTMLHeadingElement =
				(event.target as Element).nodeName === 'H2'
					? event.target
					: ((event.target as Element).closest('h2') as any)
			if (target.classList.contains('active')) {
				target.classList.remove('active')
			} else {
				target.classList.add('active')
			}
		},
		[],
	)

	const H2Component = useCallback(
		({ children, ...props }: any): JSX.Element => {
			return (
				<h2 {...props}>
					{children}
					<IconButton
						onClick={handleHeaderClick}
						aria-label="Emoji"
						iconProps={addToIconProps}
					/>
				</h2>
			)
		},
		[handleHeaderClick],
	)

	const options = {
		overrides: {
			h2: {
				component: H2Component,
			},
		},
	}

	return (
		<Container ref={markdownContainer}>
			<ButtonWrapper>
				{_name.length > 2 ? (
					<Icon onClick={goBack} iconProps={icons.back} aria-label="Back" />
				) : null}
				{_name.length > 1 ? (
					<Icon onClick={goHome} iconProps={icons.home} aria-label="Home" />
				) : null}
			</ButtonWrapper>
			<Markdown options={options}>{md}</Markdown>
		</Container>
	)
})

const addToIconProps = { iconName: 'AddTo' }
