"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";

const signupSchema = Yup.object().shape({
  name: Yup.string().required("กรุณาใส่ช่องนี้"),
  email: Yup.string().email("Invalid email").required("กรุณาใส่ช่องนี้"),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "รหัสผ่านไม่ตรงกัน")
    .required("กรุณายืนยันรหัสผ่าน"),
});

export default function Register() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const checkData = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    };
    const isValid = await signupSchema.isValid(checkData);
    if (isValid) {
       try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/auth/regist-email`, {
          name: checkData.name,
          email: checkData.email,
          password: checkData.password,
        })
        if(res.status == 201){
          await signIn("credentials", {
            redirect: true,
            username: checkData.email,
            password: checkData.password,
            callbackUrl: "/",
          })
        }
       }catch(error){
        if (error instanceof Error) {
          alert(error.message);
        }
       }
    }
  }

  return (
    <div className="flex justify-center w-full min-h-[700px] h-screen bg-[url('https://cdn.pic.in.th/file/picinth/image-77.png')] bg-cover bg-center bg-no-repeat font-karnit flex-wrap">
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
            <h1 className=" text-gray-800 text-4xl font-bold">Sign up</h1>
            <p className="mt-3 text-gray-400">Sign up new account</p>
          </div>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signupSchema}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="py-5" onSubmit={handleSubmit}>
                <div className="my-5 flex flex-col relative">
                  <label className="absolute left-3 text-black duration-300 -translate-y-2 bg-white text-xs font-bold">
                    &nbsp;&nbsp;Name&nbsp;&nbsp;
                  </label>
                  <Field
                    name="name"
                    type="string"
                    className="w-full py-4 px-6 border rounded-xl" //focus:outline-none
                    id="name"
                    placeholder="Name"
                  />
                  <ErrorMessage
                    component="div"
                    name="name"
                    className="font-bold text-[#FF6F6B] text-xs pl-5"
                  />
                </div>

                <div className="my-5 flex flex-col relative">
                  <label className="absolute left-3 text-black duration-300 -translate-y-2 bg-white text-xs font-bold">
                    &nbsp;&nbsp;Email&nbsp;&nbsp;
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full py-4 px-6 border rounded-xl" //focus:outline-none
                    id="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="font-bold text-[#FF6F6B] text-xs pl-5"
                  />
                </div>

                <div className="my-5 relative">
                  <label className="absolute left-3 text-black duration-300 -translate-y-2 bg-white text-xs font-bold">
                    &nbsp;&nbsp;Password&nbsp;&nbsp;
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full py-4 px-6 border rounded-xl focus:outline-none" //
                    id="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="font-bold text-[#FF6F6B] text-xs pl-5"
                  />
                </div>

                <div className="my-5 relative">
                  <label className="absolute left-3 text-black duration-300 -translate-y-2 bg-white text-xs font-bold">
                    &nbsp;&nbsp;Confirm Password&nbsp;&nbsp;
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="w-full py-4 px-6 border rounded-xl focus:outline-none" //
                    id="confirmPassword"
                    placeholder="confirm password"
                  />
                  <ErrorMessage
                    component="div"
                    name="confirmPassword"
                    className="font-bold text-[#FF6F6B] text-xs pl-5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-4 bg-[#276968] text-slate-50 rounded-lg"
                  style={{ width: "100%" }}
                >
                  Sign up
                </button>
              </Form>
            )}
          </Formik>
          <p className="font-bold text-xs text-center text-gray-400 ">
            Do have an account yet?{" "}
            <Link href={"/signin"} className="font-bold text-xs text-[#FF6F6B]">
              signin
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
