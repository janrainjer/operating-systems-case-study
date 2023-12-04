"use client";
import React from "react";
import { IUser } from "../types/User";
import Swal from "sweetalert2";
import axios from "axios";
import { useAppDispatch } from "../store/hooks";
import { deleteUser } from "../store/slice/userSlice";
import { useSession, signOut } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface IEditUserModal {
  userInfo: IUser;
  setShow: (show: boolean) => void;
}

const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string(),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "รหัสผ่านไม่ตรงกัน")
    .required("กรุณายืนยันรหัสผ่าน"),
});

export default function EditPasswordModal({
  userInfo,
  setShow,
}: IEditUserModal) {
  const dispacth = useAppDispatch();
  const { data: user, status } = useSession();

  const handleShow = () => {
    setShow(false);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const checkData = {
      oldPassword: data.get("oldPassword"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    };
    Swal.fire({
      title: "กดตกลงเพื่อเปลี่ยนรหัสผ่าน",
      confirmButtonText: "บันทึก",
      confirmButtonColor: "#276968",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#276968",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const isValid = await changePasswordSchema.isValid(checkData);
        if (isValid) {
          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND}/users/change-password/${userInfo._id}`,
              {
                oldPassword: checkData.oldPassword,
                newPassword: checkData.password,
              },
              {
                headers: {
                  Authorization: `Bearer ${user?.accessToken}`,
                },
              }
            );
            if (res.status == 201) {
              Swal.fire("Saved!", "", "success").then(async (res) => {
                if (res.isConfirmed == true) {
                  signOut({ callbackUrl: '/signin' })
                  dispacth(deleteUser())
                  // redirect('/signin')
                }
              });
            }
          } catch (error) {
            if (error instanceof Error) {
              Swal.fire({
                icon: "error",
                title: error.message,
              });
            }
          }
        }
      }
    });
  }

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10 z-50">
      <div className="max-w-screen-xl h-fit sm:w-[70%] lg:[50%] w-[90%] gap-1 bg-white p-6 overflow-hidden rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <div className="px-5 py-2 bg-[#276968] text-white w-fit rounded-xl">
            <h2>แก้ไขข้อมูล</h2>
          </div>
          <div
            className="w-8 h-8 bg-[#276968] text-white rounded-[50%] flex justify-center items-center cursor-pointer"
            onClick={() => handleShow()}
          >
            <h2>X</h2>
          </div>
        </div>
        <Formik
          initialValues={{
            oldPassword: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ errors, touched }) => (
            <Form className="py-5" onSubmit={handleSubmit}>
              <div className="my-5 flex flex-col relative">
                <label className="absolute left-3 text-black duration-300 -translate-y-2 bg-white text-xs font-bold">
                  &nbsp;&nbsp;Old Password&nbsp;&nbsp;
                </label>
                <Field
                  name="oldPassword"
                  type="password"
                  className="w-full py-4 px-6 border rounded-xl" //focus:outline-none
                  id="oldPassword"
                  placeholder="Old Password"
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
                Change Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
