"use client"
import React, { useEffect, useState, useContext } from "react"
import Image from 'next/image'
import { Navbar } from '@/components/shared/navbar'
import { SideMenu } from '@/components/shared/menu'
import { Slider } from '@/components/slider/slider'
import { AddSlider } from "@/components/slider/addSlider"
import { SliderList } from "@/components/slider/sliderList"
import { AddArticle } from "@/components/article/addArticle"
import { ArticleList } from "@/components/article/articleList"
import { AddVideo } from "@/components/Video/addVideo"
import { Skeleton } from "@/components/article/skeleton"
import { Button, Paper, Slide, Switch, CircularProgress } from "@mui/material"
import { Articles } from "@/components/article/article"
import { Formik } from "formik"
import { CustomInput } from "@/components/shared/customInput"
import { VideoSection } from "@/components/Video/videoSection"
import { AddArticleView } from "@/components/articleView/addArticleView"
import axios, { AxiosError, AxiosResponse } from "axios"
import { ArticleViews } from "@/components/articleView/articleViews"
import { ComponentContext } from "@/context/component.context";
import { NotifierContext } from "@/context/notifier.context";
import { ArticlePreview } from "@/components/article/articlePreview"
import { useRouter } from "next/navigation"
import api from "@/helpers/axiosConnector"

interface MenuItem {
  index: number,
  name: string,
  component: React.ReactNode
}

export default function Home() {
  const [index, setIndex] = useState<string>("0")
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [remember, setRemember] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  
  const { state, dispatch } = useContext(ComponentContext);
  const { notifierState, notifierDispatch } = useContext(NotifierContext);
  const router = useRouter()


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
  
  const handleMenuChange = (index: string) => {
    console.log(index)
    // setIndex(index)
    dispatch({type: "SWITCH_INDEX", payload: {index: index, title: "switch"}})
  }

  const displayMenuItem = () => {
    switch(state.index) {
      case "1.1.1" :
        return <SliderList />
      case "1.1.2" :
        return <AddSlider />
      case "1.2.1" :
        return <ArticleList />
      case "1.2.2" :
        return <Skeleton />
      case "1.3.1" :
        return 
      case "1.3.2" :
        return <AddVideo />
      case "2.2.2" :
        return <AddArticleView />
      case "3" :
        return <VideoSection />
      case "2.2.1" :
        return <ArticleViews />
      case "0.2" :
        return <AddArticle />
      case "0.3" :
        // return <ArticlePreview />
      default :
      return <SliderList />
    }
  }

  return (
    <main className="flex justify-center">
      <Paper className="w-[40%] h-[400px] p-4 mt-[60px] flex justify-center flex-col place-items-center">
        <div className="">
            <h3 className="text-[24px] font-semibold">
              Sign in
            </h3>
          </div>
        <div>
        <form>
        <Formik initialValues={{username: "", password: ""}} onSubmit={(value) => {
          const body = {
            id: value.username,
            password: value.password
          }
          setLoading(true)
          api.post("/User/e360", body)
          .then((res: AxiosResponse) => {
            if(res.data.code == 200) {
              setLoading(false)
              sessionStorage.setItem("token", res.data.token)
              sessionStorage.setItem("user", JSON.stringify(res.data.data))
              // dispatch({type: "SET_USER", payload: {user: res.data.data}})
              setLoggedIn(true)
              router.push("/home")
            } else {
              setLoading(false)
              notifierDispatch({type: "CREATE", payload: {code: res.data.code, content: res.data.message, open: true, title: "Unsuccessfull"}})
            }
          })
          .catch((err: AxiosError) => {
            console.log(err.message)
            console.log("dang it")
            setLoading(false)
            notifierDispatch({type: "CREATE", payload: {code: 200, content: err.message, open: true, title: "Unsuccessfull"}})
          })
        }}>{({handleChange, handleSubmit, values}) => (
          <div className="flex flex-col place-items-center justify-center gap-6">
           <CustomInput
          value={values.username}
          onChange={handleChange("username")}
          component={"text"}
          placeHolder="Username"
          classes="h-[40px] w-[300px] bg-gray-100 no-underline px-4 shadow-md rounded-full"
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
          classes="h-[40px] w-[300px] bg-gray-100 no-underline px-4 shadow-md rounded-full"
          // icon={<SubtitlesIcon className="text-green-700" />}
          // error={error.display}
          maxLength={40}
        />
        <div className="flex justify-start place-items-center gap-4 ml-[-100px]">
          <p>Remember me</p>
          <Switch
            value={remember}
            onChange={() => setRemember(!remember)}
            placeholder="Remember me"
            className=""
          />
        </div>
        <Button className="bg-green-700 h-[40px] w-[300px] text-white mt-[20px]" onClick={() => handleSubmit()}>
          {loading ? <CircularProgress className="text-white" /> : <p>Sign In</p>}
        </Button>
          </div>
        )}
        </Formik>
      </form>
        </div>
      </Paper>
    </main>
  )
}
