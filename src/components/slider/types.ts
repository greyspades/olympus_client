export type Slide = {
    id?: string,
    // bgType: string,
    h1Text: string;
    pText: string;
    isActionBtn?: boolean;
    file?: File;
    image?: any,
    imageBytes?: string,
    actionBtn?: ActionButton,
    creationDate?: string,
    actionString?: string,
    url?: string,
    display?: string,
    active?: boolean
  };
  
export type ActionButton = {
      display: string,
      url: string
}