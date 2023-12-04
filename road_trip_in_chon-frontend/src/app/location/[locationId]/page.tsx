"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo, use } from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Rating from "../../../components/Rating";
import Bookmark from "../../../components/Bookmark";
import axios from "axios";
import AllImageModal from "../../../components/AllImageModal";
import { IBlog } from "@/types/Blog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faLocationPin,
  faUser,
  faUserGroup,
  faBinoculars,
  faPhone,
  faBan,
  faBanSmoking,
  faMartiniGlass,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import CommentBox from "../../../components/CommentBox";
import { ICommentInfo } from "@/types/Comment";

export default function LocationId({
  params: { locationId },
}: {
  params: { locationId: string };
}) {
  const router = useRouter();
  const [showImage, setShowImage] = useState<boolean>(false);
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [comment, setComment] = useState<ICommentInfo[] | null>(null);
  const [initComment, setInitComment] = useState<ICommentInfo[] | null>(null);
  const [didFetch, setDidFetch] = useState<boolean>(false);
  const [sortType, setSortType] = useState<number>(0);

  const containerStyle = {
    width: "100%",
    height: "250px",
    borderRadius: "38px",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAURPv2U0fzw17NkOYT3Mt__HvRrlQwriE",
  });

  const fetchData = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/blogs/${locationId}`
    );
    setBlog(res.data);
    const commentRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/review/get-review-by-blog-id/${locationId}`
    );
    console.log(commentRes.data);
    setComment(commentRes.data);
    setInitComment(commentRes.data);
    setDidFetch(true);
  };

  const sortComment = async () => {
    if (sortType == 0) {
      await setComment(initComment);
    } else if (sortType == 1 && comment != null) {
      const sortData = [...comment].sort((a: ICommentInfo, b: ICommentInfo) => {
        return b.rating - a.rating;
      });
      await setComment(sortData);
    } else if (sortType == 2 && comment != null) {
      const sortData = [...comment].sort((a: ICommentInfo, b: ICommentInfo) => {
        return a.rating - b.rating;
      });
      await setComment(sortData);
    } else if (sortType == 3 && comment != null) {
      const sortData = [...comment].sort((a: ICommentInfo, b: ICommentInfo) => {
        return b.score - a.score;
      });
      await setComment(sortData);
    } else if (sortType == 4 && comment != null) {
      const sortData = [...comment].sort((a: ICommentInfo, b: ICommentInfo) => {
        return a.score - b.score;
      });
      await setComment(sortData);
    }
  };

  console.log(sortType);

  useEffect(() => {
    fetchData();
  }, []);

  console.log(blog);

  useEffect(() => {
    if (showImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showImage]);

  useEffect(() => {
    sortComment();
  }, [sortType]);

  // console.log(comment);

  const handleShowImage = () => {
    setShowImage(true);
  };

  console.log(initComment);

  const calRating = useMemo(() => {
    console.log("ooedskflsdkl");
    console.log(blog?.reviews);
    return blog != null && blog.reviewLength != 0
      ? {
          rating1: `${
            (blog.separateRating.rate1 / blog.reviews.length) * 100
          }%`,
          rating2: `${
            (blog.separateRating.rate2 / blog.reviews.length) * 100
          }%`,
          rating3: `${
            (blog.separateRating.rate3 / blog.reviews.length) * 100
          }%`,
          rating4: `${
            (blog.separateRating.rate4 / blog.reviews.length) * 100
          }%`,
          rating5: `${
            (blog.separateRating.rate5 / blog.reviews.length) * 100
          }%`,
        }
      : {
          rating1: 0,
          rating2: 0,
          rating3: 0,
          rating4: 0,
          rating5: 0,
        };
  }, [blog]);

  const commentComponent = useMemo(() => {
    if (comment != null && comment.length > 0) {
      return (
        <div className="w-full max-w-screen-xl px-4">
          {comment.map((val, key) => {
            console.log(val.score);
            return <CommentBox commentInfo={val} key={key} canEdit={false} />;
          })}
        </div>
      );
    } else {
      return (
        <div className="flex w-full max-w-screen-xl justify-center items-center h-72">
          <h1>ไม่มีสถานที่ท่องเที่ยวที่บันทึกไว้....</h1>
        </div>
      );
    }
  }, [sortType, []]);

  return blog != null && didFetch ? (
    <div className="w-full min-h-screen flex flex-col items-center font-karnit">
      {blog.images?.length ? (
        <div
          className="pt-24 w-full grid grid-rows-6 lg:grid-cols-8 grid-cols-6 gap-1 h-[450px] max-w-screen-xl cursor-pointer px-4"
          onClick={() => handleShowImage()}
        >
          <div className="lg:row-span-6 lg:col-span-4  md:row-span-3  row-span-4 col-span-3 relative">
            <Image alt="img1" src={blog?.images[0]} fill sizes="100vw"></Image>
          </div>
          <div className="lg:row-span-6 lg:col-span-2  md:row-span-3  row-span-4 col-span-3 relative">
            <Image alt="img2" src={blog?.images[1]} fill sizes="100vw"></Image>
          </div>
          <div className="lg:row-span-3 lg:col-span-1  md:row-span-3  row-span-2 col-span-2 relative">
            <Image alt="img3" src={blog?.images[2]} fill sizes="100vw"></Image>
          </div>
          <div className="lg:row-span-3 lg:col-span-1  md:row-span-3  row-span-2 col-span-2 relative">
            <Image alt="img4" src={blog?.images[3]} fill sizes="100vw"></Image>
          </div>
          <div className="lg:row-span-3 lg:col-span-1  md:row-span-3  row-span-2 col-span-2 relative">
            <div className="lg:hidden absolute z-30 bg-black/[0.25] w-full h-full flex justify-center items-center text-white">
              {blog?.images.length - 5}+
            </div>
            <Image alt="img4" src={blog?.images[4]} fill sizes="100vw"></Image>
          </div>
          <div className="lg:row-span-3 lg:col-span-1 hidden lg:block relative">
            {blog?.images.length - 6 > 0 ? (
              <div className="absolute z-30 bg-black/[0.25] w-full h-full flex justify-center items-center text-white">
                {blog?.images.length - 6}+
              </div>
            ) : (
              ""
            )}
            <Image alt="img4" src={blog?.images[5]} fill sizes="100vw"></Image>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="flex w-full max-w-screen-xl">
        <div className="lg:w-[60%] w-full px-4">
          <div className="bg-[#F8F8F8] w-full p-6 flex flex-col rounded-xl my-3">
            <h1 className="text-2xl">{blog.title}</h1>
            <div className="flex items-center my-2">
              <div className="p-1 px-2 flex items-center mr-2 bg-[#FF6F6B] rounded-xl text-white">
                <h4 className="mr-1">{blog.rating.toFixed(1)}</h4>
                <FontAwesomeIcon icon={faStar} style={{ color: "#ffffff" }} />
              </div>
              {blog.reviews == null ? (
                <p>0 รีวิว</p>
              ) : (
                <p>{blog.reviews.length} รีวิว</p>
              )}
            </div>
            <h3 className="text-[#8A8A8A] my-2">{blog.category}</h3>
            <div className=" border-b-2 border-[#D9D9D9] w-full my-2"></div>
            <div className="flex my-2">
              <div
                className="p-2 flex bg-[#276968] items-center text-white rounded-xl mr-2 cursor-pointer"
                onClick={() => router.push(`/comment/${locationId}`)}
              >
                <FontAwesomeIcon
                  icon={faMessage}
                  style={{ color: "#ffffff" }}
                  className="mr-2"
                />{" "}
                เขียนรีวิว
              </div>
              <Bookmark blogID={locationId} />
            </div>
          </div>

          <div className="bg-[#F8F8F8] w-full p-6 flex flex-col rounded-xl my-3">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: parseFloat(blog.latitude),
                  lng: parseFloat(blog.longitude),
                }}
                zoom={9}
                options={{ disableDefaultUI: true }}
              >
                <MarkerF
                  position={{
                    lat: parseFloat(blog.latitude),
                    lng: parseFloat(blog.longitude),
                  }}
                  onClick={() =>
                    router.push(
                      `http://maps.google.com/maps?z=12&t=m&q=loc:${blog.latitude}+${blog.longitude}`
                    )
                  }
                />
              </GoogleMap>
            ) : (
              ""
            )}
            <div className="flex items-center my-2">
              <FontAwesomeIcon
                icon={faLocationPin}
                style={{ color: "#37454D" }}
              />{" "}
              <p className="text-[#8A8A8A] ml-1">{blog.address}</p>
            </div>
          </div>
          <div className="bg-[#F8F8F8] w-full p-6 rounded-xl my-3 flex justify-center items-center relative">
            <div className="absolute top-3 left-7">
              {blog.reviews == null ? (
                <h3 className="text-lg">0 รีวิว</h3>
              ) : (
                <h3 className="text-lg">{blog.reviews.length} รีวิว</h3>
              )}
            </div>
            <div className="flex items-center flex-wrap justify-center w-full">
              <div className="flex flex-col items-center mr-3">
                <h1 className="text-5xl">{blog.rating.toFixed(1)}</h1>
                <h3>จาก 5</h3>
              </div>
              {calRating ? (
                <div className="sm:w-[60%] w-full">
                  <div className="flex my-2">
                    <Rating
                      rating={5}
                      vote={false}
                      setVote={null}
                      size="text-xl"
                      mx="mx-1"
                    />
                    <div className="grow bg-[#D9D9D9] h-5 rounded-xl overflow-hidden">
                      <div
                        className={`bg-[#FF6F6B] z-20 h-5 rounded-xl`}
                        style={{ width: `${calRating.rating5}` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex my-2">
                    <Rating
                      rating={4}
                      vote={false}
                      setVote={null}
                      size="text-xl"
                      mx="mx-1"
                    />
                    <div className="grow bg-[#D9D9D9] h-5 rounded-xl overflow-hidden">
                      <div
                        className={`bg-[#FF6F6B] z-20 h-5 rounded-xl`}
                        style={{ width: `${calRating.rating4}` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex my-2">
                    <Rating
                      rating={3}
                      vote={false}
                      setVote={null}
                      size="text-xl"
                      mx="mx-1"
                    />
                    <div className="grow bg-[#D9D9D9] h-5 rounded-xl overflow-hidden">
                      <div
                        className={`bg-[#FF6F6B] z-20 h-5 rounded-xl`}
                        style={{ width: `${calRating.rating3}` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex my-2">
                    <Rating
                      rating={2}
                      vote={false}
                      setVote={null}
                      size="text-xl"
                      mx="mx-1"
                    />
                    <div className="grow bg-[#D9D9D9] h-5 rounded-xl overflow-hidden">
                      <div
                        className={`bg-[#FF6F6B] z-20 h-5 rounded-xl`}
                        style={{ width: `${calRating.rating2}` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex my-2">
                    <Rating
                      rating={1}
                      vote={false}
                      setVote={null}
                      size="text-xl"
                      mx="mx-1"
                    />
                    <div className="grow bg-[#D9D9D9] h-5 rounded-xl overflow-hidden">
                      <div
                        className={`bg-[#FF6F6B] z-20 h-5 rounded-xl`}
                        style={{ width: `${calRating.rating1}` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="w-[40%] hidden lg:block text-[#8A8A8A] px-4">
          <div className="p-6 bg-[#F8F8F8] rounded-xl my-3">
            <div className="mb-5">
              <div className="px-5 py-2 bg-[#276968] text-white w-fit rounded-xl">
                <h2>อัตราค่าบริการ</h2>
              </div>
              <div>
                {Object.entries(blog.entrancePrice).map(([key, value]) => {
                  return (
                    <div key={key}>
                      {key === "adult" ? (
                        <div className="my-2 flex items-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{ color: "#276968" }}
                            className="w-[32px] h-[32px] mr-1"
                          />
                          {value != null ? (
                            <p>ผู้ใหญ่ : {value}</p>
                          ) : (
                            <p>ผู้ใหญ่ : ฟรี</p>
                          )}
                        </div>
                      ) : key === "child" ? (
                        <div className="my-2 flex items-center">
                          <FontAwesomeIcon
                            icon={faUserGroup}
                            style={{ color: "#276968" }}
                            className="w-[32px] h-[32px] mr-1"
                          />
                          {value != null ? (
                            <p>เด็ก : {value}</p>
                          ) : (
                            <p>เด็ก : ฟรี</p>
                          )}
                        </div>
                      ) : key === "foreign" ? (
                        <div className="my-2 flex items-center">
                          <FontAwesomeIcon
                            icon={faBinoculars}
                            style={{ color: "#276968" }}
                            className="w-[32px] h-[32px] mr-1"
                          />
                          {value != null ? (
                            <p>ชาวต่างชาติ : {value}</p>
                          ) : (
                            <p>ชาวต่างชาติ : ฟรี</p>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {Object.values(blog.forbidden).every((v) => v === null) ? (
              <div className="my-5">
                <div className="px-5 py-2 bg-[#276968] text-white w-fit rounded-xl">
                  <h2>ช่องทางการติดต่อ</h2>
                </div>
                <div>
                  {Object.entries(blog.contact).map(([key, value]) => {
                    return (
                      <div key={key}>
                        {key === "facebook" && value != null ? (
                          <div className="my-2 flex items-center">
                            <FontAwesomeIcon
                              icon={faFacebook}
                              style={{ color: "#276968" }}
                              className="w-[32px] h-[32px] mr-1"
                            />
                            <p>Facebook : {value}</p>
                          </div>
                        ) : key === "tel" && value != null ? (
                          <div className="my-2 flex items-center">
                            <FontAwesomeIcon
                              icon={faPhone}
                              style={{ color: "#276968" }}
                              className="w-[32px] h-[32px] mr-1"
                            />
                            <p>เบอร์โทรศัพท์ : {value}</p>
                          </div>
                        ) : key === "website" && value != null ? (
                          <div className="my-2 flex items-center">
                            <FontAwesomeIcon
                              icon={faGlobe}
                              style={{ color: "#276968" }}
                              className="w-[32px] h-[32px] mr-1"
                            />
                            <p>Website : {value}</p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              ""
            )}
            {Object.values(blog.forbidden).every((v) => v === false) ? (
              ""
            ) : (
              <div className="my-5">
                <div className="px-5 py-2 bg-[#276968] text-white w-fit rounded-xl">
                  <h2>สิ่งต้องห้าม</h2>
                </div>
                <div>
                  {Object.entries(blog.forbidden).map(([key, value]) => {
                    return (
                      <div key={key}>
                        {key === "animal" && value == true ? (
                          <div className="my-2 flex items-center">
                            <FontAwesomeIcon
                              icon={faBan}
                              style={{ color: "#276968" }}
                              className="w-[32px] h-[32px] mr-1"
                            />
                            <p>ห้ามนำสัตว์เลี้ยงทุกชนิดเข้า</p>
                          </div>
                        ) : key === "smoke" && value == true ? (
                          <div className="my-2 flex items-center">
                            <FontAwesomeIcon
                              icon={faBanSmoking}
                              style={{ color: "#276968" }}
                              className="w-[32px] h-[32px] mr-1"
                            />
                            <p>ห้ามสูบบุหรี่</p>
                          </div>
                        ) : key === "alcohol" && value == true ? (
                          <div className="my-2 flex items-center">
                            <FontAwesomeIcon
                              icon={faMartiniGlass}
                              style={{ color: "#276968" }}
                              className="w-[32px] h-[32px] mr-1"
                            />
                            <p>ห้ามดื่มแอลกอฮอล์</p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* comment */}
      <div className="w-full max-w-screen-xl px-4 mb-5">
        <div className="flex w-full justify-between items-center">
          <h1>รีวิว</h1>
          <div className="dropdown dropdown-end transition-all">
            <label
              tabIndex={0}
              className="btn m-1 bg-white text-black hover:bg-[#276968] hover:text-white"
            >
              เรียงลำดับ :{" "}
              {sortType == 0
                ? "เริ่มต้น"
                : sortType == 1
                ? "เรตติ้งมาก - น้อย"
                : sortType == 2
                ? "เรตติ้งน้อย - มาก"
                : sortType == 3
                ? "มีประโยชน์มาก - น้อย"
                : sortType == 4
                ? "มีประโยชน์น้อย - มาก"
                : ""}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-white"
            >
              <li>
                <a
                  className="bg-white text-black hover:bg-[#276968] hover:text-white"
                  onClick={() => setSortType(0)}
                >
                  เริ่มต้น
                </a>
              </li>
              <li>
                <a
                  className="bg-white text-black hover:bg-[#276968] hover:text-white"
                  onClick={() => setSortType(1)}
                >
                  เรตติ้งมาก - น้อย
                </a>
              </li>
              <li>
                <a
                  className="bg-white text-black hover:bg-[#276968] hover:text-white"
                  onClick={() => setSortType(2)}
                >
                  เรตติ้งน้อย - มาก
                </a>
              </li>
              <li>
                <a
                  className="bg-white text-black hover:bg-[#276968] hover:text-white"
                  onClick={() => setSortType(3)}
                >
                  มีประโยชน์มาก - น้อย
                </a>
              </li>
              <li>
                <a
                  className="bg-white text-black hover:bg-[#276968] hover:text-white"
                  onClick={() => setSortType(4)}
                >
                  มีประโยชน์น้อย - มาก
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className=" border-b-2 border-[#D9D9D9] w-full my-2"></div>
      </div>

      {commentComponent}
      {showImage && blog.images != undefined ? (
        <AllImageModal photos={blog.images} setShow={setShowImage} />
      ) : (
        ""
      )}
    </div>
  ) : (
    <div>null</div>
  );
}
