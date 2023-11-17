import React, { useContext, useEffect } from 'react'
import { ComponentContext } from '@/context/component.context'
import { Article } from './types'
import { Tooltip, IconButton } from '@mui/material'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { NotifierContext } from '@/context/notifier.context';

interface PreviewProps {
    article: Article,
    // classes: string
}

export const ArticlePreview = ({article}: PreviewProps) => {
    const {state, dispatch} = useContext(ComponentContext)
    const { notifierState, notifierDispatch } = useContext(NotifierContext);

    // useEffect(() => {
    //     console.log(state.title)
    // },[])
    const convertHtmlToPlainText = (html: string) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
      };
    
    const renderSection1 = () => (
        <div className='relative max-w-[32vw] max-h-[77vh] flex flex-col'>
        {article?.image ? (
            <img className='h-[60%] w-[100%]' src={URL.createObjectURL(article.image)} alt='/' />
        ) : (<img className={state.title=="PREVIEW" ? 'h-[400px] w-[100%] object-cover' : 'h-[350px] w-[100%] object-cover'} src={`${process.env.NEXT_PUBLIC_GET_ARTICLE_IMAGE}/${article?.id}`} alt='/' />)}
        <div className='absolute top-[140px] text-[14px] p-2 text-white'>
            {article?.title.toUpperCase()}
        </div>
        <div className='absolute top-[160px] left-[10px] text-[36px] text-start font-bold break-all p-2 w-[70%] text-white'>
            {article?.header}
        </div>
        <div className={state?.title == "PREVIEW" ? 'text-start p-2 text-[18px] leading-10 px-6 overflow-hidden h-[30%]' : 'text-start p-2 text-[18px] leading-10 px-6 overflow-hidden h-[230px]'}>
            {convertHtmlToPlainText(article?.paragraph)}
        </div>
        </div>
    )
    const renderSections = () => (
        <div className='flex flex-row w-[100%] h-[100%] max-h-[300px]'>
        <div className='w-[300px] h-[100%] bg-gray-400'>
        {article?.image ? (
            <img className='h-[100%] w-[100%] object-cover' src={URL.createObjectURL(article.image)} alt='/' />
        ) : (<img className='h-[100%] w-[100%] object-cover' src={`${process.env.NEXT_PUBLIC_GET_ARTICLE_IMAGE}/${article?.id}`} alt='/' />)}
        </div>
        <div className='flex flex-col place-items-start p-2 w-[100%]'>
        <div className=''>
            {article?.title.toUpperCase()}
        </div>
        <div className='text-[26px] font-semibold break-all mt-[10px] text-start'>
            {article?.header}
        </div>
        <div className='text-start mt-[20px] p-2 text-[18px] leading-8 px-10 overflow-hidden break-all'>
            {convertHtmlToPlainText(article?.paragraph)}
        </div>
        </div>
        </div>
    )

  return (
    <div className='bg-white'>
        {article?.section == "SEC1" ? renderSection1() : renderSections()}
    </div>
  )
}