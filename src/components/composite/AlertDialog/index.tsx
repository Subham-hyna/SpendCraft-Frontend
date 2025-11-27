import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/atomic/alert-dialog"
  import { Button } from "@/components/atomic/button"
  import { ReactNode } from "react"
  import { Loader2 } from "lucide-react"

  interface AlertDialogProps {
    trigger?: ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    cancelLabel?: string;
    onAction: () => void | Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
    variant?: "default" | "destructive";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
  
  export function AlertDialogComponent({
    trigger,
    title,
    description,
    actionLabel = "Continue",
    cancelLabel = "Cancel",
    onAction,
    onCancel,
    loading = false,
    variant = "default",
    open,
    onOpenChange,
  }: AlertDialogProps) {
    const handleAction = async () => {
      await onAction();
    };

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {trigger && (
          <AlertDialogTrigger asChild>
            {trigger}
          </AlertDialogTrigger>
        )}
        <AlertDialogContent className="dark:bg-gray-800 flex flex-col gap-4">
          <AlertDialogHeader className="text-left">
            <div className="flex items-center gap-3">
              <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
            <AlertDialogCancel onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={loading}
              className={variant === "destructive" ? "bg-destructive text-white hover:bg-destructive/90" : ""}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  // Keep the old export for backward compatibility if needed
  export function AlertDialogDemo() {
    return (
      <AlertDialogComponent
        trigger={<Button variant="outline">Show Dialog</Button>}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        onAction={async () => {
          console.log("Action executed");
        }}
      />
    )
  }
  