import useMenuOptionStore from "@/stores/useMenuOptionStore"

/**
 * @description This hook is used to check if the user is authorized to perform an action
 * @param {number} operationId - The id of the operation to be performed
 * @returns {boolean} - Returns true if the user is authorized to perform the action
 */
export default function useIsAuthorized(operationId: number): boolean {
  const { selectedMenuOption } = useMenuOptionStore()
  const { operations } = selectedMenuOption ?? { operations: [] }

  return operations?.includes(operationId)
}
