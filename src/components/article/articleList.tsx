import React, { useState, useEffect, useContext } from 'react'
import { Article } from './types'
import axios, { AxiosError, AxiosResponse } from "axios";
import { Paper, Divider, IconButton, Skeleton } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { NotifierContext } from '@/context/notifier.context';
import { ComponentContext } from '@/context/component.context';
import server from '@/helpers/serverConnector';


export const ArticleList = () => {
  const [articles, setArticles] = useState<Article[]>()

  const { state, dispatch } = useContext(ComponentContext);

  const { notifierState, notifierDispatch } = useContext(NotifierContext);

  const getArticles = () => {
    server.get(
      "/getArticles"
      // "http://192.168.1.28:8035/api/Article"
      )
    .then((res: AxiosResponse) => {
      // console.log(res.data.data)
      // console.log(res.data)
      if(res.data.code == 200 && res.data.data.section1) {
        const data = res.data.data
        setArticles(res.data.data)
        dispatch({type: "SET_ARTICLES", payload: { articles: {section1: data.section1, section2: data.section2, section3: data.section3}, index: "1.2.2"}})
      }
    })
    .catch((err: AxiosError) => {
      console.log(err.message)
    })
  }

  useEffect(() => {
    getArticles()
  },[])

  // const handleEdit = (article: Article) => {
  //   dispatch({
  //     type: "SWITCH",
  //     payload: { index: 1, title: "EDIT", article: article },
  //   });
  //   // setSlideToEdit(slide)
  //   // setEditing(true)
  // };

  const renderArticles = () => {
    return articles.map((item: Article, idx: number) => (
      <Paper key={idx} className='flex flex-col w-[240px] h-[250px]'>
        <img
          src={`data:image/jpeg;base64,${item.imageBytes}`}
          className="w-[240px] h-[130px] ml-auto"
          alt="/"
        />
        <div className='flex flex-row p-2 gap-2'>
        <div className='leading-relaxed flex flex-col'>
          <div className='overflow-hidden truncate'>Title: {item.title}</div>
          <div className='overflow-hidden truncate'>Header: {item.header}</div>
          <div className='overflow-hidden truncate'>Active: {item.isActive ?? true}</div>
          <div>Date: {item.creationDate.split("T")[0]}</div>
        </div>
        <Divider className='bg-green-700 w-[1px]' orientation='vertical' />
        <div className='flex flex-col gap-4'>
          <IconButton className='w-[35px] h-[35px] rounded-full bg-gray-200'>
            <EditIcon className='text-green-700' />
          </IconButton>
          <IconButton className='w-[35px] h-[35px] rounded-full bg-gray-200'>
            <DeleteIcon className='text-green-700' />
          </IconButton>
        </div>
        </div>
      </Paper>
    ))
  }

  return (
    <div>
      <Divider className='bg-green-700 h-[2px] my-4' />
      <Skeleton />
        {/* {state?.articles && (
          <Skeleton />
        )} */}
    </div>
  )
}