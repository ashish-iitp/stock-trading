import React, { useState } from "react"
import { toast } from "react-toastify"
import Textinput from "@/components/ui/Textinput"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useRouter } from "next/navigation"
import Checkbox from "@/components/ui/Checkbox"
import { useDispatch, useSelector } from "react-redux"
import { handleRegister } from "./store"

const schema = yup.object({
  username: yup.string(),
  email: yup.string(),
  phone: yup.string(),
})

const RegForm = () => {
  const dispatch = useDispatch()

  const [checked, setChecked] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  })

  const router = useRouter()

  const onSubmit = async (data) => {
    let body = {
      email: data?.email,
      phone: data?.phone,
      username: data?.username,
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/user/user_request`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body), // Send the form data to the API
        }
      )
      if (response.ok) {
        toast.success("Access Requested Successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } else {
        const errorResponse = await response.json()
        const { errorCode, errorMessage } = errorResponse
        throw new Error(errorMessage || "An error occurred. Please try again.")
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }
    // if (user) {
    //   dispatch(handleLogin(true));
    //   setTimeout(() => {
    //     router.push("/analytics");
    //   }, 1500);
    // } else {
    //   toast.error("Invalid credentials", {
    //     position: "top-right",
    //     autoClose: 1500,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <Textinput
        name="username"
        label="User Name"
        type="text"
        placeholder=" Enter your User Name"
        register={register}
      />{" "}
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder=" Enter your email"
        register={register}
      />
      <Textinput
        name="phone"
        label="phone"
        type="text"
        placeholder=" Enter your phone"
        register={register}
      />
      <button className="btn btn-dark block w-full text-center">
        Create an account
      </button>
    </form>
  )
}

export default RegForm
