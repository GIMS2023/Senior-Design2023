import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const CategoryInput = ({ setNewCategory, categories, addCategory}) => {
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  React.useEffect(() => {
    setCategoryList(categories);
  } , [categories]);

  
  const handleInputChange = (event) => {
    setCategory(event.target.value);
    setNewCategory(event.target.value);
  };

  const handleAddCategory = () => {
    addCategory();
    setCategory('');
  };

  return (
    <div>
      <TextField onKeyDown={(e) => e.stopPropagation()}
        fullWidth
        label="Add Category"
        value={category}
        onChange={handleInputChange}
      />
      <Button variant="contained" onClick={handleAddCategory}>
        Add
      </Button>
    </div>
  );
};

export default CategoryInput;