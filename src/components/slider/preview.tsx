import React, { useState, useContext, useEffect } from 'react';
import { Paper, Button } from '@mui/material';
import { ComponentContext } from '@/context/component.context';
import { Slide } from './types';

interface PreviewInterface {
    close: () => void,
    slide: Slide
}

export const Preview = ({close, slide}: PreviewInterface) => {
    const {state, dispatch} = useContext(ComponentContext)

    // useEffect(() => {
    //     console.log(slide)
    // },[])
    const closePreview = () => {
        dispatch({type: "PREVIEW", payload: {index: 1, title: "slider"}})
        close()
    }

    const renderImage = () => {
        if(slide?.image) {
            return <img className='h-[600px] w-[100%]' src={URL.createObjectURL(slide?.image)} />
        } else {
            return <img className='h-[600px] w-[100%]' src={`http://localhost:5078/api/Slider/image/${slide?.id}`} alt="/" />
        }
    }

  return (
    <div>
        <Paper className='h-[600px] w-[100%]'>
            <Button onClick={closePreview}>
                Close
            </Button>
            <div className='relative'>
                <div>
                    {renderImage()}
                </div>
                <div className='absolute top-[160px] left-[40px] text-[60px] text-white font-bold break-all w-[50%] leading-8'>
                    {slide.h1Text}
                </div>
                <div className='absolute top-[270px] left-[40px] text-[24px] text-white font-bold break-all w-[50%] leading-8'>
                    <p>{slide.pText}</p>
                <Button
                  href={slide?.actionBtn.url}
                  className="bg-orange-600 h-[60px] text-white mt-[40px] px-10"
                >
                  {slide?.actionBtn.display}
                </Button>
                </div>
                {/* {slide?.actionBtn && (
                <div className='absolute top-[350px] left-[20px] text-[24px] text-white font-bold break-all w-[50%] leading-3'>
                <Button
                  href={slide?.actionBtn.url}
                  className="bg-orange-600 h-[60px] text-white"
                >
                  {slide?.actionBtn.display}
                </Button>
                   </div>
                )} */}
            </div>
        </Paper>
    </div>
  )
}
