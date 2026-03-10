import Link from "next/link"
import { RegisterForm } from "@/features/auth"

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/30 to-background px-4 py-12">
            {/* Decorative blobs */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <RegisterForm />

                {/* Terms */}
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Link href="/v1/terms" className="underline underline-offset-4 hover:text-foreground">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/v1/privacy" className="underline underline-offset-4 hover:text-foreground">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
