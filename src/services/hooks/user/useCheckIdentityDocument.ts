import { WEB_API_PATH_CHECK_IDENTITY_DOCUMENT } from "@/constants/routes"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { postRequest } from "@/services/api"
import useUserStore from "@/stores/userStore"

function useCheckIdentityDocument() {
  const { setDocumentAvailable } = useUserStore()

  return useCustomMutation<string, { IDENTITY_DOCUMENT: string }>({
    initialData: "",
    mutationKey: ["users", "check-identity-document"],
    onSuccess: () => setDocumentAvailable(true),
    onError: () => setDocumentAvailable(false),
    mutationFn: async (payload) => {
      const {
        data: { message },
      } = await postRequest<string>(
        WEB_API_PATH_CHECK_IDENTITY_DOCUMENT,
        payload
      )

      return message
    },
  })
}

export default useCheckIdentityDocument
