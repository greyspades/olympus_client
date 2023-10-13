import { ComponentContext } from '@/context/component.context';
import { NotifierContext } from '@/context/notifier.context';
import React, { useContext, useState } from 'react'
import { Modal, Paper, IconButton } from '@mui/material';
import { ArticlePreview } from './articlePreview';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PreviewProps {
    close:() => void
}
export const Preview = ({close}: PreviewProps) => {
    const { state, dispatch } = useContext(ComponentContext);
    const [open, setOpen] = useState<boolean>(true)
    const { notifierState, notifierDispatch } = useContext(NotifierContext);
    
    const closeModal = () => {
        // dispatch({type: "SWITCH_COMPONENT", payload: {index: 1, title: "ARTICLE_SKELETON"}})
        close()
        setOpen((prev) => !prev)
    }
  return (
    <div>
        <Modal
        open={open}
        onClose={closeModal}
        className="flex justify-center"
        >
            <Paper className='w-[97%] h-[97%] mt-[30px] overflow-y-scroll p-4 bg-gray-300'>
                <div>
                    <IconButton onClick={closeModal}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
                <div className='grid grid-cols-8 gap-6'>
                    <div className='grid col-span-4 shadow-lg'>
                        <ArticlePreview article={state?.articles?.section1} />
                    </div>
                    <div className='grid col-span-4 grid-rows-4 gap-6'>
                        <div className='grid row-span-2 shadow-lg'>
                        <ArticlePreview article={state?.articles?.section2} />
                        </div>

                        <div className='grid row-span-2 shadow-lg'>
                        <ArticlePreview article={state?.articles?.section3} />
                        </div>
                    </div>
                </div>
            </Paper>
        </Modal>
    </div>
  )
}