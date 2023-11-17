import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { FormControl } from "@mui/base";
import { InputLabel, Input, Paper, Switch, Button } from "@mui/material";
import { CustomInput } from "../shared/customInput";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import TitleIcon from "@mui/icons-material/Title";
import LinkIcon from "@mui/icons-material/Link";
import Image from "next/image";
import { resizeImage } from "@/helpers/image";
import axios, { AxiosError, AxiosResponse } from "axios";
import { NotifierContext } from "@/context/notifier.context";
import { ComponentContext } from "@/context/component.context";
import { AddSliderValidation } from "@/helpers/validation";
import { Preview } from "./preview";
import api from "@/helpers/axiosConnector";
import server from "@/helpers/serverConnector";


type Slide = {
  // bgType: string,
  id?: string;
  h1Text: string;
  pText: string;
  isActionBtn: boolean;
  actionToggle: boolean;
  image?: File;
  actionbtn?: ActionButton;
  active?: boolean
};

type ActionButton = {
  display: string;
  url: string;
};

type Error = {
  // bgType?: string,
  h1Text?: string;
  pText?: string;
  isActionButton?: string;
  display?: string;
  url?: string;
  image?: string;
};

interface AddSliderProps {
  isEdit?: boolean;
  slideEdit?: Slide;
}

