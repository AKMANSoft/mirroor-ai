import { UserProfile } from "./response.types";

export type AudioBlock = {
    id: string;
    audio?: string | null;
    language?: string | null;
    text: string;
    markino: number;
    keywords: string;
    zshot?: Array<{ key: string; value: number }> | null;
    user?: UserProfile;
    user_id: string;
    createdAt: Date
}
