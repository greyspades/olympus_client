
export type Article = {
    id?: string,
    paragraph: string,
    header: string,
    isActive: any,
    image: any,
    creationDate?: string,
    title: string,
    imageBytes?: string,
    section?: "SEC1" | "SEC2" | "SEC3"
}