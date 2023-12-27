export class ReturnReviewDto {
  id: string;
  blogId: string;
  author: {
    _id: string;
    name: string;
    profile: string;
  };
  title: string;
  description: string;
  recommendActivity: string;
  spendTime: string;
  rating: number;
  score: number;
  images: string[];
}
