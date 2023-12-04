"use client";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("กรุณาใส่ช่องนี้"),
  password: Yup.string(),
});

export default function Login() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("email"));
    await signIn("credentials", {
      redirect: false,
      username: data.get("email"),
      password: data.get("password"),
    }).then((res) => {
      console.log(res);
      if (res?.error) {
        alert(res.error);
      } else {
        router.push("/");
      }
    });
  }

  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "http://roadtrip.pickausername.com/" });
  }

  return (
    <div className="flex justify-center w-full h-screen bg-[url('https://cdn.pic.in.th/file/picinth/image-77.png')] min-h-[700px] bg-cover bg-center bg-no-repeat font-karnit flex-wrap">
      <div className="flex lg:items-center items-end justify-center w-fit lg:w-[30%] max-w-screen-md">
        <img
          src="https://cdn.pic.in.th/file/picinth/Group-2608839.png"
          alt="logo"
          className="w-[70%]"
        />
      </div>
      <div className="lg:w-[70%] w-full max-w-screen-xl flex justify-center lg:justify-end lg:pr-12 mt-5 sm:mt-0 sm:items-center min-h-fit">
        <section className="bg-white sm:w-[80%] w-[90%] h-fit lg:h-5/6 flex rounded-[32px] flex-col p-4 sm:p-8 lg:px-16 lg:py-0">
          <div className="lg:mt-14">
            <h1 className=" text-gray-800 text-xl sm:text-4xl font-bold mb-5">
              Login
            </h1>
            <p className="sm:my-3 text-gray-400 text:lg sm:text-xl">
              Login to access your account
            </p>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="py-5" onSubmit={handleSubmit}>
                <div className="sm:my-5 flex flex-col relative">
                  <label className="absolute left-3 text-black duration-300 -translate-y-2 bg-white text-xs font-bold">
                    &nbsp;&nbsp;Email&nbsp;&nbsp;
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full mb-2 py-4 px-6 border rounded-xl bg-white"
                    id="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="font-bold text-[#FF6F6B] text-xs pl-5"
                  />
                </div>

                <div className="my-2 sm:my-5 relative">
                  <label className="absolute left-3 text-black duration-300 -translate-y-2 bg-white text-xs font-bold">
                    &nbsp;&nbsp;Password&nbsp;&nbsp;
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full py-4 px-6 border rounded-xl focus:outline-none bg-white"
                    id="password"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-4 bg-[#276968] text-slate-50 rounded-lg"
                  style={{ width: "100%" }}
                >
                  Sign in
                </button>
              </Form>
            )}
          </Formik>
          <p className="font-bold text-xs text-center text-black sm:my-5">
            Don't have an account yet?{" "}
            <Link
              href={"/register"}
              className="font-bold text-xs text-[#FF6F6B]"
            >
              Sign Up
            </Link>
          </p>
          <div className="relative text-center mb-5">
            <div className="relative text-center z-50">
              <p className="inline-block text-sm text-gray-400 translate-y-3 bg-white">
                &nbsp;&nbsp;&nbsp;Or login with&nbsp;&nbsp;&nbsp;
              </p>
            </div>
            <div className="absolute inset-x-0 border-b border-gray-300 z-10"></div>
          </div>
          <div className="sm:mt-5">
            <button
              type="button"
              onClick={handleGoogleSignin}
              className="w-full border py-3 flex justify-center gap-2 rounded-lg"
            >
              Sign In with Google{" "}
              <Image
                alt=""
                src={
                  "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                }
                width="20"
                height={20}
              ></Image>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
