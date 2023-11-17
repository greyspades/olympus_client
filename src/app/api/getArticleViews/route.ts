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
    // console.log(body)

    const response = await fetch(process.env.GET_ALL_ARTICLE_VIEWS, {
      method: "POST",      
      headers: {
        Auth: reqToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(async(res: any) => {
        // console.log(await res.json())
        if(res.ok) {
            return await res.json()
        }
    })
    // console.log(response)

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
  }
}