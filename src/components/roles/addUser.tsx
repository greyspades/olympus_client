import { ComponentContext } from '@/context/component.context';
import { NotifierContext } from '@/context/notifier.context';
import React, { useContext, useState } from 'react'
import { Paper } from '@mui/material';
import { CustomInput } from '../shared/customInput';

export const AddUser = () => {
    const { state, dispatch } = useContext(ComponentContext);
    const { notifierState, notifierDispatch } = useContext(NotifierContext);
    const [search, setSearch] = useState<string>("")

    const handelSearch = (e: any) => {

    }
  return (
    <div className='flex justify-center'>
        <Paper>
            <div>
                <h3 className='text-[20px]'>
                    Add new User
                </h3>
            </div>
            <div>
            {/* <CustomInput
                    value={search}
                    onChange={handelSearch}
                    placeHolder="Search for an employee"
                    component="text"
                    error={formik.errors.header}
                    classes="h-[40px] w-[100%] bg-gray-100 rounded-md no-underline px-4 shadow-md"
                  /> */}
            </div>
        </Paper>
    </div>
  )
}