import React, { useState, useEffect, useContext } from "react";
import { Paper, IconButton, Tooltip } from "@mui/material";
import { AddSlider } from "./addSlider";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Slide } from "./types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { ComponentContext } from "@/context/component.context";
import { NotifierContext } from "@/context/notifier.context";
import { getAsync } from "@/helpers/connector";
import api from "@/helpers/axiosConnector";
import server from "@/helpers/serverConnector";

export const SliderList = () => {
  const [slides, setSlides] = useState<Slide[]>();
  const [editing, setEditing] = useState<boolean>(false);
  const [slideToEdit, setSlideToEdit] = useState<Slide>();

  const { state, dispatch } = useContext(ComponentContext);

  const { notifierState, notifierDispatch } = useContext(NotifierContext);

  const getSlides = async() => {
    await server.get("/getAllSlides")
    .then((res: AxiosResponse) => {
      if (res.data.code == 200) {
        setSlides(res.data.data);
      }
    })
    .catch((err: AxiosError) => {
      console.log(err.message);
    });
    
  };

  useEffect(() => {
    getSlides();
  }, []);

  const handleEdit = (slide: Slide) => {
    dispatch({
      type: "EDIT_SLIDE",
      payload: { index: "1.1.2", slide: slide, title: "EDIT" },
    });
  };

  const deleteSlide = (id: string) => {
    let body = {
      id,
    };
    console.log(id)
    server
      .post("/deleteSlide", body)
      .then((res: AxiosResponse) => {
        console.log(res.data);
        if (res.data.code == 200) {
          notifierDispatch({
            type: "CREATE",
            payload: {
              code: 200,
              content: res.data.message,
              open: true,
              title: "Successful",
            },
          });
          getSlides();
        }
      })
      .catch((err: AxiosError) => {
        notifierDispatch({
          type: "CREATE",
          payload: {
            code: 500,
            content: err.message,
            open: true,
            title: "Unsuccessful",
          },
        });
      });
  };

  const renderSlides = () => {
    return slides?.map((item: Slide, idx: number) => (
      <div
        key={idx}
        className="h-[150px] p-1 flex flex-row bg-green-100 rounded-md mt-[30px] justify-between gap-6"
      >
        <div className="flex gap-2 flex-col">
          <p className="bg-white p-2 rounded-md">Header: {item.h1Text}</p>
          <p className="bg-white p-2 rounded-md">Paragraph: {item.pText}</p>
          <p className="bg-white p-2 rounded-md">
            Created on: {item?.creationDate.split("T")[0] ?? "22/08/2023"}
          </p>
        </div>
        <img
          src={`${process.env.NEXT_PUBLIC_GET_SLIDER_IMAGE}/${item?.id}`}
          className="w-[200px] h-[130px] ml-auto"
          alt="/"
        />
        <div className="flex flex-col gap-5">
          <Tooltip title="Edit slide" arrow>
            <IconButton
              onClick={() => handleEdit(item)}
              className="w-[40px] h-[40px] rounded-full bg-white"
            >
              <EditIcon className="text-green-700 w-[25px] h-[25px]" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete slide" arrow>
            <IconButton
              onClick={() =>
                notifierDispatch({
                  type: "CREATE",
                  payload: {
                    code: 300,
                    content: "Are you sure you want to delete this slide?",
                    open: true,
                    title: "Confirmation",
                    next: {
                      title: "delete",
                      action() {
                        deleteSlide(item.id);
                      },
                    },
                  },
                })
              }
              className="w-[40px] h-[40px] rounded-full bg-white"
            >
              <DeleteIcon className="text-green-700 w-[25px] h-[25px]" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    ));
  };

  return (
    <Paper className="p-4 h-[80vh] overflow-y-scroll">
      {/* {!editing ? renderSlides() : <AddSlider isEdit={true} slideEdit={slideToEdit} />} */}
      <div>
        <p className="text-2xl font-medium">Created slides</p>
      </div>
      {renderSlides()}
    </Paper>
  );
};
