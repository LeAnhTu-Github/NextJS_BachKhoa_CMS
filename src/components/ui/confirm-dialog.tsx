import React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  hiddenConfirm?: boolean;
  confirmButtonStyle?: string;
  isLoading?: boolean;
  large?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
  onCancel,  
  large,     
  confirmText = "Xác nhận",
  cancelText = "Đóng",
  hiddenConfirm,
  confirmButtonStyle = "bg-[#A2212B] text-white hover:bg-[#7C1C25] max-w-[100px]",
  isLoading,
}: ConfirmDialogProps) => {
  const handleCancel = () => {
    onOpenChange(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const widthClass = large
    ? "md:w-[90%] md:max-w-[1200px]"
    : "md:w-[700px] md:max-w-[700px]";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            showCloseButton={false}
            className={`max-w-none p-0 rounded-lg border-none max-h-[90vh] w-9/10 ${widthClass} md:mx-auto overflow-auto`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div>
                <DialogHeader className="bg-[#A52834] border-none rounded-t-lg px-8 py-4">
                  <DialogTitle className="text-white text-xl text-left font-semibold">
                    {title}
                  </DialogTitle>
                  <DialogClose
                    className="absolute right-6 top-3 text-white text-2xl"
                    aria-label="Đóng"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && handleCancel()
                    }
                  >
                    <XIcon />
                  </DialogClose>
                </DialogHeader>
                <div className="px-4 py-4">
                  <div className="text-[16px] text-gray-600 ">{message}</div>
                </div>
                <hr className="m-0 p-0" />
                <DialogFooter className="bg-white border-none rounded-b-lg px-2 py-2 flex flex-row justify-end md:justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel} className="max-w-[100px] flex items-center gap-2">
                    {cancelText}
                    <i className="mdi mdi-close text-xs"></i>
                  </Button>
                  {!hiddenConfirm && (
                    <Button 
                      onClick={handleConfirm} 
                      className={confirmButtonStyle}
                      disabled={isLoading}
                    >
                      {confirmText}
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default ConfirmDialog;