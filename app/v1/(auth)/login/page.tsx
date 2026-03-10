import { LoginForm } from "@/features/auth"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4">
            {/* Decorative blobs */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    )
}
