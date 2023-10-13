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
    {
      iv: iv,
    }
  ).toString();

// export const config = {
//   api: {
//     bodyParser: false,
//     // runtime: 'experimental-edge'
//   },
// };

export async function POST(request: NextRequest) {
  const formData:FormData = await request.formData()

  var tempFormData: FormData = formData;

  try {
    console.log(tempFormData)

    // const response = await fetch(process.env.CREATE_APPLICATION, {
    //   method: 'POST',
    //   body: formData,
      
    //   headers: {
    //     Auth: reqToken
    //   },
    // });

    // const data = await response.json();

    // console.log(data)

    return new Response(JSON.stringify({}))
    // return NextResponse.json({})
  } catch (error) {
    console.log(error)
  }
}