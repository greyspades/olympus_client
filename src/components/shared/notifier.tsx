import React, { useContext } from "react";
import { Button, Divider, Modal } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { NotifierContext } from "@/context/notifier.context";

interface NotifierProps {
  code: number;
  open: boolean;
  content: string;
  title?: string;
  next?: {
    title: string;
    action: () => void;
  };
}

export const Notifier = ({
  content,
  title,
  next,
  open,
  code,
}: NotifierProps) => {
    const { notifierState, notifierDispatch } = useContext(NotifierContext);
  return (
    <div>
      <Modal open={open} className="flex justify-center">
        <div className="h-[200px] w-[300px] bg-green-100 p-4 rounded-md mt-[40px]">
          <div className="flex flex-row gap-5 capitalize place-items-center">
            {code == 200 ? (
              <DoneAllIcon className="w-[40px] h-[40px] text-green-700" />
            ) : (
              <ReportProblemIcon className="w-[40px] h-[40px] text-green-700" />
            )}
            <p className="text-black text-[20px]">{title}</p>
          </div>
          <Divider className="bg-green-700 h-[1px]" />
          
          <div className="bg-white rounded-md h-auto capitalize mt-[20px] p-3">{content}</div>
          <div className="mt-[10px] flex gap-5">
            <Button onClick={() => notifierDispatch({type: "CLOSE", payload: null})} className="text-white bg-green-700 h-[30px] capitalize ml-auto">
                Cancel
            </Button>
          {next && (
            <Button onClick={() => next?.action()} className="text-white bg-green-700 h-[30px] capitalize">
                {next?.title}
            </Button>
          )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
