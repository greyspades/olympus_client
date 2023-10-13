"use client"
import React, { useEffect, useState } from "react"
import Image from 'next/image'
import { Navbar } from '@/components/shared/navbar'
import { Menu } from '@/components/shared/menu'
import { Slider } from '@/components/slider/slider'
import { Button, Paper, Slide } from "@mui/material"
import { Articles } from "@/components/article/article"
import { Formik } from "formik"
import { CustomInput } from "@/components/shared/customInput"
import axios, { AxiosError, AxiosResponse } from "axios"

interface MenuItem {
  index: number,
  name: string,
  component: React.ReactNode
}

export default function Home() {
  const [index, setIndex] = useState<number>(0)
  const [loggedIn, setLoggedIn] = useState<boolean>(true)

  const items: MenuItem[] = [
    {
        index: 0,
        name: "Slider",
        component: <Slider />
    },
    {
        index: 1,
        name: "Article",
        component: <Slider />
    },
    {
        index: 2,
        name: "Footer",
        component: <Slider />
    }
  ]
  
  const handleMenuChange = (index: number) => {
    setIndex(index)
  }

  const displayMenuItem = () => {
    switch(index) {
      case 0 :
        return <Slider />
      case 1 :
        return <Articles />
      default :
      return <Slider />
    }
  }

  return (
    <main className="">
      {loggedIn ? (
        <div>
          <Navbar />
      <div className='mt-[60px] grid grid-cols-9'>
        <div className='grid col-span-1'>
        <Menu changeMenu={handleMenuChange} />
        </div>
        <div className='grid col-span-8'>
          {displayMenuItem()}
        </div>
      </div>
        </div>
      ) :
      <div className="flex justify-center">
        <Paper className="w-[40%] h-[300px] p-4 mt-[60px] flex">
        <form>
        <Formik initialValues={{username: "", password: ""}} onSubmit={(value) => {
          const body = {
            id: value.username,
            password: value.password
          }

          axios.post("http://localhost:5078/api/Slider/auth", body)
          .then((res: AxiosResponse) => {
            console.log(res.data)
          })
          .catch((err: AxiosError) => {
            console.log(err.message)
          })
          
        }}>{({handleChange, handleSubmit, values}) => (
          <div className="flex flex-col place-items-center justify-center">
            <div className="">
            <CustomInput
          value={values.username}
          onChange={handleChange("username")}
          component={"text"}
          placeHolder="Username"
          classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
          // icon={<SubtitlesIcon className="text-green-700" />}
          // error={error.display}
          maxLength={40}
        />
        <CustomInput
          value={values.password}
          onChange={handleChange("password")}
          component={"text"}
          type="password"
          placeHolder="Password"
          classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
          // icon={<SubtitlesIcon className="text-green-700" />}
          // error={error.display}
          maxLength={40}
        />
            </div>
        <Button onClick={() => handleSubmit()}>
          Submit
        </Button>
          </div>
        )}

        </Formik>
      </form>
      </Paper>
      </div>
      }
    </main>
  )
}
