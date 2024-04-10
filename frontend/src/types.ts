export type User = {
    id: number;
    nickname: string;
    createdAt: Date;
    email: string;
    elo: number;
    loginNb: number;
    twoFactorAuthentication: boolean;
    achievements: string[];
    updateAvatar: undefined | boolean;
};
