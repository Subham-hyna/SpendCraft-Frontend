import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/atomic/drawer"
import { Button, buttonVariants } from '@/components/atomic/button'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const CreateUpdateExpense = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
      <div className="p-6">
        <DrawerHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-light text-gray-900">Add Expense</DrawerTitle>
            <DrawerClose className="text-gray-400 hover:text-gray-600 transition-colors p-2">
              <X size={24} strokeWidth={1.5} />
            </DrawerClose>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateUpdateExpense