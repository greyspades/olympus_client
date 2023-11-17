import React, { useState, useEffect, useContext } from "react";
import { Button, FormControl, InputLabel, Paper, Switch } from "@mui/material";
import { ComponentContext } from "@/context/component.context";
import { ArticlePreview } from "./articlePreview";
import { AddArticleValidation } from "@/helpers/validation";
import axios, { AxiosResponse, AxiosError } from "axios";
import { NotifierContext } from "@/context/notifier.context";
import { Preview } from "./preview";
import server from "@/helpers/serverConnector";

export const Skeleton = () => {
  const { state, dispatch } = useContext(ComponentContext);
  const [groupActive, setGroupActive] = useState<boolean>(false)
  const [preview, setPreview] = useState<boolean>(false);

  const { notifierState, notifierDispatch } = useContext(NotifierContext);

  const toggleGroupActive = () => {
    setGroupActive((prev) => !prev)
  }

  const switchComponent = (meta: string) => {
    dispatch({type: "SWITCH_INDEX", payload: {index: "0.2", meta: meta, title: "article"}})
  };

  const submitArticles = () => {
      const body = {
        ...state.articles,
      }
      server
        .post(
            "/createArticle",
            // "http://192.168.1.28:8035/api/Article",
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
            dispatch({ type: "SWITCH", payload: { index: "1" } });
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
  }

  const editArticle = (section: string) => {
    dispatch({type: "EDIT_ARTICLE", payload: {index: "0.2", title: "EDIT", meta: section}})
  }

  const togglePreview = () => {
    // if(state.title != "PREVIEW") {
    //   dispatch({type: "SWITCH_COMPONENT", payload: {index: "0.3", title: "PREVIEW"}})
    // } else {
    //   dispatch({type: "SWITCH_COMPONENT", payload: {index: "0.3", title: "ARTICLE_SKELETON"}})
    // }
    setPreview((prev) => !prev);
  }

  return (
    <div>
      {preview ? <Preview close={togglePreview} />
      :
      <Paper className="h-[650px] w-[100%] grid grid-cols-6">
        <div className="grid col-span-5 grid-cols-10 w-[100%] gap-4 p-4">
          <button onClick={() => state?.articles?.section1 ? editArticle("SEC1") : switchComponent("SEC1")} className="border-dashed border-2 w-[100%] h-[100%] grid col-span-5 shadow-lg">
            {state?.articles?.section1 ? <ArticlePreview article={state?.articles.section1} /> : <div>Section 1</div>}
          </button>
          <div className="grid col-span-5 grid-rows-2 gap-4">
            <button onClick={() => state?.articles?.section2 ? editArticle("SEC2") : switchComponent("SEC2")} className="grid row-span-1 border-dashed border-2 w-[100%] h-[300px] shadow-lg">
            {state?.articles?.section2 ? <ArticlePreview article={state?.articles.section2} /> : <div>Section 2</div>}
            </button>
            <button onClick={() => state?.articles?.section3 ? editArticle("SEC3") : switchComponent("SEC3")} className="grid row-span-1 border-dashed border-2 w-[100%] h-[300px] shadow-lg">
            {state?.articles?.section3 ? <ArticlePreview article={state?.articles.section3} /> : <div>Section 3</div>}
            </button>
          </div>
        </div>
        <div className="grid col-span-1 bg-gray-100 w-[100%] h-[100%] px-4">
        {/* <div className="flex flex-col place-items-start w-[100%] mt-[20px]">
              <div className="text-[14px]">
                Make Article group active ?
              </div>
              <Switch
              checked={groupActive}
              onClick={toggleGroupActive}
              />
          </div> */}
          <div className="mt-auto mb-[20px] flex flex-col gap-4">
          <Button disabled={true} onClick={submitArticles} className="w-[100%] h-[40px] bg-gray-400 text-white">
                Save as Draft
            </Button>
          <Button disabled={true} onClick={submitArticles} className="w-[100%] h-[40px] bg-gray-400 text-white">
                Schedule
            </Button>
            <Button onClick={togglePreview} className="w-[100%] h-[40px] bg-green-700 text-white">
                Preview
            </Button>
            {/* <Button disabled={state?.articles?.section1 && state?.articles?.section2 && state?.articles?.section3 ? true : false} onClick={submitArticles} className={state?.articles?.section1 && state?.articles?.section2 && state?.articles?.section3 ? "w-[100%] h-[40px] bg-gray-400 text-white" : "w-[100%] h-[40px] bg-green-700 text-white"} >
                Post
            </Button> */}
               <Button onClick={submitArticles} className="w-[100%] h-[40px] bg-green-700 text-white" >
                Post
            </Button>
          </div>
          </div>
      </Paper>}
    </div>
  );
};

