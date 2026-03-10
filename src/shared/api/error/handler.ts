import { toast } from "sonner"
import { ErrorResult } from "payload"
import { isAxiosError } from "axios"

export function handleApiError(error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
        const payloadError = error.response.data as ErrorResult

        if (payloadError.errors && payloadError.errors.length > 0) {
            const firstError = payloadError.errors[0]

            if (firstError.name === "ValidationError" && "data" in firstError) {
                const errorData = firstError.data as { errors?: Array<{ message: string; path: string }> }
                if (errorData?.errors && errorData.errors.length > 0) {
                    toast.error(errorData.errors[0].message, {
                        position: 'top-right'
                    })
                    return
                }
            }

            toast.error(firstError.message, {
                position: 'top-right'
            })
            return
        }
    }

    if (error instanceof Error) {
        toast.error(error.message, {
            position: 'top-right'
        })
        return
    }

    toast.error("An unexpected error occurred. Please try again.", {
        position: 'top-right'
    })
}
