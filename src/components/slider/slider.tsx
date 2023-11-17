import React, { useState, useEffect, useContext } from "react";
import { IconButton, Paper } from "@mui/material";
import { AddSlider } from "./addSlider";
import { SliderList } from "./sliderList";
import axios, { AxiosResponse } from "axios";
import { Slide } from "./types";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Notifier } from "../shared/notifier";
import { ComponentContext } from "@/context/component.context";

export const Slider = () => {
  // const [slides, setSlides] = useState<Slide[]>();
  const [currIndex, setCurrIndex] = useState<number>(0);

  const { state, dispatch } = useContext(ComponentContext);

  const switchComponent = (idx: number) => {
    // dispatch({type: "SWITCH_INDEX", payload: {index: idx, title: "slider"}})
  };

  const renderComponent = () => {
    switch (state.index) {
      case "0":
        return <SliderList />;
      case "1":
        return <AddSlider />;
      default:
        return <SliderList />;
    }
  };

  // const confirmSlider = (slideId: string) => {
  //   const validSlides = slides?.find((item: Slide) => item.actionBtn.url == "slideId")?.h1Text
  // }

  return (
    <div className="p-4">
      {/* <Paper className="p-4 h-[90vh] w-[80vw]"> */}
        <div className="flex flex-row justify-between">
          {state?.index != "0" && (
            <IconButton onClick={() => switchComponent(0)} className="">
            <ArrowBackIcon />
          </IconButton>
          )}
        {state?.index == "0" && (
            <IconButton onClick={() => switchComponent(1)} className="">
            New Slide
            <AddIcon />
          </IconButton>
          )}
        </div>
        <div>{renderComponent()}</div>
        {/* <Notifier title="flnwql" content="fwqlfnl" open={true} code={200} /> */}
      {/* </Paper> */}
    </div>
  );
};
