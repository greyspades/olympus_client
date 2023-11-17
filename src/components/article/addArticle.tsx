import React, { useState, useEffect, useContext } from "react";
import { Button, Paper, Switch } from "@mui/material";
import { EditorState, ContentState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
import { convertToHTML  } from "draft-convert";
import { CustomInput } from "../shared/customInput";
import { Article } from "./types";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";
import { AddArticleValidation } from "@/helpers/validation";
import { NotifierContext } from "@/context/notifier.context";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ComponentContext } from "@/context/component.context";
import htmlToDraft from 'html-to-draftjs';
import server from "@/helpers/serverConnector";


const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), {
    ssr: false
});

export const AddArticle = () => {
  const { state, dispatch } = useContext(ComponentContext);
  const convertHtmlToPlainText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const convertPlainTextToEditorState = (plainText: string) => {
    if (plainText) {
      const contentState = ContentState.createFromText(
        convertHtmlToPlainText(plainText)
        // plainText
      );
      return EditorState.createWithContent(contentState);
    }
  };

  const getSection = (): Article => {
    if(state.title == "EDIT" && state.meta == "SEC1") {
      return state.articles.section1
    } else if(state.title == "EDIT" && state.meta == "SEC2") {
      return state.articles.section2
    } else if(state.title == "EDIT" && state.meta == "SEC3") {
      return state.articles.section3
    } else if(state.title != "EDIT") {
      return {
        header: "",
    image: null,
    isActive: true,
    paragraph: "",
    title: "",
      }
    }
  }

  const initialEditorState = state.title == "EDIT" ? convertPlainTextToEditorState(getSection()?.paragraph) : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialEditorState);
  const { notifierState, notifierDispatch } = useContext(NotifierContext);

  const [convertedContent, setConvertedContent] = useState(null)
  const [previewImage, setPreviewImage] = useState<string>();
  const [sameImage, setSameImage] = useState<boolean>(false)
  const [article, setArticle] = useState<Article>({
    section: getSection()?.section ?? null,
    id: getSection()?.id ?? null,
    header: getSection()?.header ?? "",
    image: null,
    isActive: true,
    paragraph: getSection()?.paragraph ?? "",
    title: getSection()?.title ?? "",
  });

  // const convertHtmlToEditorState = (html: string) => {
  //   // const contentBlock = htmlToDraft(html);
  //   // if (contentBlock) {
  //   //   const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  //   //   return EditorState.createWithContent(contentState);
  //   // }
  //   const contentBlocks = convertFromHTML(html);
  // const contentState = ContentState.createFromBlockArray(
  //   contentBlocks.contentBlocks,
  //   contentBlocks.entityMap
  // );
  //   return EditorState.createEmpty();
  // };

  // useEffect(() => {
  //   console.log("semper fi")
  //   console.log(getSection())
  //   if(getSection().paragraph) {
  //     console.log("e dey")
  //     const editorContentState = convertHtmlToEditorState(getSection().paragraph);
  //     console.log(editorContentState)
  //     setEditorState(EditorState.push(editorState, editorContentState));
  //   }
  // },[])

  useEffect(() => {
    let htmlText = convertToHTML(editorState?.getCurrentContent());
    let plainText = editorState.getCurrentContent().getPlainText();
    let update = { ...article, paragraph: htmlText };
    setArticle(update);
    setConvertedContent(plainText);
    if(getSection().paragraph) {
      // setArticle(getSection().paragraph.toString())
    }
  }, [editorState]);

  const handleChange = (event: any, field: string) => {
    const value = event.target.value;
    if (field == "image") {
      let allowedExtensions = ["png", "jpg", "jpeg"];
      const file: File = event.target.files[0];
      let fileType = file.name.split(".");
      let fileSize = file.size;
      if (
        allowedExtensions.includes(fileType[fileType.length - 1]) &&
        fileSize <= 500000
      ) {
        let update = { ...article, image: file };
        setArticle(update);
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
      }
    } else {
      let update = { ...article, [field]: value };
      setArticle(update);
    }
  };

  const submitArticle = () => {
    let body = {
        ...article,
        sameImage
    };
    
    if(state?.title != "EDIT") {
      if(state.meta == "SEC1") {
        dispatch({type: "SWITCH_ARTICLE_1", payload: {articles: {section1: { ...article, section: state?.meta }}, index: "1.2.2", title: "article"}})
      } else  if(state.meta == "SEC2") {
        dispatch({type: "SWITCH_ARTICLE_2", payload: {articles: {section2: { ...article, section: state?.meta }}, index: "1.2.2", title: "article"}})
      } else  if(state.meta == "SEC3") {
        dispatch({type: "SWITCH_ARTICLE_3", payload: {articles: {section3: { ...article, section: state?.meta }}, index: "1.2.2", title: "article"}})
      }
      // console.log(state.articles)
    } else {
      AddArticleValidation.validate(body, { abortEarly: false })
    .then((validBody) => {
        delete validBody["sameImage"];
        server
        .post(
          "/editArticle",
          // "http://192.168.1.28:8035/api/Article/update",
          validBody,
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
            dispatch({type: "SWITCH_INDEX", payload: {index: "1.2.1", title: "article", meta: null}})
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
    })
    }
  }
  const handleEdit = (e: any, field: string) => {
    let value = e.target.value
    if (field == "image") {
      let allowedExtensions = ["png", "jpg", "jpeg"];
      const file: File = e.target.files[0];
      let fileType = file.name.split(".");
      let fileSize = file.size;
      if (
        allowedExtensions.includes(fileType[fileType.length - 1]) &&
        fileSize <= 500000
      ) {
        let update = { ...article, image: file };
        // setArticle(update);
        setPreviewImage(URL.createObjectURL(file));
      } else {
        return
      }
    }
    if(state.meta == "SEC1") {
      let update = {...state.articles, section1: { ...state.articles.section1, [field]: value}}
      dispatch({type: "ARTICLE_CHANGE", payload: {index: "0.2", articles: update, meta: state.meta, title: "EDIT"}})
    }
    if(state.meta == "SEC2") {
      let update = {...state.articles, section2: { ...state.articles.section2, [field]: value}}
      dispatch({type: "ARTICLE_CHANGE", payload: {index: "0.2", articles: update, meta: state.meta, title: "EDIT"}})
    }
    if(state.meta == "SEC3") {
      let update = {...state.articles, section3: { ...state.articles.section3, [field]: value}}
      dispatch({type: "ARTICLE_CHANGE", payload: {index: "0.2", articles: update, meta: state.meta, title: "EDIT"}})
    }
  }

  return (
    <Paper className="p-4">
      <div>
        <p className="text-[26px] font-semibold">New Article</p>
      </div>
      <div className="flex flex-row justify-between gap-10 mt-[20px]">
        <CustomInput
          value={article?.title}
          onChange={(e) => handleChange(e, "title")}
          component={"text"}
          placeHolder="Title"
          classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
          // icon={<SubtitlesIcon className="text-green-700" />}
          // error={error.display}
          // maxLength={40}
        />
        <CustomInput
          value={article.header}
          onChange={(e) => handleChange(e, "header")}
          component={"text"}
          placeHolder="Header"
          classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
          // icon={<SubtitlesIcon className="text-green-700" />}
          // error={error.display}
          // maxLength={40}
        />
      </div>
      <div className="mt-[40px]">
        <div className="flex flex-row mt-[30px] gap-6">
          <div className="flex flex-col">
           {
            state?.title == "EDIT"&& (
              <div>
              <p>Use same image</p>
              <Switch
                checked={sameImage}
                onChange={() => setSameImage(!sameImage)}
              />
            </div>
            )
           }
            <div>
            <p className="text-[12px]">Article Image</p>
            <CustomInput
              onChange={(e) => handleChange(e, "image")}
              component={"text"}
              type="file"
              disabled={sameImage ? true : false}
              placeHolder="Image"
              classes="h-[40px] w-[80%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
            />
            </div>
            <div className="border-dashed border-2 w-[500px] h-[500px] mt-[20px] relative">
              {(previewImage || getSection()?.id) && (
                <img
                  src={previewImage ?? `${process.env.NEXT_PUBLIC_GET_ARTICLE_IMAGE}/${getSection().id}`}
                  className="w-[500px] h-[300px]"
                  alt="/"
                />
              )}
              <div className="absolute top-[60px] left-[20px]">
                <p className="text-[16px] capitalize">{getSection().title?.toUpperCase()}</p>
                <p className="text-[35px] capitalize font-semibold break-all">{article?.header}</p>
              </div>

              <div className="break-words"><p>{convertedContent}</p></div>
            </div>
          </div>

          <div className="shadow-md break-words w-[48vw]">
            <p className="text-[12px]">
                Article content
            </p>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              wrapperClassName="h-[85%] break-words"
              editorClassName="bg-gray-100 p-4 break-words"
              toolbarClassName="toolbar-class"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={submitArticle} className="h-[50px] w-[120px] bg-green-700 m-6 text-white">
            Submit
        </Button>
      </div>
    </Paper>
  );
};
function convertFromRaw(arg0: any) {
  throw new Error("Function not implemented.");
}

