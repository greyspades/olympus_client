import React, { ChangeEvent, useState } from "react";
import { Button, FormControlLabel, Paper, Switch } from "@mui/material";
import { Field } from "formik";
import { CustomInput } from "../shared/customInput";
import { AddVideoValidation } from "@/helpers/validation";
import { useFormik } from "formik";
// import video from "./video.mp4";

export const AddVideo = () => {
  const [videoSource, setVideoSource] = useState(null);
  const [videoFile, setVideoFile] = useState<File>();

  const formik = useFormik({
    initialValues: {
      video: null,
      name: "",
      active: false,
    },
    validationSchema: AddVideoValidation,
    onSubmit: (values) => {
      // Handle form submission if validation passes
      console.log(values);
      console.log("Form submitted with values:", values);
    },
  });

  const handleVideoUpload = (
    event: any,
    change: (e: string | ChangeEvent<any>) => void
  ) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoURL = URL.createObjectURL(selectedFile);
      setVideoSource(videoURL);
      setVideoFile(selectedFile);
      change("video");
      formik.setFieldValue("video", selectedFile);
      
    }
  };

  return (
    <div>
      <Paper className="w-[97%] h-[100%] p-4 mt-[20px]">
        <div>
          <h2 className="text-[26px] font-medium">Add new video</h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-[20px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <CustomInput
                value={formik.values.name}
                onChange={(e: any) =>
                  formik.setFieldValue("name", e.target.value)
                }
                placeHolder="Video tag"
                component="text"
                error={formik.errors.name}
                classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
              />
              <CustomInput
                name="video"
                type="file"
                onChange={(e: any) =>
                  formik.setFieldValue("video", e.target.files[0])
                }
                placeHolder="Video File"
                component="text"
                error={formik.errors.video}
                classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
              />
            </div>
            <div className="flex flex-col">
            <FormControlLabel
              control={
                <Switch
                  value={formik.values.active}
                  name="active"
                  color="primary"
                  checked={formik.values.active}
                  onChange={(e) => formik.setFieldValue("active", !formik.values.active)}
                />
              }
              label="Make active"
      />

              <div>
                {videoSource && (
                  <video width="320" height="240" controls autoPlay>
                  <source src={videoSource} type="video/mp4" />
                  Your browser does not support the video tag.
                  </video>  
                )}
              </div>
              <Button
                type="submit"
                className="mt-[20px] bg-green-700 h-[40px] w-[250px] capitalize text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};
