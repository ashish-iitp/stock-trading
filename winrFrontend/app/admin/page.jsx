"use client"
import Link from "next/link"
import LoginForm from "@/components/partials/auth/login-form"
import Social from "@/components/partials/auth/social"
import useDarkMode from "@/hooks/useDarkMode"
import AdminForm from "@/components/partials/auth/admin-login"

// image import

const Login = () => {
  const [isDark] = useDarkMode()
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <Link href="/">
                <img
                  src={
                    isDark
                      ? "/assets/images/logo/logo-white.svg"
                      : "/assets/images/logo/logo.svg"
                  }
                  alt=""
                  className="mb-10"
                />
              </Link>
              <h4>
                Unlock your Project{" "}
                <span className="text-slate-800 dark:text-slate-400 font-bold">
                  performance
                </span>
              </h4>
            </div>
            <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
              <img
                src="/assets/images/auth/ils1.svg"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link href="/">
                    <img
                      src={
                        isDark
                          ? "/assets/images/logo/logo-white.svg"
                          : "/assets/images/logo/logo.svg"
                      }
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Sign in</h4>
                  <div className="text-slate-500 text-base">
                    Sign in to your Admin Account
                  </div>
                </div>
                <AdminForm />
                <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                    Or continue with
                  </div>
                </div>
              </div>
              <div className="auth-footer text-center">
                Copyright 2021, WinR All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
