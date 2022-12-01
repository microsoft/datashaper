import type { ProfilePlugin } from '@datashaper/app-framework'
import { Resource } from '@datashaper/workflow'

export class TestAppProfile implements ProfilePlugin<TestAppResource> {

}

class TestAppResource extends Resource {

}
