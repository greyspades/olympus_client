export const postAsync = (url: string, body: {[key: string]: any}) => {
    
}

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

    return response;
}