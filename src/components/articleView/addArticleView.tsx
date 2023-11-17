import React, { useContext, useEffect, useState } from "react";
import { Button, Paper, Switch, IconButton } from "@mui/material";
import { useFormik } from "formik";
import { AddArticleValidation, EditArticleValidation } from "@/helpers/validation";
import { CustomInput } from "../shared/customInput";
import Image from "next/image";
import { EditorState, ContentState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ComponentContext } from "@/context/component.context";
import { NotifierContext } from "@/context/notifier.context";
import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import { postAsync } from "@/helpers/connector";
import { ArticlePreview } from "./articlePreview";
import api from "@/helpers/axiosConnector";
import server from "@/helpers/serverConnector";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export const AddArticleView = () => {
  const [imgPrev, setImgPrev] = useState<string>();

  const convertHtmlToPlainText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const convertPlainTextToEditorState = (plainText: string) => {
    if (plainText) {
      const contentState = ContentState.createFromText(
        convertHtmlToPlainText(plainText)
      );
      return EditorState.createWithContent(contentState);
    }
  };
  const { state, dispatch } = useContext(ComponentContext);
  const initialEditorState =
    state.title == "EDIT"
      ? convertPlainTextToEditorState(state?.article?.paragraph)
      : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialEditorState);
  const { notifierState, notifierDispatch } = useContext(NotifierContext);
  const [convertedText, setConvertedText] = useState<string>();
  const [previewing, setPreviewing] = useState<boolean>(false);

  const formik = useFormik({

    initialValues: {
      header: state?.article?.header ?? "",
      image: null,
      avatar: null,
      isActive: state?.article?.isActive ?? true,
      paragraph: "",
      title: state?.article?.title ?? "",
      id: state?.article?.id ?? "",
      sameImage: state?.article?.sameImage ?? true,
      author: state?.user?.UserRef ?? ""
    },
    validationSchema: state?.title == "EDIT" ? EditArticleValidation : AddArticleValidation,
    onSubmit: async (values) => {
      // Handle form submission if validation passes
      const formData = new FormData();
      const body: { [key: string]: any } = values;
      Object.keys(body).forEach((key) => {
        formData.append(key, body[key]);
      });
      server
        .post(
          state?.title == "EDIT" ? "/editArticleView" : "/createArticleView",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res: AxiosResponse) => {
          const resData = res.data;
          notifierDispatch({
            type: "CREATE",
            payload: {
              code: resData.code,
              content: resData.message,
              open: true,
              title: resData.status,
            },
          });
        })
        .catch((err: AxiosError) => {
          console.log(err.message);
        });

      // await fetch("/api/createArticleView", options)
      // .then(async(res) => {
      //   if(res.ok) {
      //     const rawData = await res.json()
      //     const resData = JSON.parse(rawData)
      //     notifierDispatch({type: "CREATE", payload: {code: resData.code, content: resData.message, open: true, title: resData.status}})
      //     formik.handleReset
      //   }
      // }).catch((err) => {
      //   console.log(err)
      // })
    },
  });
  useEffect(() => {
    let htmlText = convertToHTML(editorState?.getCurrentContent());
    let plainText = editorState.getCurrentContent().getPlainText();

    formik.setFieldValue("paragraph", htmlText);
    setConvertedText(plainText);
  }, [editorState]);

  const handleImageSelect = (e: any) => {
    const file = e.target.files[0];
    setImgPrev(URL.createObjectURL(file));
    formik.setFieldValue("image", file);
  };

  const handleAvatarSelect = (e: any) => {
    const file = e.target.files[0];
    formik.setFieldValue("avatar", file);
  };

  const closePreview = () => {
    setPreviewing(false);
  };

  const goBack = () => {
    dispatch({
      type: "SWITCH_INDEX",
      payload: { index: "2.2.1", title: "switch" },
    });
  }
  return (
    <div>
      <Paper className={!previewing ? "p-4" : null}>
        {!previewing ? (
          <div>
            <div className="flex flex-row gap-10 place-items-center">
              <IconButton onClick={goBack}>
                <ArrowBackIcon />
              </IconButton>
              {state?.title == "EDIT" ? <h3 className="text-[24px] font-medium">Edit Article Page</h3> : <h3 className="text-[24px] font-medium">New Article Page</h3> }
            </div>
            <form onSubmit={formik.handleSubmit} className="mt-[30px]">
              <div className="flex flex-col">
                <div className="flex flex-row gap-6">
                  <CustomInput
                    value={formik.values.header}
                    onChange={(e: any) =>
                      formik.setFieldValue("header", e.target.value)
                    }
                    placeHolder="Header"
                    component="text"
                    error={formik.errors.header}
                    classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                  />
                  <CustomInput
                    value={formik.values.title}
                    onChange={(e: any) =>
                      formik.setFieldValue("title", e.target.value)
                    }
                    placeHolder="Video tag"
                    component="select"
                    error={formik.errors.title}
                    classes="h-[40px] w-[100%] mt-[17px] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                    selValues={["Blog post", "Article", "Press release"]}
                  />
                </div>
                <div className="flex flex-row gap-4 mt-[20px]">
                  <div className="flex flex-col w-[40vw] gap-6">
                    {state?.title == "EDIT" && (
                      <div className="flex flex-row place-items-center">
                        <p>Retain the image</p>
                        <Switch
                        checked={formik.values.sameImage}
                      value={formik.values.sameImage}
                      onChange={(e) => formik.setFieldValue("sameImage", !formik.values.sameImage)}
                    />
                      </div>
                    )}
                    {state?.title != "EDIT" && (
                      <div>
                        <p className="text-[11px] mb-[-10px]">Select an Avatar</p>
                        <CustomInput
                         onChange={(e: any) => handleAvatarSelect(e)}
                         placeHolder="avatar"
                         component="text"
                         type="file"
                         error={formik.errors.avatar}
                         classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                       />
                      </div>
                    )}
                    <div>
                    <p className="text-[11px] mb-[-10px]">Select an Image</p>
                    <CustomInput
                      onChange={(e: any) => handleImageSelect(e)}
                      placeHolder="image"
                      component="text"
                      type="file"
                      error={formik.errors.image}
                      classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                    />
                    </div>
                    <div className="border-dashed border-2 w-[500px] h-[400px] shadow-lg">
                      <img
                        src={
                          imgPrev ??
                          `http://localhost:5078/api/Article/image/views/${state?.article?.id}`
                        }
                        className="w-[100%] h-[100%]"
                        alt="image preview"
                      />
                    </div>
                  </div>
                  <div>
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                      wrapperClassName="h-[500px]"
                      editorClassName="bg-gray-100 p-4"
                      toolbarClassName="toolbar-class"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-6 mt-[20px]">
                  <Button
                    onClick={() => setPreviewing(true)}
                    className="h-[40px] w-[150px] mt-[20px] text-white bg-green-700"
                  >
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    className="h-[40px] w-[150px] mt-[20px] text-white bg-green-700"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <ArticlePreview close={closePreview} article={formik.values} />
        )}
      </Paper>
    </div>
  );
};
