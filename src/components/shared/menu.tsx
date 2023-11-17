import { Button } from '@mui/base'
import React, { useContext, useEffect, useState } from 'react'
import { Slider } from '../slider/slider'
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { Divider, MenuItem, Menu, IconButton } from '@mui/material';
import { Articles } from '../article/article';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ComponentContext } from '@/context/component.context';

interface MenuItem {
    index: string,
    name: string,
    hasChild: boolean
    expanded?: boolean,
    subItems?: MenuItem[]
    // component: React.ReactNode
}

type MenuProps = {
    changeMenu: (index: string) => void,
}

export const SideMenu = ({changeMenu}: MenuProps) => {
  const { state, dispatch } = useContext(ComponentContext);
  const [parentIndex, setParentIndex] = useState<string>("1")
  const [childIndex, setChildIndex] = useState<string>("1.1")

  const[menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      index: "1",
      name: "HomePage",
      hasChild: true,
      expanded: false,
      subItems: [
        {
          index: "1.1",
          name: "Slider",
          hasChild: true,
          expanded: false,
          subItems: [
            {
              index: "1.1.1",
              name: "Sliders",
              hasChild: false
            },
            {
              index: "1.1.2",
              name: "Add Slider",
              hasChild: false
            },
          ]
        },
        {
          index: "1.2",
          name: "Article Intro",
          hasChild: true,
          expanded: false,
          subItems: [
            {
              index: "1.2.1",
              name: "Articles",
              hasChild: false
            },
            {
              index: "1.2.2",
              name: "Add Articles",
              hasChild: false
            },
          ]
        },
        {
          index: "1.3",
          name: "Video Section",
          hasChild: true,
          expanded: false,
          subItems: [
            {
              index: "1.3.1",
              name: "Videos",
              hasChild: false
            },
            {
              index: "1.3.2",
              name: "Add Video",
              hasChild: false
            },
          ]
        }
      ]
  },
  {
      index: "2",
      name: "Page Layout",
      expanded: false,
      hasChild: true,
      subItems: [
        {
          index: "2.2",
          name: "Article Layout",
          hasChild: true,
          expanded: false,
          subItems: [
            {
              index: "2.2.1",
              name: "Articles",
              hasChild: false
            },
            {
              index: "2.2.2",
              name: "New Article",
              hasChild: false
            },
            // {
            //   index: "2.2.3",
            //   name: "Article Page",
            //   hasChild: false
            // }
          ]
        },
        // {
        //   index: 6,
        //   name: "Slider",
        //   hasChild: false
        // }
      ]
  },
  {
      index: "3",
      name: "Roles",
      hasChild: true,
      expanded: false,
      subItems: [
        {
          index: "3.1",
          name: "Add User",
          hasChild: false
        },
        {
          index: "3.2",
          name: "Edit Users",
          hasChild: false
        },
        // {
        //   index: "2.2.3",
        //   name: "Article Page",
        //   hasChild: false
        // }
      ]
  }
  ])

  useEffect(() => {
    console.log(state.index)
  }, [state.index])

  const handleMenuChange = (index: number, code: string,  nestedIndex?: number) => {
    if(nestedIndex == null) {
      setParentIndex(code)
      var update = menuItems.map((item: MenuItem, idx: number) => {
        if(idx == index) {
          item.expanded = !item.expanded
        }
        return item
      })
      setMenuItems(update)
    } else {
      setChildIndex(code)
      var update = menuItems.map((item: MenuItem, idx: number) => {
        if(idx == index) {
          item?.subItems.map((subs: MenuItem, subIndex: number) => {
            if(nestedIndex == subIndex) {
              subs.expanded = !subs.expanded
            }
          })
        }
        return item
      })
      setMenuItems(update)
    }
  }

  const displayMenuItems = () => {
    return menuItems.map((item: MenuItem, idx1: number) => (
        <div  key={idx1}>
          <div className="flex flex-row justify-between place-items-center">
          {item.hasChild ? <div className={parentIndex == item.index ? 'bg-green-700 text-white p-1 w-[100%] rounded-md text-[14px] text-center' : ''}>{item.name}</div> : <Button  onClick={() =>changeMenu(item.index)}>{item.name}</Button>}
          {item?.hasChild && (
            <IconButton onClick={() => handleMenuChange(idx1,item.index)}>
            {item.expanded ?
            <ArrowDropUpIcon />
          : 
            <ArrowDropDownIcon />
          }
          </IconButton>
          )}
        </div>
        <div className='flex flex-col gap-6 mt-4 ml-[20px]'>
        {item.expanded ?
        item.subItems?.map((sub: MenuItem, idx2: number) => (
          <div key={idx2}>
            {sub.hasChild && (
              <div className='flex flex-row justify-between place-items-center'>
                <div className={childIndex == sub.index ? 'bg-green-700 text-white p-1 rounded-md w-[100%]- text-[14px] text-center' : ''}>
                  {sub.name}
                </div>
                <IconButton onClick={() => handleMenuChange(idx1, sub.index, idx2)}>
            {sub.expanded ?
            <ArrowDropUpIcon />
          : 
            <ArrowDropDownIcon />
          }
          </IconButton>
              </div>
            )}
            {!sub.hasChild && sub.name != "Footer" && (
              <div>
                 <Button className={childIndex == sub.index ? 'bg-green-700 text-white p-1 rounded-md w-[100%] text-[14px] text-center' : ''} onClick={() =>changeMenu(sub.index)}>
                {sub.name}
              </Button>
              <Divider variant='fullWidth' />
              </div>
            )}
              <div className='flex flex-col gap-10 ml-[40px] mt-4'>
              {sub.expanded ? sub.subItems?.map((sub2: MenuItem, idx3: number) => (
              <div key={idx3}>
                <Button
                 className={state.index == sub2.index ? "bg-green-700 text-white p-1 rounded-md w-[100%] text-[14px] text-center" : ""}
                  onClick={() =>changeMenu(sub2.index)}                  >
                  {sub2.name}
                </Button>
                <Divider variant='fullWidth' />
              </div>
            )) : null}
              </div>
          </div>
        ))
        : null}
        </div>
        </div>
    ))
  }

  return (
    <div className='flex flex-col bg-white h-[95vh] gap-4 p-4 fixed w-[200px]'>
        {displayMenuItems()}
    </div>
  )
}