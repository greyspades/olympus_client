import type { NextApiRequest, NextApiResponse } from "next";
import Axios from "axios";
import CryptoJS from "crypto-js";
import { NextRequest, NextResponse } from "next/server";
// import formidable from 'express-formidable';

  var key = CryptoJS.enc.Utf8.parse(process.env.AES_KEY as string);
  var iv = CryptoJS.enc.Utf8.parse(process.env.AES_IV as string);

  let reqToken = CryptoJS.AES.encrypt(
    process.env.AUTH_TOKEN as string,
    key,
    {iv: iv}
  ).toString();

  type UrlData = {
    code: string,
    url: string
  }

const urls: UrlData[] = [
    {
        code: "createArticleView",
        url: process.env.NEXT_PUBLIC_CREATE_ARTICLE_VIEW
    },
    {
      code: "getAllArticleViews",
      url: process.env.GET_ALL_ARTICLE_VIEWS
    },
    // {
    //   code: "createArticleView",
    //   url: process.env.NEXT_PUBLIC_CREATE_ARTICLE_VIEW
    // },
    // {
    //   code: "createArticleView",
    //   url: process.env.NEXT_PUBLIC_CREATE_ARTICLE_VIEW
    // }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const reqUrl: string = urls.find((item: UrlData) => item.code === body.url).url
    // const formData = await request.formData()
    console.log(body)
    console.log(reqUrl)
    // console.log(formData)
    // console.log(request.body)
    // console.log(formData)
    // console.log(reqUrl)

    // const response = await fetch(reqUrl, {
    //   method: request.body.method,      
    //   headers: {
    //     Auth: reqToken
    //   },
    // }).then((res) => {
    //     if(res.ok) {
    //         return res.json()
    //     }
    // })
    // console.log(response)

    // return new Response(response)

    return NextResponse.json(JSON.stringify({}))
  } catch (error) {
    console.log(error)
  }
}

export {}