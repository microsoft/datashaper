import { KnownProfile } from '@datashaper/schema'
import { Codebook } from '@datashaper/workflow'
import { CodebookEditor, ResourceGroup, ProfilePlugin } from '../../index.js'

export class CodebookPlugin implements ProfilePlugin<Codebook> {
	public readonly profile = KnownProfile.Codebook
	public readonly title = 'Codebook'
	public readonly renderer = CodebookEditor
	public readonly iconName = 'FormLibraryMirrored'
	public readonly group = ResourceGroup.Data

	public createResource(): Codebook {
		return new Codebook()
	}
}
