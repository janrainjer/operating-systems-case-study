export interface IBlog {
  _id: string;
  title: string;
  category: string;
  entrancePrice: object;
  address: string;
  rating: number;
  separateRating: {
    rate1: number;
    rate2: number;
    rate3: number;
    rate4: number;
    rate5: number;
  };
  reviewLength : number;
  reviews: Array<object>; //change to IComment after
  latitude: string;
  longitude: string;
  forbidden: object;
  contact: object;
  images?: string[];
}

export interface IAllBlog {
  address: string;
  category: string;
  firstImage: string;
  openTime: any;
  rating: number;
  reviewLength: number;
  title: string;
  _id: string;
}

export const convertCategory = {
  BEACH: "ชายหาดและทะเล",
  SHOP: "ช็อปปิ้ง",
  HISTORY: "ประวัติศาสตร์ วัฒนธรรม และศาสนา",
  ENTERTAIN: "สวนสัตว์ สวนน้ำ และสวนสนุก",
  MEUSEUM: "พิพิธภัณฑ์ และแหล่งเรียนรู้ทางธรรมชาติ",
};
