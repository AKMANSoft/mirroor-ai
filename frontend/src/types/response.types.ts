
type ApiResponse<T = unknown> = {
    succeed?: boolean;
    code?: string;
    data?: T;
}

export type LoginResponse = ApiResponse<{
    name: string;
    email: string;
}>

export type ResetPasswordResponse = ApiResponse<unknown>
export type CreateNewPasswordResponse = ApiResponse<unknown>

export type RegisterResponse = ApiResponse<{
    name: string;
    email: string;
}>
export type SendVerificationResponse = ApiResponse<null>


export type ProcessAudioResponse = ApiResponse<{
    filename: string;
    keywords: string[];
    language: string;
    markino: number;
    transcription: string;
    zshot: Array<{
        key: string;
        value: number;
    }>
}>



export const ApiResCode = {
    "UNKNOWN_ERROR": "UNKNOWN_ERROR",
    "USER_REGISTERED": "USER_REGISTERED",
    "USER_LOGGED_IN": "USER_LOGGED_IN",
    "USER_NOT_FOUND": "USER_NOT_FOUND",
    "WRONG_PASSWORD": "WRONG_PASSWORD",
    "DUPLICATE_EMAIL": "DUPLICATE_EMAIL",
    "SESSION_EXPIRED": "SESSION_EXPIRED",
}



export type UserProfile = {
    id: string;
    name: string;
    email: string;
    email_verified: boolean;
    role: "admin" | "user"
}