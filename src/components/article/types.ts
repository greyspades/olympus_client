
export type Article = {
    id?: string,
    paragraph: string,
    header: string,
    isActive: any,
    image: any,
    creationDate?: string,
    title: string,
    imageBytes?: string,
    sameImage?: boolean,
    avatar?: any,
    author?: string,
    uname?: string,
    section?: "SEC1" | "SEC2" | "SEC3"
}