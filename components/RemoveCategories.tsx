import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const RemoveCategoryDialog = ({ open, onClose, onRemoveCategory }) => {
  const [categoryToRemove, setCategoryToRemove] = useState('');

  const handleCategoryChange = (event) => {
    setCategoryToRemove(event.target.value);
  };

  const handleRemoveCategory = () => {
    onRemoveCategory(categoryToRemove); // Pass onClose to handleRemoveCategory
    onClose();
    setCategoryToRemove('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove Category</DialogTitle>
      <DialogContent>
        <TextField
          label="Category to Remove"
          value={categoryToRemove}
          onChange={handleCategoryChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleRemoveCategory} color="primary">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveCategoryDialog;