export const AddSlider = () => {
  const { state, dispatch } = useContext(ComponentContext);
  const [preview, setPreview] = useState<boolean>(false)
  const [slide, setSlide] = useState<Slide>({
    id: state?.slide?.id ?? null,
    active: state?.slide?.active ?? false,
    h1Text: state?.slide?.h1Text ?? "",
    pText: state?.slide?.pText ?? "",
    image: state?.slide?.image ?? null,
    isActionBtn: state?.slide?.isActionBtn ?? false,
    actionToggle: false,
    // actionbtn: {
    //     url: "",
    //     display: ""
    // }
  });
  const [error, setError] = useState<{ [key: string]: string }>({
    bgType: null,
    h1Text: null,
    pText: null,
    isActionButton: null,
    display: null,
    url: null,
  });

  const [image, setImage] = useState<string>();
  const [formValid, setFormValid] = useState<boolean>(true);
  const [sameImage, setSameImage] = useState<boolean>(false)

  // useEffect(() => {
  //   console.log()
  // },[])

  const [actionBtn, setActionbtn] = useState<ActionButton>({
    url: state?.slide?.url ?? "",
    display: state?.slide?.display ?? "",
  });

  const { notifierState, notifierDispatch } = useContext(NotifierContext);

  const handleChange = async (e: any, type: string) => {
    if (type == "isActionButton") {
      let update: Slide = {
        ...slide,
        isActionBtn: !slide.isActionBtn,
        // display: slide.isActionBtn == true ? state?.slide?.display : null,
        // url: slide.isActionBtn == true ? state?.slide?.url : null,
      };
      setSlide(update);
    }else if(type == "active") {
      let update: Slide = {
        ...slide,
        active: !slide.active,
      };
      setSlide(update);
    }
     else if (type == "image") {
      let allowedExtensions = ["jpg"];
      let file: File = e.target.files[0];
      let fileType = file.name.split(".");
      let fileSize = file.size;
      console.log(fileType[fileType.length - 1])
      if (
        allowedExtensions.includes(fileType[fileType.length - 1]) &&
        fileSize <= 500000
      ) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let update = { ...slide, image: file };
        setSlide(update);
        setImage(URL.createObjectURL(file));
        // console.log(URL.createObjectURL(file))
        setError({ ...error, image: "" });
      } else if (!allowedExtensions.includes(fileType[fileType.length - 1])) {
        setError({ ...error, image: "Please select a jpg file" });
      } else if (!(fileSize <= 500000)) {
        setError({
          ...error,
          image: "Please select an image less than 500kb or less",
        });
      }
    } else if (type == "display" || type == "url") {
      let update = { ...actionBtn, [type]: e.target.value };
      setActionbtn(update);
    } else {
      let update = { ...slide, [type]: e.target.value };
      setSlide(update);
    }
  };

  const displayPreview = () => {
    return 
  }

  const togglePreview = () => {
    // dispatch({type: "PREVIEW", payload: {index: "0.3", slide: {...slide, actionBtn}, title: "preview"}})
    // console.log(slide)
    if(slide != null) {
      setPreview((state) => !state)
    }
  }

  const createSlide = () => {
    let body: { [key: string]: any } = {
      ...slide,
      url: null,
      display: null,
      sameImage,
      ...actionBtn,
    };
    delete body["actionToggle"];
    // console.log(body)

    AddSliderValidation.validate(body, { abortEarly: false }) // abortEarly: false will return all validation errors
      .then((validatedData) => {
        delete body["sameImage"];
        server
          .post(
            state?.title != "EDIT"
              ? "/createSlide"
              // ? "http://192.168.1.28:8035/api/Slider"
              : "/editSlide",
              // : "http://192.168.1.28:8035/api/Slider/update",
            body,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res: AxiosResponse) => {
            if (res.data.code == 200) {
              notifierDispatch({
                type: "CREATE",
                payload: {
                  code: 200,
                  title: "Successfull",
                  content: res.data.message,
                  open: true,
                },
              });
              dispatch({ type: "SWITCH_INDEX", payload: { index: "1.0" } });
            } else {
              notifierDispatch({
                type: "CREATE",
                payload: {
                  code: 200,
                  title: "Unsuccessfull",
                  content: res.data.message,
                  open: true,
                },
              });
            }
          })
          .catch((err: AxiosError) => {
            console.log(err.cause);
            console.log(err.message);
          });
      })
      .catch((validationErrors) => {
        // Validation failed
        let errorFields: string[] = [];
        validationErrors.inner.forEach((error: any) => {
          console.error(`Field: ${error.path}, Error: ${error.message}`);
          errorFields.push(error.path);
        });
        notifierDispatch({
          type: "CREATE",
          payload: {
            code: 200,
            content: `please fill the ${errorFields[0]} field`,
            open: true,
            title: "Missing fields",
          },
        });
      });
  };

  const enterSta = ''

  const renderForm = () => (
    <Paper className="p-4 h-[110vh] w-[80vw]">
      <div className="flex px-2">
        {state?.title != "EDIT" ? (
          <h2 className="text-[24px]">Add new Slide</h2>
        ) : (
          <h2 className="text-[24px]">Edit Slide</h2>
        )}
      </div>
      <div className="grid grid-cols-8">
        <div className="mt-[40px] grid col-span-3 gap-8">
          <FormControl>
            <CustomInput
              value={slide.h1Text}
              onChange={(e) => handleChange(e, "h1Text")}
              component={"text"}
              placeHolder="Heading text"
              type="text"
              classes="h-[40px] w-[90%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
              icon={<TitleIcon className="text-green-700" />}
              error={error.h1Text}
              maxLength={100}
            />
          </FormControl>
          <FormControl className="w-[90%]">
            <CustomInput
              placeHolder="Paragraph text"
              value={slide.pText}
              onChange={(e) => handleChange(e, "pText")}
              component={"field"}
              type={"text"}
              rows={4}
              classes=" bg-gray-100 w-[300px] rounded-md no-underline shadow-md mt-4"
              error={error.h1Text}
              maxLength={150}
            />
          </FormControl>
          <FormControl>
            <InputLabel>Image</InputLabel>
            <CustomInput
              onChange={(e) => handleChange(e, "image")}
              component={"text"}
              type={"file"}
              placeHolder="Image"
              disabled={sameImage ? true : false}
              classes="h-[40px] w-[90%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
              error={error.image}
              maxLength={20}
            />
          </FormControl>
          {
            state?.title == "EDIT" && (
              <FormControl className="flex flex-row place-items-center">
              <InputLabel>Retain current image?</InputLabel>
              <Switch
                className="text-green-700"
                checked={sameImage}
                onChange={(e) => setSameImage((prev) => !prev)}
              />
            </FormControl>
            )
          }
          <FormControl className="flex flex-row place-items-center">
            <InputLabel>Make slide active?</InputLabel>
            <Switch
              className="text-green-700"
              checked={slide.active}
              onChange={(e) => handleChange(e, "active")}
            />
          </FormControl>
          <FormControl className="flex flex-row place-items-center">
            <InputLabel>Has Action Button?</InputLabel>
            <Switch
              className="text-green-700"
              checked={slide.isActionBtn}
              onChange={(e) => handleChange(e, "isActionButton")}
            />
          </FormControl>

          {slide.isActionBtn && (
            <div className="flex flex-col gap-6">
              <CustomInput
                value={actionBtn.display}
                onChange={(e) => handleChange(e, "display")}
                component={"text"}
                placeHolder="Action Name"
                classes="h-[40px] w-[90%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                icon={<SubtitlesIcon className="text-green-700" />}
                error={error.display}
                maxLength={20}
              />
              <CustomInput
                value={actionBtn.url}
                onChange={(e) => handleChange(e, "url")}
                component={"text"}
                type="text"
                rows={4}
                placeHolder="Action Url"
                classes="h-[40px] w-[90%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                icon={<LinkIcon className="text-green-700" />}
                error={error.url}
                maxLength={20}
              />
            </div>
          )}
        </div>

        <div className="grid col-span-5 relative">
          <div className="mt-[-30px] mb-[40px]">
            <Button onClick={togglePreview} className="bg-green-700 h-[50px] w-[100px] text-white">
              Preview
            </Button>
            </div>
          <Paper className="h-[545.06px] w-[708.67px] border-dashed border-2 relative">
            <p className="text-[32px] font-semibold absolute top-[120px] left-[50px] text-black">
              {slide?.h1Text}
            </p>
            <p className="text-[16px] font-semibold absolute top-[250px] left-[50px] text-black">
              {slide?.pText}
            </p>
            {slide?.isActionBtn && (
              <div className="absolute top-[400px] left-[50px]">
                <Button
                  href={actionBtn.url}
                  className="bg-orange-600 h-[60px] text-white"
                >
                  {actionBtn.display}
                </Button>
              </div>
            )}
            {(image || state?.title == "EDIT") && (
              <img
                src={
                  image ?? `http://localhost:5078/api/Slider/image/${state.slide.id}`
                  // `http://localhost:5078/api/Slider/image/${state?.slide?.id}`
                }
                className="h-[545.06px] w-[708.67px]"
              />
            )}
          </Paper>
        </div>
      </div>
      <div className="flex justify-end mt-[60px]">
        <Button
          onClick={createSlide}
          className="bg-green-700 text-white w-[150px] h-[60px]"
        >
          Submit
        </Button>
      </div>
    </Paper>
  )

  return (
    <div>
      {!preview ? renderForm() : <Preview close={togglePreview} slide={{...slide, actionBtn}}  />}
    </div>
  );
};
