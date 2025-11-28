"use client"
import { X, Plus } from 'lucide-react'
import { Button, buttonVariants } from '@/components/atomic/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/atomic/drawer'
import { cn } from '@/lib/utils'
import React, { useState, useEffect } from 'react'
import { Category } from '@/types/apiResponse'
import { useAppDispatch, useAppSelector } from '@/store'
import { createCategory, updateCategory, getCategories } from '@/store/thunks/categoryThunks'
import { Spinner } from '@/components/atomic/spinner'
import { Input } from '@/components/atomic/input'
import { Label } from '@/components/atomic/label'
import { toast } from 'react-hot-toast'

interface CreateUpdateCategoryProps {
  trigger?: React.ReactNode;
  className?: string;
  category?: Category | null;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateUpdateCategory = ({ trigger, className, category, onClose, open: controlledOpen, onOpenChange }: CreateUpdateCategoryProps) => {
  const dispatch = useAppDispatch();
  const { create_update_category_loading } = useAppSelector((state) => state.categories);
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  const [selectedIcon, setSelectedIcon] = useState('📦');
  const [selectedColor, setSelectedColor] = useState('#FEF3E2');
  const [subcategories, setSubcategories] = useState(['']);
  const [categoryName, setCategoryName] = useState('');

  const isEditMode = !!category;

  // Initialize form when category is provided or drawer opens
  useEffect(() => {
    if (category && open) {
      setCategoryName(category.name);
      setSelectedIcon(category.icon);
      setSelectedColor(category.color);
      setSubcategories(category.subcategories.length > 0 
        ? category.subcategories.map(sub => sub.name)
        : ['']
      );
    } else if (!category && open) {
      // Reset form for create mode
      setCategoryName('');
      setSelectedIcon('🍔');
      setSelectedColor('#FEF3E2');
      setSubcategories(['']);
    }
  }, [category, open]);

  const icons = ['🍔', '🚗', '🛍️', '⚡', '🎮', '⚕️', '📚', '✈️', '🏠', '💼', '🎵', '🎨', '🧮', '⚽', '⭐'];
  
  const colors = [
    '#FEF3E2', '#E8F1FF', '#F3E8FF', '#FEFCE8', '#d8f1ff',
    '#FCE7F3', '#FFE4E6', '#DCFCE7', '#A7F3D0', '#E0E7FF'
  ];

  const addSubcategory = () => {
    setSubcategories([...subcategories, '']);
  };

  const updateSubcategory = (index: number, value: string) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index] = value;
    setSubcategories(newSubcategories);
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      return;
    }

    const payload = {
      name: categoryName.trim(),
      color: selectedColor,
      icon: selectedIcon,
      subcategories: subcategories.filter(sub => sub.trim()).map(sub => sub.trim())
    };

    try {
      if (isEditMode && category) {
        await dispatch(updateCategory({
          _id: category._id,
          data: payload
        })).unwrap();
      } else {
        await dispatch(createCategory(payload)).unwrap();
      }
      
      // Refresh categories
      await dispatch(getCategories());
      
      // Close drawer
      setOpen(false);
      if (onClose) {
        onClose();
      }
    } catch (err: any) {
        const errorMessage = err?.payload?.response?.data?.message || 
        err?.response?.data?.message || 
        err?.message || 
        'Failed to sign in. Please try again.';
        toast.error(errorMessage);
    }
  };
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {trigger && <DrawerTrigger className={className}>{trigger}</DrawerTrigger>}
      <DrawerContent className="dark:bg-gray-800">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{isEditMode ? 'Edit Category' : 'Create Category'}</DrawerTitle>
        </DrawerHeader>
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Content */}
          <div className="p-6 space-y-8 overflow-y-auto flex-1">
            {/* Category Name */}
            <div>
              <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Category Name *
              </Label>
              <Input
                type="text"
                style={{ borderRadius: '8px' }}
                placeholder="e.g., Food"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Choose Icon */}
            <div>
              <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Choose Icon *
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                      selectedIcon === icon
                        ? 'bg-purple-200 dark:bg-purple-600 scale-95'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Color */}
            <div>
              <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Choose Color *
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`aspect-square rounded-xl transition-all ${
                      selectedColor === color
                        ? 'ring-1 ring-purple-500 dark:ring-purple-400 ring-offset-2 dark:ring-offset-gray-800 scale-95'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Subcategories
              </Label>
              <div className="space-y-3">
                {subcategories.map((sub, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="text"
                      style={{ borderRadius: '8px' }}
                      placeholder={`Subcategory ${index + 1}`}
                      value={sub}
                      onChange={(e) => updateSubcategory(index, e.target.value)}
                      className="flex-1 px-4 py-5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 focus:border-transparent transition-all"
                    />
                    {subcategories.length > 1 && (
                      <button
                        onClick={() => removeSubcategory(index)}
                        className="text-gray-300 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-2"
                      >
                        <X size={20} strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addSubcategory}
                  className="w-full py-3 border-2 border-dashed bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center gap-2 font-light"
                >
                  <Plus size={18} strokeWidth={1.5} />
                  Add Subcategory
                </button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Preview
              </Label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: selectedColor }}
                >
                  {selectedIcon}
                </div>
                <div>
                  <p className="font-light text-gray-900 dark:text-gray-100">
                    {categoryName || 'Category Name'}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {subcategories.filter(s => s.trim()).length} subcategories
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-3 w-full">
              <DrawerClose 
                className={cn(buttonVariants({ variant: "outline" }), "w-full flex-1")}
                disabled={create_update_category_loading}
              >
                Cancel
              </DrawerClose>
              <Button 
                className="flex-1 bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={create_update_category_loading || !categoryName.trim()}
              >
                {create_update_category_loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="w-4 h-4" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  isEditMode ? 'Update Category' : 'Add Category'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateUpdateCategory