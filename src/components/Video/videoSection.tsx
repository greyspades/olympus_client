import React from 'react'
import { Paper } from '@mui/material'
import { Formik } from 'formik'

export const VideoSection = () => {
  return (
    <div>
        <Paper className='w-[97%] h-[100%] p-4 mt-[20px]'>
          <form>
            <Formik initialValues={{name: ""}} onSubmit={(value) => {
              
            }}>

            </Formik>
          </form>
        </Paper>
    </div>
  )
}