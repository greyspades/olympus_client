import React, { useState, useEffect, useContext } from "react";
import { IconButton, Paper } from "@mui/material";
import { AddArticle } from "./addArticle";
import { ArticleList } from "./articleList";
import axios, { AxiosResponse } from "axios";
import { Article } from "./types";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Notifier } from "../shared/notifier";
import { ComponentContext } from "@/context/component.context";
import { Skeleton } from "./skeleton";
import { SliderList } from "../slider/sliderList";

export const Articles = () => {
  const [currIndex, setCurrIndex] = useState<number>(0);

  const { state, dispatch } = useContext(ComponentContext);

  const switchComponent = (idx: string) => {
    dispatch({type: "SWITCH_INDEX", payload: {index: idx, title: "article"}})
  };

  const renderComponent = () => {
    switch (state.index) {
      case "1.2.1":
        return <ArticleList />;
      case "1.2.2":
        return <Skeleton />;
      case "0.2":
        return <AddArticle />;
      default:
        // return <SliderList />;
        return <AddArticle />
    }
  };

  // const confirmSlider = (slideId: string) => {
  //   const validSlides = slides?.find((item: Slide) => item.actionBtn.url == "slideId")?.h1Text
  // }

  return (
    <div className="p-4">
        <div className="flex flex-row justify-between">
          {state?.index == "1.2.2" && (
            <IconButton onClick={() => switchComponent("0.2")} className="">
            New Article
            <AddIcon />
          </IconButton>
          )}
          {state?.index != "1.2.2" && (
            <IconButton onClick={() => switchComponent("1.2.1")} className="">
            <ArrowBackIcon />
          </IconButton>
          )}
        </div>
        <div>{renderComponent()}</div>
        <AddArticle />
    </div>
  );
};
