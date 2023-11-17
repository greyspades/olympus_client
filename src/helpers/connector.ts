
export const getAsync = async(url: string): Promise<any> => {
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url,
            method: "GET"
        })
    };
    const request = await fetch("/api/connect", options)
    const response = await request.json()
    console.log(response)
    return response;
}

export const postAsync = async(url: string, body: {[key: string]: any}): Promise<any> => {
    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url,
            method: "POST",
            body: body
        })
    };
    const request = await fetch("/api/connect", options)
    const response = await request.json()
    console.log("connector")
    console.log(response)
    return response;
}