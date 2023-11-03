import { AudioBlock } from "./audio-block";



export type ApiResponse<TData = unknown> = {
    succeed: boolean;
    data?: TData | null;
}



export type ApiPagination = {
    page: number;
    perPage: number;
    count: number;
    totalPages: number
}

export type PaginatedAudioBlocks = ApiResponse<AudioBlock[]> & {
    pagination?: ApiPagination
}