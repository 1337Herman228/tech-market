import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { registerUser } from "@/shared/api/auth"
import type { RegisterRequest, RegisterResponse } from "@/shared/api/auth/types"

export function useRegister() {
    const router = useRouter()

    return useMutation<RegisterResponse, Error, RegisterRequest>({
        mutationFn: registerUser,
        onSuccess: () => {
            router.push("/v1/products")
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to create account. Please try again."
            toast.error(message)
        },
    })
}
