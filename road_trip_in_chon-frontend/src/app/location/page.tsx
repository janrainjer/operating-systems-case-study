"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IBlog } from "@/types/Blog";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LocationBox from "@/components/LocationBox";
import axios from "axios";
import Link from "next/link";

type ICetagories = {
  breach: boolean;
  shopping: boolean;
  history: boolean;
  park: boolean;
  museum: boolean;
};

type IAnother = {
  animal: boolean;
  alcohal: boolean;
  smoke: boolean;
};

export default function Location() {
  const [fetchBlogs, setFetchBlogs] = useState<IBlog[] | null>(null);
  const [tempBlogs, setTempBlogs] = useState<IBlog[] | null>(null);
  const [filterBlogs, setFilterBlogs] = useState<IBlog[] | null>(null);
  const [search, setSearch] = useState<string>("");
  const [cetagories, setCetagories] = useState<ICetagories>({
    breach: false,
    shopping: false,
    history: false,
    park: false,
    museum: false,
  });
  // const [openTime, setOpenTime] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  // const [another, setAnother] = useState<IAnother>({
  //   animal: false,
  //   alcohal: false,
  //   smoke: false,
  // });
  const [showFilter,setShowFilter] = useState<boolean>(false)

  const fetchData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/blogs`);
    setFetchBlogs(res.data);
    setTempBlogs(res.data);
    setFilterBlogs(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchData = async () => {
    if (search != "" || search != undefined) {
      const filter = filterBlogs?.filter((blog) =>
        blog.title.toLocaleLowerCase().includes(search)
      );
      if (filter != undefined) {
        setFetchBlogs(filter);
      }
    }
  };

  useEffect(() => {
    searchData();
    console.log(search);
  }, [search]);

  const filterByCatagory = async () => {
    if (tempBlogs != null) {
      const filteredObjects = tempBlogs.filter((obj) => {
        return (
          (cetagories.breach && obj.category === "ชายหาดและทะเล") ||
          (cetagories.history &&
            obj.category === "ประวัติศาสตร์ วัฒนธรรม และศาสนา") ||
          (cetagories.museum &&
            obj.category === "พิพิธภัณฑ์ และแหล่งเรียนรู้ทางธรรมชาติ") ||
          (cetagories.park && obj.category === "สวนสัตว์ สวนน้ำ และสวนสนุก") ||
          (cetagories.shopping && obj.category === "ช็อปปิ้ง")
        );
      });
      return filteredObjects;
    }
  };

  const filterByRating = async (filterBlog: IBlog[]) => {
    if (rating != 0) {
      return filterBlog.filter((obj) => obj.rating > rating);
    } else {
      return filterBlog;
    }
  };

  const multiFilter = async (e: any) => {
    let temp: IBlog[] | null | undefined = tempBlogs;
    const isSomeCatagoryTrue = Object.values(cetagories).some(
      (value) => value === true
    );
    if (isSomeCatagoryTrue) {
      temp = await filterByCatagory();
    }
    if (rating != 0) {
      if (temp != undefined) {
        temp = await filterByRating(temp);
      }
    }
    if (temp != undefined) {
      setFilterBlogs(temp);
      setFetchBlogs(temp);
    }
    setShowFilter(false)
  };

  const resetFilter = () => {
    setCetagories({
      breach: false,
      shopping: false,
      history: false,
      park: false,
      museum: false,
    });
    setRating(0);
    setFetchBlogs(tempBlogs);
    setFilterBlogs(tempBlogs);
    setShowFilter(false)
  };

  return (
    <main className="min-h-screen pt-24 relative max-w-screen-2xl mx-auto font-karnit px-4">
      <div className=" flex justify-between items-center">
        <div className="text-xl mb-5">
          <h1>สถานที่ท่องเที่ยวทั้งหมด</h1>
        </div>
        <div
          onClick={()=>setShowFilter(true)}
          className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg cursor-pointer px-10 w-fit lg:hidden"
        >
          <h1>Filter</h1>
        </div>
      </div>
      <div className="flex w-full">
        <div className="min-w-[300px] lg:flex flex-col p-4 shadow-md rounded-lg h-fit hidden">
          {/* search   */}
          <div className="flex flex-col">
            <h1>Search</h1>
            <input
              type="text"
              className="border-2 rounded-lg indent-3 my-2 p-2"
              placeholder="Destination"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div className="border-b-2 my-3"></div>
          </div>
          {/* Cat */}
          <div className="flex flex-col">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Cetagories</h1>
            </div>
            <div className="my-2 text-[#302D27]">
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.breach}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({ ...cetagories, breach: !cetagories.breach })
                  }
                />
                <p>ชายหาดและทะเล</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.shopping}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({
                      ...cetagories,
                      shopping: !cetagories.shopping,
                    })
                  }
                />
                <p>ช็อปปิ้ง</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.history}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({
                      ...cetagories,
                      history: !cetagories.history,
                    })
                  }
                />
                <p>ประวัติศาสตร์ วัฒนธรรมและศาสนา</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.park}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({ ...cetagories, park: !cetagories.park })
                  }
                />
                <p>สวนสัตว์ สวนน้ำ และสวนสนุก</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.museum}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({ ...cetagories, museum: !cetagories.museum })
                  }
                />
                <p>พิพิธภัณฑ์และการเรียนรู้ ธรรมชาติ</p>
              </div>
            </div>
            <div className="border-b-2 my-3"></div>
          </div>
          {/* time */}
          {/* <div className="flex flex-col">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Time</h1>
            </div>
            <div className="my-2 text-[#302D27]">
              <div className="flex">
                <label>
                  <input
                    type="radio"
                    value={1}
                    name="radioGroup"
                    checked={openTime === 1}
                    onChange={(e) => setOpenTime(1)}
                    className="mr-2"
                  />
                  เปิดทุกวัน
                </label>
              </div>
              <div className="flex">
                <label>
                  <input
                    type="radio"
                    value={2}
                    name="radioGroup"
                    checked={openTime === 2}
                    onChange={(e) => setOpenTime(2)}
                    className="mr-2"
                  />
                  มีเวลาบางวัน
                </label>
              </div>
            </div>
            <div className="border-b-2 my-3"></div>
          </div> */}
          {/* Rating */}
          <div className="flex flex-col">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Rating</h1>
            </div>
            <div className="flex my-2 text-[#302D27]">
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 1 ? "#276968" : "white",
                  color: rating == 1 ? "white" : "#276968",
                }}
                onClick={() => setRating(1)}
              >
                <h1>1+</h1>
              </div>
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 2 ? "#276968" : "white",
                  color: rating == 2 ? "white" : "#276968",
                }}
                onClick={() => setRating(2)}
              >
                <h1>2+</h1>
              </div>
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 3 ? "#276968" : "white",
                  color: rating == 3 ? "white" : "#276968",
                }}
                onClick={() => setRating(3)}
              >
                <h1>3+</h1>
              </div>
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 4 ? "#276968" : "white",
                  color: rating == 4 ? "white" : "#276968",
                }}
                onClick={() => setRating(5)}
              >
                <h1>4+</h1>
              </div>
            </div>
            <div className="border-b-2 my-3"></div>
          </div>
          {/* Another */}
          {/* <div className="flex flex-col mb-2">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Another</h1>
            </div>
            <div className="my-2 text-[#302D27]">
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={another.animal}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setAnother({ ...another, animal: !another.animal })
                  }
                />
                <p>สัตว์เลี้ยงทุกชนิด</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={another.alcohal}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setAnother({ ...another, alcohal: !another.alcohal })
                  }
                />
                <p>ดื่มแอลกอฮอล์</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={another.smoke}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setAnother({ ...another, smoke: !another.smoke })
                  }
                />
                <p>สูบบุหรี่</p>
              </div>
            </div>
          </div> */}
          <div className="flex justify-between">
            <div
              onClick={multiFilter}
              className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg cursor-pointer px-10 w-fit"
            >
              <h1>Filter</h1>
            </div>
            <div
              onClick={resetFilter}
              className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg cursor-pointer px-10 w-fit"
            >
              <h1>Reset</h1>
            </div>
          </div>
        </div>
        <div className="lg:w-[95%] w-full lg:px-4">
          {fetchBlogs
            ? fetchBlogs.map((blog: any, key: any) => {
                return (
                  <div key={key} className="my-2">
                    <Link href={`/location/${blog._id}`}>
                      <LocationBox blogInfo={blog} key={key} />
                    </Link>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      {showFilter? <div className={`min-w-[300px] flex-col p-4 shadow-md rounded-lg h-fit flex fixed z-20 top-0 bg-white min-h-screen pt-24 duration-500 transition-all ${showFilter? "left-0" : "left-[-300px]"}`}>
          {/* search   */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <h1>Search</h1>
              <div className="w-[30px] h-[30px] rounded-full bg-[#276968] text-white flex justify-center items-center cursor-pointer" onClick={()=>setShowFilter(false)}>
                <h1>X</h1>
              </div>
            </div>
            <input
              type="text"
              className="border-2 rounded-lg indent-3 my-2 p-2"
              placeholder="Destination"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div className="border-b-2 my-3"></div>
          </div>
          {/* Cat */}
          <div className="flex flex-col">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Cetagories</h1>
            </div>
            <div className="my-2 text-[#302D27]">
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.breach}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({ ...cetagories, breach: !cetagories.breach })
                  }
                />
                <p>ชายหาดและทะเล</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.shopping}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({
                      ...cetagories,
                      shopping: !cetagories.shopping,
                    })
                  }
                />
                <p>ช็อปปิ้ง</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.history}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({
                      ...cetagories,
                      history: !cetagories.history,
                    })
                  }
                />
                <p>ประวัติศาสตร์ วัฒนธรรมและศาสนา</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.park}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({ ...cetagories, park: !cetagories.park })
                  }
                />
                <p>สวนสัตว์ สวนน้ำ และสวนสนุก</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={cetagories.museum}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setCetagories({ ...cetagories, museum: !cetagories.museum })
                  }
                />
                <p>พิพิธภัณฑ์และการเรียนรู้ ธรรมชาติ</p>
              </div>
            </div>
            <div className="border-b-2 my-3"></div>
          </div>
          {/* time */}
          {/* <div className="flex flex-col">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Time</h1>
            </div>
            <div className="my-2 text-[#302D27]">
              <div className="flex">
                <label>
                  <input
                    type="radio"
                    value={1}
                    name="radioGroup"
                    checked={openTime === 1}
                    onChange={(e) => setOpenTime(1)}
                    className="mr-2"
                  />
                  เปิดทุกวัน
                </label>
              </div>
              <div className="flex">
                <label>
                  <input
                    type="radio"
                    value={2}
                    name="radioGroup"
                    checked={openTime === 2}
                    onChange={(e) => setOpenTime(2)}
                    className="mr-2"
                  />
                  มีเวลาบางวัน
                </label>
              </div>
            </div>
            <div className="border-b-2 my-3"></div>
          </div> */}
          {/* Rating */}
          <div className="flex flex-col">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Rating</h1>
            </div>
            <div className="flex my-2 text-[#302D27]">
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 1 ? "#276968" : "white",
                  color: rating == 1 ? "white" : "#276968",
                }}
                onClick={() => setRating(1)}
              >
                <h1>1+</h1>
              </div>
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 2 ? "#276968" : "white",
                  color: rating == 2 ? "white" : "#276968",
                }}
                onClick={() => setRating(2)}
              >
                <h1>2+</h1>
              </div>
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 3 ? "#276968" : "white",
                  color: rating == 3 ? "white" : "#276968",
                }}
                onClick={() => setRating(3)}
              >
                <h1>3+</h1>
              </div>
              <div
                className="py-1 px-2 border-2 border-[#276968] text-[#276968] bg-inherit rounded-lg cursor-pointer mr-2"
                style={{
                  backgroundColor: rating == 4 ? "#276968" : "white",
                  color: rating == 4 ? "white" : "#276968",
                }}
                onClick={() => setRating(5)}
              >
                <h1>4+</h1>
              </div>
            </div>
            <div className="border-b-2 my-3"></div>
          </div>
          {/* Another */}
          {/* <div className="flex flex-col mb-2">
            <div className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg">
              <h1>Another</h1>
            </div>
            <div className="my-2 text-[#302D27]">
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={another.animal}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setAnother({ ...another, animal: !another.animal })
                  }
                />
                <p>สัตว์เลี้ยงทุกชนิด</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={another.alcohal}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setAnother({ ...another, alcohal: !another.alcohal })
                  }
                />
                <p>ดื่มแอลกอฮอล์</p>
              </div>
              <div className="flex my-1">
                <input
                  type="checkbox"
                  checked={another.smoke}
                  className="checkbox checkbox-md mr-2"
                  onChange={() =>
                    setAnother({ ...another, smoke: !another.smoke })
                  }
                />
                <p>สูบบุหรี่</p>
              </div>
            </div>
          </div> */}
          <div className="flex justify-between">
            <div
              onClick={multiFilter}
              className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg cursor-pointer px-10 w-fit"
            >
              <h1>Filter</h1>
            </div>
            <div
              onClick={resetFilter}
              className="flex justify-center items-center py-2 bg-[#276968] text-white rounded-lg cursor-pointer px-10 w-fit"
            >
              <h1>Reset</h1>
            </div>
          </div>
        </div>:""}
    </main>
  );
}
