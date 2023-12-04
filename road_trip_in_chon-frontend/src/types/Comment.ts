export interface IComment {
  authorId: string;
  blogId: string;
  createdAt: string;
  description: string;
  images: string[];
  rating: number;
  recommendActivity: string;
  refToId: string;
  score: number;
  spendTime: string;
  title: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface ICommentInfo {
  blogId: string;
  title: string;
  author: {
    name: string;
    profile: string;
    _id: string;
  };
  description: string;
  recommendActivity: string;
  spendTime: string;
  rating: number;
  score: number; //vote-up, vote-down
  images: string[];
  id: string;
}
