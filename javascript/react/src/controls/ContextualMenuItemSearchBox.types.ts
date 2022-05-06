import type { IContextualMenuItem } from '@fluentui/react'

export interface ContextualMenuItemSearchBoxProps {
	items: IContextualMenuItem[]
	onSearch: (results: IContextualMenuItem[]) => void
}
