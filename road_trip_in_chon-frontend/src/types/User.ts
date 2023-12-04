export interface IUser{
    _id: string;
    email: string;
    profile: string;
    name: string;
    bookmark: string[];
    likedReview:string[];
    postedBlogs: string[];
    createdAt: string;
    updatedAt: string;
    bio:string;
    __v: number;
    accountType:string
}