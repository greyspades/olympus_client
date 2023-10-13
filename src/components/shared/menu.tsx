import { Button } from '@mui/base'
import React from 'react'
import { Slider } from '../slider/slider'
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { Divider } from '@mui/material';
import { Articles } from '../article/article';

interface MenuItem {
    index: number,
    name: string,
    component: React.ReactNode
}

type MenuProps = {
    changeMenu: (index: number) => void
}

export const Menu = ({changeMenu}: MenuProps) => {
  const items: MenuItem[] = [
    {
        index: 0,
        name: "Slider",
        component: <Slider />
    },
    {
        index: 1,
        name: "Article",
        component: <Articles />
    },
    {
        index: 2,
        name: "Footer",
        component: <Slider />
    }
  ]

  const displayMenuItems = () => {
    return items.map((item: MenuItem, idx: number) => (
        <Button onClick={() => changeMenu(idx)} key={idx} className='flex flex-row place-items-center justify-between bg-green-700 rounded-md pr-6 text-white'>
            <SlideshowIcon className='text-white w-[40px] h-[40px]' /> <p>{item.name}</p>
        </Button>
    ))
  }

  return (
    <div className='flex flex-col bg-white h-[95vh] gap-10 p-4 fixed'>
        {displayMenuItems()}
    </div>
  )
}