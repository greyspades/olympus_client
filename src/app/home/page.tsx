"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { Navbar } from "@/components/shared/navbar";
import { SideMenu } from "@/components/shared/menu";
import { Slider } from "@/components/slider/slider";
import { AddSlider } from "@/components/slider/addSlider";
import { SliderList } from "@/components/slider/sliderList";
import { AddArticle } from "@/components/article/addArticle";
import { ArticleList } from "@/components/article/articleList";
import { AddVideo } from "@/components/Video/addVideo";
import { Skeleton } from "@/components/article/skeleton";
import { Button, Paper, Slide, Switch, CircularProgress } from "@mui/material";
import { Articles } from "@/components/article/article";
import { Formik } from "formik";
import { CustomInput } from "@/components/shared/customInput";
import { VideoSection } from "@/components/Video/videoSection";
import { AddArticleView } from "@/components/articleView/addArticleView";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ArticleViews } from "@/components/articleView/articleViews";
import { ComponentContext } from "@/context/component.context";
import { NotifierContext } from "@/context/notifier.context";
import { ArticlePreview } from "@/components/article/articlePreview";
import { useRouter } from "next/navigation";
import { AddUser } from "@/components/roles/addUser";

interface MenuItem {
  index: number;
  name: string;
  component: React.ReactNode;
}

export default function Home() {
  const [index, setIndex] = useState<string>("0");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { state, dispatch } = useContext(ComponentContext);
  const { notifierState, notifierDispatch } = useContext(NotifierContext);

  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData != null) {
      setLoggedIn(true);
    } else {
      router.push("/")
    }
  }, []);

  const items: MenuItem[] = [
    {
      index: 0,
      name: "Slider",
      component: <Slider />,
    },
    {
      index: 1,
      name: "Article",
      component: <Slider />,
    },
    {
      index: 2,
      name: "Footer",
      component: <Slider />,
    },
  ];

  const handleMenuChange = (index: string) => {
    console.log(index);
    dispatch({
      type: "SWITCH_INDEX",
      payload: { index: index, title: "switch" },
    });
  };

  const displayMenuItem = () => {
    switch (state.index) {
      case "1.1.1":
        return <SliderList />;
      case "1.1.2":
        return <AddSlider />;
      case "1.2.1":
        return <ArticleList />;
      case "1.2.2":
        return <Skeleton />;
      case "1.3.1":
        return;
      case "1.3.2":
        return <AddVideo />;
      case "2.2.2":
        return <AddArticleView />;
      case "3.1":
        return <AddUser />;
      case "2.2.1":
        return <ArticleViews />;
      case "0.2":
        return <AddArticle />;
      case "0.3":
      // return <ArticlePreview />
      default:
        return <SliderList />;
    }
  };

  return (
    <main className="">
      {loggedIn && (
        <div>
          <Navbar />
          <div className="mt-[60px] grid grid-cols-12">
            <div className="grid col-span-2">
              <SideMenu changeMenu={handleMenuChange} />
            </div>
            <div className="grid col-span-10 pt-[20px]">
              {displayMenuItem()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
