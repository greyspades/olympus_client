import React, { useContext } from "react";
import { AppBar, Toolbar } from "@mui/material";
import { Notifier } from "./notifier";
import { NotifierContext } from "@/context/notifier.context";

export const Navbar = () => {
  const { notifierState, notifierDispatch } = useContext(NotifierContext);
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
        <Toolbar className="flex flex-row">
          <img
            className="grid col-span-1"
            src="/logo.png"
            width={100}
            height={100}
            alt={"/"}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};
