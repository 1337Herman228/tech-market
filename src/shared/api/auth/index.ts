import { apiInstance } from "@/shared/api/axios"
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "./types"

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiInstance.post<LoginResponse>(
        "/api/users/login",
        data,
    )
    return response.data
}

export const registerUser = async (
    data: RegisterRequest,
): Promise<RegisterResponse> => {
    const response = await apiInstance.post<RegisterResponse>("/api/users", data)
    return response.data
}

export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse }
