import type {  Workflow } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'

/**
 * Selects an input name for new steps - e.g., empty if this is the first step, or the previous step id if it is not.
 * @param workflow 
 * @returns 
 */
export function useNewStepInputName(workflow: Workflow) {
    const outputNames = useObservableState(workflow.outputNames$, workflow.outputNames)
    return useMemo(() => {
        const input = outputNames[outputNames.length - 1]
        return input
    }, [outputNames])
    
}