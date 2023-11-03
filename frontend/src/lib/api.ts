import { PaginatedAudioBlocks } from "@/types/api";
import { ResetPasswordSchema, LoginSchema, RegisterSchema, CreateNewPasswordSchema } from "@/types/form.types";
import { ApiResCode, CreateNewPasswordResponse, LoginResponse, ProcessAudioResponse, RegisterResponse, ResetPasswordResponse, UserProfile } from "@/types/response.types";
import axios from "axios";




async function register(data: RegisterSchema): Promise<RegisterResponse> {
    try {
        const res = await axios.post<RegisterResponse>(
            "/api/auth/register",
            {
                name: data.name,
                email: data.email,
                password: data.password
            },
            {
                withCredentials: true
            }
        )
        if (res.status !== 200) throw new Error();
        return res.data
    } catch (error) {
        console.error(error)
    }
    return {
        code: ApiResCode.UNKNOWN_ERROR,
        succeed: false
    }
}

async function login(data: LoginSchema): Promise<LoginResponse> {
    try {
        const res = await axios.post<LoginResponse>(
            "/api/auth/login",
            {
                email: data.email,
                password: data.password
            },
            {
                withCredentials: true
            }
        )
        if (res.status !== 200) throw new Error();
        return res.data
    } catch (error) {
        console.error(error)
    }
    return {
        code: ApiResCode.UNKNOWN_ERROR,
        succeed: false
    }
}

async function resetPassword(data: ResetPasswordSchema): Promise<ResetPasswordResponse> {
    try {
        const res = await axios.post<ResetPasswordResponse>(
            "/api/user/password/reset",
            {
                email: data.email,
            },
            {
                withCredentials: true
            }
        )
        if (res.status !== 200) throw new Error();
        return res.data
    } catch (error) {
        console.error(error)
    }
    return {
        code: ApiResCode.UNKNOWN_ERROR,
        succeed: false
    }
}

async function createNewPassword(sessionId: string, data: CreateNewPasswordSchema): Promise<CreateNewPasswordResponse> {
    try {
        const res = await axios.post<CreateNewPasswordResponse>(
            "/api/user/password/create-new",
            {
                session_id: sessionId,
                password: data.password,
            },
            {
                withCredentials: true
            }
        )
        if (res.status !== 200) throw new Error();
        return res.data
    } catch (error) {
        console.error(error)
    }
    return {
        code: ApiResCode.UNKNOWN_ERROR,
        succeed: false
    }
}

async function getProfile(): Promise<UserProfile | null> {
    try {
        const res = await axios.get<{ data?: UserProfile | null }>(
            "/api/user/profile", { withCredentials: true }
        )
        if (res.status !== 200 || !res.data.data) throw new Error();
        return res.data.data
    } catch (error) {
        console.error(error)
    }
    return null
}


async function getUserData({ page = 1, perPage = 10, recentsOnly = false }): Promise<PaginatedAudioBlocks> {
    try {
        const res = await axios.get(
            `/api/user/data?page=${page}&perPage=${perPage}&recentsOnly=${recentsOnly}`,
            { withCredentials: true }
        )
        if (res.status !== 200 || !res.data.data) throw new Error();
        return {
            ...res.data,
            data: res.data?.data?.map((a: any) => ({
                ...a,
                zshot: (a.zshot ? JSON.parse(a.zshot) : []),
                createdAt: new Date(a.createdAt)
            }))
        }
    } catch (error) {
        console.error(error)
    }
    return { succeed: false, data: [] }
}

async function processAudio(audio: Blob): Promise<ProcessAudioResponse> {
    try {
        const data = new FormData();
        data.append("file", audio, `${Date.now()}.ogg`)
        const res = await axios.post<ProcessAudioResponse>(
            "/api/process-audio", data,
            { withCredentials: true }
        )
        if (res.status !== 200) throw new Error("Unknown error.");
        return res.data
    } catch (error) {
        console.error(error)
    }
    return {
        succeed: false
    }
}


const api = {
    register,
    login,
    getProfile,
    processAudio,
    resetPassword,
    createNewPassword,
    getUserData
}

export default api;