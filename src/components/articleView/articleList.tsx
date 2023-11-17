import React, { useState, useEffect, useContext } from 'react'
import { Article } from '../article/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Paper, IconButton, Tooltip, CircularProgress, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { ComponentContext } from "@/context/component.context";
import { NotifierContext } from "@/context/notifier.context";
import api from '@/helpers/axiosConnector';
import server from '@/helpers/serverConnector';

interface ListProps {
    orientation: "horizontal" | "grid"
}

export const ArticleList = ({orientation}: ListProps) => {
    const [articles, setArticles] = useState<Article[]>()
    const [page, setPage] = useState<number>(1)
    const [take, setTake] = useState<number>(10)
    const { state, dispatch } = useContext(ComponentContext);

    const { notifierState, notifierDispatch } = useContext(NotifierContext);

    const getAllArticles = async() => {
        const body = {
            page: 1,
            take: 10
        }
        server.post("/getAllArticleViews", body)
        .then((res: AxiosResponse) => {
            if(res.data.code == 200) {
              setArticles(res.data.data)
            }
        })
        .catch((err: AxiosError) => {
            console.log(err.message)
        })
    }

    useEffect(() => {
        getAllArticles()
    },[page])

    const handleEdit = (article: Article) => {
        dispatch({
          type: "EDIT_ARTICLE",
          payload: { index: "2.2.2", article: article, title: "EDIT" },
        });
      };
    
      const deleteArticle = (id: string) => {
        let body = {
          id,
        };
        server
          .post("/deleteArticleView", body)
          .then((res: AxiosResponse) => {
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
              getAllArticles()
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

    const renderArticles = () => {
        return articles?.map((item: Article, idx: number) => (
            <div className='w-[350px] h-[520px] rounded-md shadow-lg' key={idx}>
                <div className='relative'>
                <img className='w-[100%] h-[200px]' src={`${process.env.NEXT_PUBLIC_GET_ARTICLE_VIEW_IMAGE}/${item.id}`} alt="header image" />
                <div className="flex flex-col gap-5 absolute top-2 right-2">
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
                    content: "Are you sure you want to delete this article?",
                    open: true,
                    title: "Confirmation",
                    next: {
                      title: "delete",
                      action() {
                        deleteArticle(item.id);
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
                <div className='p-4 px-8'>
                <div className='flex place-items-center gap-4'>
                    <span className='h-[3px] w-[25px] bg-blue-400' />
                    <p>
                        {item.title}
                    </p>
                </div>
                <div className='mt-[10px]'>
                    <p className='text-[18px] font-semibold capitalize'>{item?.header}</p>
                </div>
                <div className='mt-[15px] mb-[10px] text-ellipsis overflow-hidden ...'>
                    <p dangerouslySetInnerHTML={{__html:item?.paragraph}} className='h-[170px] text-[16px] font-medium capitalize leading-6 text-ellipsis overflow-y-hidden ...' />
                </div>
                <Divider className='h-[2px] bg-gray-400' />
                <div className='flex flex-row place-items-center justify-between text-[14px]'>
                  <p className='w-[170px] text-ellipsis overflow-y-hidden ...'>{item?.uname ?? "No Author"}</p>
                  <p>{item?.creationDate?.split("T")[0]}</p>
                </div>
                </div>
            </div>
        ))
    }

  return (
    <div>
        <div className={orientation == "grid" ? 'grid grid-cols-3 gap-8' : 'flex flex-row place-items-center gap-8'}>
            {articles?.length > 0 ? renderArticles() : <CircularProgress />}
        </div>
    </div>
  )
}
