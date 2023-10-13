import CryptoJs from "crypto-js";

var key = CryptoJs.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_KEY);
var iv = CryptoJs.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_IV);

export const encrypt = (payload: any) => {
    const encrypted = CryptoJs.AES.encrypt(JSON.stringify(payload), key, {
        iv: iv,
    }).toString();
}