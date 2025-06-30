import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { Button } from "./button";
import { useState } from "react";

interface CustomDialogProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  buttonLabels?: {
    cancel?: string;
    submit?: string;
  };
}

export function CustomDialog({
  title,
  description,
  trigger,
  children,
  onSubmit = () => {},
  onCancel = () => {},
  buttonLabels = {
    cancel: "Cancel",
    submit: "Submit",
  },
}: CustomDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer" asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 max-h-[calc(75vh)] overflow-y-auto">{children}</div>
        <DialogFooter className="flex gap-2">
          {buttonLabels.cancel && (
            <DialogClose asChild>
              <Button variant="destructive" onClick={onCancel}>
                {buttonLabels?.cancel || "Cancel"}
              </Button>
            </DialogClose>
          )}
          <Button
            onClick={() => {
              onSubmit();
              setOpen(false);
            }}
          >
            {buttonLabels?.submit || "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
