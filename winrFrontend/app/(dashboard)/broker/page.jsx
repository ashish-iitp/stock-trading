"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { bottomFilterLists } from "@/constant/data"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import SimpleBar from "simplebar-react"
import { useSelector, useDispatch } from "react-redux"
import {
  toggleMobileEmailSidebar,
  toggleEmailModal,
  setFilter,
  setSearch,
} from "@/components/partials/app/email/store"
import { Icon } from "@iconify/react"

import { ToastContainer, toast } from "react-toastify"
import Badge from "@/components/ui/Badge"
import useWidth from "@/hooks/useWidth"
import Swicth from "@/components/ui/Switch"
import TodoHeader from "@/components/partials/app/todo/TodoHeader"

const ListLoading = dynamic(() => import("@/components/skeleton/ListLoading"), {
  ssr: false,
})

const Topfilter = dynamic(
  () => import("@/components/partials/app/email/Topfilter"),
  {
    ssr: false,
  }
)

export const topFilterLists = [
  {
    name: "Alice Blue",
    value: "alice",
    checked: true,

    icon: "uil:image-v",
  },
]
const EmailPage = () => {
  const { isAuth } = useSelector((state) => state.auth)

  const { width, breakpoints } = useWidth()
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const { mobileEmailSidebar, emails, search, filter, singleModal } =
    useSelector((state) => state.email)
  const [switches, setSwitches] = useState(topFilterLists)
  const handleSwitchChange = async (id) => {
    const updatedSwitches = data?.map((sw) =>
      sw.id === id ? { ...sw, user_status: sw.user_status == 1 ? 0 : 1 } : sw
    )
    setData(updatedSwitches)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/broker/update_broker_status`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
          body: JSON.stringify({ broker_id: id }),
        }
      )

      if (response.ok) {
        const data = await response.json()
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
  }
  const [currentId, setCurrentId] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState("")
  const [currentBrokerData, setCurrentBrokerData] = useState("")
  const [brokersLoadind, setBrokersLoadind] = useState(false)
  const [editModes, setEditModes] = useState({}) // State to manage edit modes
  const [editedData, setEditedData] = useState({}) // State to manage edited data

  const handleModifyClick = (index) => {
    setEditModes((prevModes) => ({
      ...prevModes,
      [index]: true,
    }))

    // Store the current data in editedData state
    const currentData = currentBrokerData[index]
    setEditedData((prevData) => ({
      ...prevData,
      [index]: { ...currentData },
    }))
  }

  const handleInputChange = (index, field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [index]: {
        ...prevData[index],
        [field]: value,
      },
    }))
  }

  const getData = async () => {
    setBrokersLoadind(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/broker/broker_list`,
        {
          method: "GET", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
        }
      )
      setBrokersLoadind(false)

      if (response.ok) {
        const data = await response.json()
        setData(data?.data)
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
  }
  useEffect(() => {
    getData()

    if (width < breakpoints.lg && mobileEmailSidebar) {
      dispatch(toggleMobileEmailSidebar(false))
    }
  }, [filter, breakpoints.lg])

  const handleFilter = (filter) => {
    dispatch(setFilter(filter))
  }
  const onSubmit = async (data) => {
    console.log(data)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/broker/add_broker_creds`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
          body: JSON.stringify({ broker_name: currentId[0]?.name, ...data }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setShowAdd(false)
        getBrokerData(currentId[0]?.name)
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
  }
  const getBrokerData = async (name) => {
    setLoading(true)
    const queryParams = new URLSearchParams({
      broker_name: name,
    })

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/broker/add_broker_creds?${queryParams}`,
        {
          method: "GET", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
        }
      )
      setLoading(false)

      if (response.ok) {
        const data = await response.json()
        setCurrentBrokerData(data?.data)
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
  }
  const handleSaveClick = async (index) => {
    console.log(currentBrokerData)
    // You can send the editedData[index] to your API for saving here
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/broker/add_broker_creds`,
        {
          method: "PUT", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
          body: JSON.stringify({
            id: currentBrokerData[index].id,
            to_update: {
              broker_user_id: editedData[index].broker_user_id,
              broker_api_key: editedData[index].broker_api_key,
            },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setEditModes((prevModes) => ({
          ...prevModes,
          [index]: false,
        }))
        getBrokerData(currentId[0]?.name)
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
    // After successful save, you can toggle the edit mode off and update the actual data
    console.log(editedData)
  }
  const handleDelete = async (id) => {
    // You can send the editedData[index] to your API for saving here
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/broker/add_broker_creds`,
        {
          method: "DELETE", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
          body: JSON.stringify({
            id: id,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()

        getBrokerData(currentId[0]?.name)
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
    // After successful save, you can toggle the edit mode off and update the actual data
    console.log(editedData)
  }
  const handleQuantityUpdate = async (newQuantity, itemId) => {
    const updatedItems = currentBrokerData.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setCurrentBrokerData(updatedItems)

    console.log(newQuantity)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NLP_API_URL}/broker/update_broker_quantity`,
        {
          method: "POST", // or 'GET', 'PUT', etc.
          headers: {
            "Content-Type": "application/json",
            jwttoken: isAuth.jwt,
            userid: isAuth.userId,
          },
          body: JSON.stringify({
            id: itemId,
            quantity: newQuantity,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
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
  }
  return (
    <>
      <ToastContainer />

      <div className="flex md:space-x-5 app_height overflow-hidden relative rtl:space-x-reverse">
        <div
          className={`transition-all duration-150 flex-none min-w-[260px] 
        ${
          width < breakpoints.lg
            ? "absolute h-full top-0 md:w-[260px] w-[200px] z-[999]"
            : "flex-none min-w-[260px]"
        }
        ${
          width < breakpoints.lg && mobileEmailSidebar
            ? "left-0 "
            : "-left-full "
        }
        `}
        >
          <Card
            bodyClass=" py-6 h-full flex flex-col"
            className="h-full bg-background"
          >
            {brokersLoadind && <ListLoading count={3} />}
            {!brokersLoadind && (
              <SimpleBar className="h-full px-6 ">
                {console.log(currentId)}
                <ul className="list mt-2">
                  {data &&
                    data?.map((item, i) => (
                      <Topfilter
                        item={item}
                        key={i}
                        filter={currentId[0]?.id}
                        handleSwitchChange={handleSwitchChange}
                        onClick={() => {
                          setCurrentId([item])
                          getBrokerData(item?.name)
                        }}
                      />
                    ))}
                </ul>
              </SimpleBar>
            )}
          </Card>
        </div>
        {/* overlay */}
        {width < breakpoints.lg && mobileEmailSidebar && (
          <div
            className="overlay bg-slate-900 dark:bg-slate-900 dark:bg-opacity-60 bg-opacity-60 backdrop-filter
         backdrop-blur-sm absolute w-full flex-1 inset-0 z-[99] rounded-md"
          ></div>
        )}
        <div className="flex-1 md:w-[calc(100%-320px)]">
          <SimpleBar className="h-full all-todos overflow-x-hidden">
            {currentId ? (
              <Card
                title={"Alice Blue"}
                noborder
                className="app_height bg-background"
                headerslot={
                  <div className="relative">
                    <Button onClick={() => setShowAdd(!showAdd)}>add</Button>
                    {showAdd && <TodoHeader onSubmit={onSubmit} />}
                  </div>
                }
              >
                {isLoading && <ListLoading count={3} />}
                {!isLoading && (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-700 -mb-6 h-full">
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                      <thead className=" border-t border-slate-100 dark:border-slate-800">
                        <tr>
                          <th scope="col" className=" table-th ">
                            User Id
                          </th>
                          <th scope="col" className=" table-th ">
                            API Key
                          </th>
                          <th scope="col" className=" table-th w-1/6 ">
                            Quantity
                          </th>

                          <th scope="col" className=" table-th ">
                            Modify
                          </th>

                          <th scope="col" className=" table-th ">
                            Delete
                          </th>
                          <th scope="col" className=" table-th ">
                            Main
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700 ">
                        {currentBrokerData &&
                          currentBrokerData?.map((value, index) => (
                            <tr className="hover:bg-hover ">
                              <td className="table-td">
                                {editModes[index] ? (
                                  <input
                                    className="form-control py-2 "
                                    type="text"
                                    value={editedData[index]?.broker_user_id}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "broker_user_id",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  value?.broker_user_id
                                )}
                              </td>
                              <td className="table-td">
                                {editModes[index] ? (
                                  <input
                                    className="form-control py-2 "
                                    type="text"
                                    value={editedData[index]?.broker_api_key}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "broker_api_key",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  value?.broker_api_key
                                )}
                              </td>

                              <td className="table-td">
                                <div className="">
                                  <input
                                    type="number"
                                    value={value?.quantity}
                                    onChange={(e) => {
                                      handleQuantityUpdate(
                                        e.target.value,
                                        value?.id
                                      )
                                    }}
                                    className="form-control py-2 "
                                  />
                                </div>
                              </td>
                              <td className="table-td">
                                {" "}
                                {editModes[index] ? (
                                  <>
                                    <Badge
                                      className="bg-success-500 text-white cursor-pointer"
                                      onClick={() => handleSaveClick(index)}
                                    >
                                      Save
                                    </Badge>
                                  </>
                                ) : (
                                  <Badge
                                    className="bg-success-500 text-white cursor-pointer"
                                    onClick={() => handleModifyClick(index)}
                                  >
                                    Modify
                                  </Badge>
                                )}
                              </td>
                              <td className="table-td">
                                {" "}
                                <Badge
                                  className="bg-danger-500 text-white cursor-pointer"
                                  onClick={() => handleDelete(value?.id)}
                                >
                                  Delete
                                </Badge>
                              </td>
                              <td className="table-td ">
                                {" "}
                                {value?.is_main ? (
                                  <Icon
                                    icon="mdi:administrator-outline"
                                    color="#ffc300"
                                    width="25"
                                  />
                                ) : (
                                  ""
                                )}
                              </td>
                              <td className="table-td ">
                                {" "}
                                {value?.status == 0 ? (
                                  <div className="rounded-full bg-red-500 w-[10px] h-[10px] text-red-500"></div>
                                ) : (
                                  <div className="rounded-full bg-green-500 w-[10px] h-[10px] text-red-500"></div>
                                )}
                              </td>

                              <td className="table-td ">
                                {" "}
                                <Swicth
                                  value={value.do_twofa == 1 ? true : false}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </ul>
                )}
              </Card>
            ) : (
              <Card className="app_height bg-background">
                Please Select a broker
              </Card>
            )}
          </SimpleBar>
        </div>
      </div>
    </>
  )
}

export default EmailPage
