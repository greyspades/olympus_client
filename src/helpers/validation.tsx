import * as Yup from 'yup';

export const AddSliderValidation = Yup.object().shape({
    h1Text: Yup.string().required('This field is required'),
    pText: Yup.string().required('This field is required'),
    sameImage: Yup.boolean(),
  image: Yup.mixed()
  .test('fileType', 'Invalid file type', (value: any) => {
    if (!value) return true; // No file selected
    return ['image/jpeg', 'image/png'].includes(value.type);
  })
  .test('fileSize', 'File size too large', (value: any) => {
    if (!value) return true; // No file selected
    return value.size <= 502400; // 100 KB
  })
  .when("sameImage", {
    is: false,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  })
});

export const AddArticleValidation = Yup.object().shape({
  title: Yup.string().required("This field is required"),
  paragraph: Yup.string().required("This field is required"),
  header: Yup.string().required("This field is required"),
  sameImage: Yup.boolean(),
  image: Yup.mixed()
  .test('fileType', 'Invalid file type', (value: any) => {
    if (!value) return true; // No file selected
    return ['image/jpeg',"image/jpg"].includes(value.type);
  })
  .test('fileSize', 'File size too large', (value: any) => {
    if (!value) return true; // No file selected
    return value.size <= 502400; // 100 KB
  })
  .when("sameImage", {
    is: false,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  })
})