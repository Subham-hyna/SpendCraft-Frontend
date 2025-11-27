'use client';
import Header2 from '@/components/composite/Header2/Header2'
import Layout from '@/components/composite/layout'
import CategoryCard from '@/components/composite/CategoryCard'
import CategorySkeleton from '@/components/composite/Skeleton/CategorySkeleton'
import { Copy, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Category } from '@/types/apiResponse';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteCategory, getCategories } from '@/store/thunks/categorySlice';
import CreateUpdateCategory from '@/components/composite/Drawer/CreateUpdateCategory';
import { AlertDialogComponent } from '@/components/composite/AlertDialog';

const CategoryScreen = () => {
  const { categories } = useAppSelector((state) => state.categories);
  const dispatch = useAppDispatch();
  const { fetch_category_loading, delete_category_loading } = useAppSelector((state) => state.categories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditDrawerOpen(true);
  };

  const handleEditClose = () => {
    setEditingCategory(null);
    setEditDrawerOpen(false);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      await dispatch(deleteCategory(categoryToDelete._id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      // Refetch categories after delete
      dispatch(getCategories());
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <Layout isHeaderVisible={false}>
        <Header2 title="Categories" description="Manage your expense categories" />
        <div className="px-4 sm:px-6 -mt-7 pb-24">
        {/* Add New Category Button */}
        <CreateUpdateCategory 
        className="w-full"
        trigger={<div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm mb-6 cursor-pointer">
          <Plus size={20} strokeWidth={1.5} />
          <span className="font-light">Add New Category</span>
        </div>} />
        <div className="space-y-4">
        {fetch_category_loading ? (
          <>
            {[1, 2, 3].map((item) => (
              <CategorySkeleton key={item} />
            ))}
          </>
        ) : (
          categories.map((category) => (
            <CategoryCard 
              key={category._id} 
              title={category.name} 
              subcategories={category.subcategories} 
              icon={category.icon} 
              bgColor={category.color}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))
        )}
        </div>

        {/* Edit Category Drawer */}
        <CreateUpdateCategory
          category={editingCategory}
          open={editDrawerOpen}
          onOpenChange={(isOpen) => {
            setEditDrawerOpen(isOpen);
            if (!isOpen) {
              setEditingCategory(null);
            }
          }}
          onClose={handleEditClose}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialogComponent
          title="Delete Category"
          description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and will remove all associated subcategories.`}
          actionLabel="Delete"
          cancelLabel="Cancel"
          onAction={handleDelete}
          onCancel={handleDeleteCancel}
          loading={delete_category_loading}
          variant="destructive"
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
        </div>
    </Layout>
  )
}

export default CategoryScreen