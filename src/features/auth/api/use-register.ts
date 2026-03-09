import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { registerUser } from "@/shared/api/auth"
import type { RegisterRequest, RegisterResponse } from "@/shared/api/auth/types"

export function useRegister() {
    const router = useRouter()

    return useMutation<RegisterResponse, Error, RegisterRequest>({
        mutationFn: registerUser,
        onSuccess: () => {
            router.push("/v1/products")
        },
    })
}
