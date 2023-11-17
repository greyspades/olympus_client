import React, { useContext, useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Icon, Paper } from "@mui/material";
import { Notifier } from "./notifier";
import { NotifierContext } from "@/context/notifier.context";
import { ComponentContext } from "@/context/component.context";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { notifierState, notifierDispatch } = useContext(NotifierContext);
  const { state, dispatch } = useContext(ComponentContext);
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if(!state.user) {
      let user = sessionStorage.getItem("user")
      dispatch({type: "SET_USER", payload: {user: JSON.parse(user)}})
    }
  }, [])

  const signUserOut = () => {
    sessionStorage.clear()
    router.push("/")
  };

  const notifySignout = () => {
    notifierDispatch({
      type: "CREATE",
      payload: {
        code: 200,
        title: "Sign out?",
        content: "Are you sure you want to sign out?",
        next: {title: "Sign out", action: signUserOut},
        open: true,
      },
    });
  };
  return (
    <div>
      <Notifier
        title={notifierState?.title}
        content={notifierState?.content}
        open={notifierState?.open}
        next={notifierState.next}
        code={notifierState?.code}
      />
      <AppBar position="fixed" className="bg-white text-black max-h-[60px]">
        <Toolbar className="flex flex-row justify-between">
          <img
            className="grid col-span-1"
            src="/logo.png"
            width={100}
            height={100}
            alt={"/"}
          />
         
          {showInfo && (
             <Paper className="w-[400px] h-[180px] p-2 ml-auto flex flex-col mt-[200px] text-black text-[14px] gap-2">
             <div>Full Name: {state?.user?.FullNameDot.replace(".", " ")}</div>
             <div>Employee No: {state?.user?.Employee_No}</div>
             <div>Bu Code: {state?.user?.Bu_Code}</div>
             <div>JF Name: {state?.user?.JF_Name}</div>
             <button onClick={notifySignout} className="mt-[20px] text-white bg-green-700 rounded-md h-[45px]">
           Sign Out
           </button>
         </Paper>
          )}
          <IconButton onClick={() => setShowInfo(!showInfo)}>
            <AccountCircleIcon className="w-[50px] h-[50px]" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
