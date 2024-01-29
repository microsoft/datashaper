import type { Resource } from '@datashaper/workflow'

export interface ToolboxRendererProps {
    /**
     * List of all the resources in the current data package.
     * Many tools will allow the user to select one or more resources for operations.
     */
    resources: Resource[]
    /**
     * Tools will often create new resources as part of their operation.
     * This ensures it is added to the data package.
     * @param resource 
     * @returns 
     */
    onResourceCreated: (resource: Resource) => void
}