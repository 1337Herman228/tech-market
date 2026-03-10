import type { User } from "@/shared/api/payload/payload-types"

// ─── Login ───────────────────────────────────────────────────────────────────

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    exp: number
    user: User
    message?: string
}

// ─── Register ────────────────────────────────────────────────────────────────

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface RegisterResponse {
    doc: User
    message?: string
}
