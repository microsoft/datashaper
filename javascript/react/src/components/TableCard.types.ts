export interface TableCardProps {
	index: number
	tableName: string
	isSelected: (name: string) => boolean
	onSelect?: (name: string) => void
}
