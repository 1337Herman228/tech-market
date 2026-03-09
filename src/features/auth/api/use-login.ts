import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loginUser } from "@/shared/api/auth"
import type { LoginRequest, LoginResponse } from "@/shared/api/auth/types"

export function useLogin() {
    const router = useRouter()

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginUser,
        onSuccess: () => {
            router.push("/v1/products")
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to sign in. Please try again."
            toast.error(message)
        },
    })
}
