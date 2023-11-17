import React, { useEffect, useState } from 'react'
import { Article } from '../article/types'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { IconButton } from '@mui/material';
import { ContentState, EditorState } from 'draft-js';
import dynamic from "next/dynamic"
import { stateFromHTML } from "draft-js-import-html";

interface PreviewProps {
  close: () => void,
  article: Article
}
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

export const ArticlePreview = ({close, article}: PreviewProps) => {
  const convertPlainTextToEditorState = (plainText: string) => {
    if (plainText) {
      const contentState = ContentState.createFromText(plainText);
      return EditorState.createWithContent(contentState);
    }
  };
    const initialEditorState = article.paragraph != null ? convertPlainTextToEditorState(article?.paragraph) : EditorState.createEmpty();
    const [editorState, setEditorState] = useState(initialEditorState);

    useEffect(() => {
      var contentState = stateFromHTML(article.paragraph);
      var html = EditorState.createWithContent(contentState);
      setEditorState(html)
    },[article.paragraph])

  return (
    <div className='h-[100vh] overflow-y-scroll'>
      <IconButton onClick={close}>
        <KeyboardBackspaceIcon />
      </IconButton>
      <div className='w-[100%] h-[400px] relative'>
        <img className='w-[100%] h-[400px] object-cover' src={article?.image ? URL.createObjectURL(article?.image) : `${process.env.NEXT_PUBLIC_GET_ARTICLE_VIEW_IMAGE}/${article?.id}`} alt="header image" />
        <h1 className='absolute left-[60px] top-[170px] text-5xl font-semibold text-white w-[50%]'>{article.header}</h1>
      </div>
      <div className='h-[100px] border-b-2 border-b-gray-300 flex place-items-center px-[200px]'>
          <div className='flex place-items-center gap-4'>
          <img className='w-[70px] h-[70px] object-cover rounded-full' src={article?.avatar ? URL.createObjectURL(article?.avatar) : `${process.env.NEXT_PUBLIC_GET_AVATAR}/${article?.id}`} alt="header image" />
              <p className='font-semibold text-[18px]'>{article.title}</p>
          </div>
      </div>
      
      <div className='flex justify-center w-[100%] px-[200px]'>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName="h-[100%]"
        readOnly={true}
        toolbarHidden={true}
        editorClassName="bg-white text-[24px]"
        toolbarClassName="toolbar-class"

      />
      </div>
    </div>
  )
}