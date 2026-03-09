import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { loginUser } from "@/shared/api/auth"
import type { LoginRequest, LoginResponse } from "@/shared/api/auth/types"

export function useLogin() {
    const router = useRouter()

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginUser,
        onSuccess: () => {
            router.push("/v1/products")
        },
    })
}
