import React, { useState, useEffect} from 'react'
import { Article } from '../article/types'
import { Paper } from '@mui/material'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ArticleList } from './articleList'
import api from '@/helpers/axiosConnector'

export const ArticleViews = () => {
    const [articles, setArticles] = useState<Article[]>()
    const [page, setPage] = useState<number>(1)
    const [take, setTake] = useState<number>(10)

    const getAllArticles = async() => {
        const body = {
            page: 1,
            take: 10
        }
        // const options = {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         page,
        //         take: 10
        //     })
        // };
        // await fetch("/api/getArticleViews", options)
        // .then(async(res) => {
        //     if(res.ok) {
        //         const resData = await res.json()
        //         console.log(resData)
        //     }
        // })
        // .catch((err) => {
        //     console.log(err)
        // })
        axios.post("http://localhost:5078/api/Article/pages", body)
        .then((res: AxiosResponse) => {
            // console.log(res.data)
            setArticles(res.data.data)
        })
        .catch((err: AxiosError) => {
            console.log(err.message)
        })
    }

    // useEffect(() => {
    //     getAllArticles()
    // },[page])

    const renderArticles = () => {
        return articles?.map((item: Article, idx: number) => (
            <div className='w-[350px] h-[500px] rounded-md shadow-lg' key={idx}>
                <img className='w-[100%] h-[200px]' src={`http://localhost:5078/api/Article/image/views/${item.id}`} alt="header image" />
                <div className='p-4 text-ellipsis overflow-hidden ...'>
                <div className='flex place-items-center gap-4'>
                    <span className='h-[3px] w-[25px] bg-blue-400' />
                    <p>
                        {item.title}
                    </p>
                </div>
                <div className='mt-[20px]'>
                    <p className='text-[18px] font-semibold capitalize'>{item?.header}</p>
                </div>
                <div>
                    <p dangerouslySetInnerHTML={{__html:item?.paragraph}} className='h-[200px] text-[18px] font-medium capitalize leading-8 text-ellipsis overflow-hidden pb-2 ...' />
                </div>
                </div>
            </div>
        ))
    }

  return (
    <div>
        <Paper className='p-4'>
            <div>
                <p className='text-[28px] font-medium'>Article Views</p>
            </div>
            <div className='mt-[20px]'>
            <ArticleList orientation='grid' />
            </div>
        </Paper>
    </div>
  )
}
