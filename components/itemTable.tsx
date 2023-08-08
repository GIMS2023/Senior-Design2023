import React, { useState, useRef,useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Menu,
  FormControlLabel,
  Checkbox,
  DialogContentText,
  
} from '@mui/material';
import Searchbar from './SearchBar';
import LogoutButton from './Logout';
import CategoryInput from './CategoryInputs';
import CustomFileSelector from './file_selector';
import ImagePreview from './ImagePreview';
import ViewItemImages from './ViewItemImages';
import CheckedOut from './CheckedOut';
import RemoveCategoryDialog from './RemoveCategories';

const TableExample = (props) => {
  //Adds id to each item
  for (var i = 0; i < props.items.length; i++) {
    props.items[i].id = props.items[i]._id;
    if (props.items[i].images[0] != null) {
      if (props.items[i].images[0].src != null) {
        if (props.items[i].images[0].src.data != null) {
          props.items[i].images = 'data:image/jpeg;base64,' + Buffer.from(props.items[i].images[0].src.data).toString('base64');
      
        }
      }
    }
  }

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', description: '',serial_number: '', images: [], purchase_price:'', });
  const [editItemId, setEditItemId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] = useState<HTMLAnchorElement | null>(null);
  const [profilePicture, setProfilePicture] = useState<Blob | MediaSource|null>(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryToRemove, setCategoryToRemove] = useState('');
  const [imageIndexMap, setImageIndexMap] = useState({});
  const [profilePictures, setProfilePictures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [blobImages, setBlobImages] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [itemFilter, setItemFilter] = useState('');
  const [openRemoveCategoryDialog, setOpenRemoveCategoryDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState([]);



  const styles = {
    // ... (your existing styles)
    imageContainer: {
      cursor: 'pointer',
    },
  };

  //Handles the number of items displayed per page
  const itemsPerPage = 10;
  const totalPages = Math.ceil(props.totalItems / itemsPerPage);

  const handleNextPage = () => {
     if (currentPage < totalPages) {
       getItems('next');
     }
   };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      getItems('prev');
    }
   };
  
  React.useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  React.useEffect(() => {
    setCategories(props.categories);
  }, [props.categories]);

  // console.log(items);

  async function blobToBase64(blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    }
    );
  }

  async function addItem(newItem) {
    newItem.userId = props.userId;

    const bufferedImages : Buffer[] = [];
     
    for (var i = 0; i < blobImages.length; i++) {
      const base64String = await blobToBase64(blobImages[i]);
      bufferedImages.push(Buffer.from(base64String.split(',')[1], 'base64'));
    }

    newItem.images = bufferedImages;

    newItem.category = selectedCategory;

    const response = await fetch(`/api/addItem`, {
      method: 'POST',
      body: JSON.stringify(newItem),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const data = await response.json();

    if (data.thumbnail != null) {
      data.item.images = 'data:image/jpeg;base64,' + Buffer.from(data.thumbnail.src.data.data).toString('base64');
    }

    setItems((prevItems) => [...prevItems, { ...data.item, id: data.item._id } as never]);

    setNewItem({ name: '', category: '', description: '',serial_number: '', images: [],purchase_price:'' });
    setSelectedCategory('');
    setProfilePicture(null);
    setOpenDialog(false);
    setImages([]);
    setBlobImages([]);
    setSelectedFileNames([]);

  }

  async function removeItem(itemId) {
    const response = await fetch(`/api/updateItem`, {
      method: 'POST',
      body: JSON.stringify({ method: 'remove', itemId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    setItems((prevItems) => prevItems.filter((item : any) => item.id !== itemId));
  }

  async function editItem(itemId) {

    console.log(newItem);

    const bufferedImages : Buffer[] = [];

    for (var i = 0; i < blobImages.length; i++) {
      const base64String = await blobToBase64(blobImages[i]);
      bufferedImages.push(Buffer.from(base64String.split(',')[1], 'base64'));
    }

    newItem.images = bufferedImages as never[];

    newItem.category = selectedCategory;

    const response = await fetch(`/api/updateItem`, {
      method: 'POST',
      body: JSON.stringify({ method: 'edit', itemId, newItem, userId: props.userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.thumbnail != null) {
      newItem.images = 'data:image/jpeg;base64,' + Buffer.from(data.thumbnail.src.data.data).toString('base64') as never;
    }

    const updatedItems = items.map((item : any) => {
      if (item.id === editItemId) {
        return { ...newItem, id: item.id };
      }
      return item;
    });

    setItems(updatedItems as never[]);
    setNewItem({ name: '', category: '', description: '',serial_number: '', images: [],purchase_price:'', });
  }

  async function searchItems(searchTerm) {
    const response = await fetch(`/api/searchItems`, {
      method: 'POST',
      body: JSON.stringify({ filter: itemFilter !== '' ? itemFilter : 'description', search: searchTerm.toLowerCase(), userId: props.userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    data.items.forEach((item) => {
      item['id'] = item._id;
    });

    for (var i = 0; i < data.items.length; i++) {
      data.items[i].id = data.items[i]._id;
      if (data.items[i].images.length > 0) {
        if (data.items[i].images[0].src != null) {
          if (data.items[i].images[0].src.data != null) {
            data.items[i].images = 'data:image/jpeg;base64,' + Buffer.from(data.items[i].images[0].src.data.data).toString('base64');
        
          }
        }
      }
    }

    setItems(data.items);
  }

  async function updateCategoryList(method) {
    const response = await fetch(`/api/updateCategories`, {
      method: 'POST',
      body: JSON.stringify({method: method, userId: props.userId, category: newCategory}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async function getImages(itemId) {
    const response = await fetch(`/api/getImages`, {
      method: 'POST',
      body: JSON.stringify({ itemId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    const srcs = [];
    
    for (var i = 0; i < data.data.length ; i++) {
      srcs.push('data:image/jpeg;base64,' + Buffer.from(data.data[i].data).toString('base64') as never);
    }

    srcs.forEach((src) => {
      setImages((prevImages) => [...prevImages, { src: src}] as never);
    });
  }

  async function getItems(pageDirection) {
    let pageNumber;

    if (pageDirection === 'next') {
      pageNumber = currentPage + 1;
    } else if (pageDirection === 'prev') {
      pageNumber = currentPage - 1;
    }

    const response = await fetch(`/api/getItems`, {
      method: 'POST',
      body: JSON.stringify({ userId: props.userId, pageNumber: pageNumber }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json()

    for (var i = 0; i < data.items.length; i++) {
      data.items[i].id = data.items[i]._id;
      if (data.items[i].images.length > 0) {
        if (data.items[i].images[0].src != null) {
          if (data.items[i].images[0].src.data != null) {
            data.items[i].images = 'data:image/jpeg;base64,' + Buffer.from(data.items[i].images[0].src.data.data).toString('base64');
        
          }
        }
      }
    }

    setCurrentPage(pageNumber);
    setItems(data.items);
  }

  async function updateCategory(method, category) {
    const response = await fetch(`/api/updateCategories`, {
      method: 'POST',
      body: JSON.stringify({ method, category, userId: props.userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async function updateCheckedOut(item) {
    const response = await fetch(`/api/checkOutItem`, {
      method: 'POST',
      body: JSON.stringify({ itemId : item.id, checked_out : item.checked_out, checked_out_date : item.checked_out_date }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
    console.log(name);
  };

  const handleAddItem = () => {
    if (editItemId) {
      handleSaveItem();
    } else {
      addItem(newItem);
      setOpenDialog(false);
    }
  };

  const handleEditItem = (itemId) => {
    setEditItemId(itemId);
    setImages([]);
    setBlobImages([]);
    const itemToEdit : any = items.find((item: any) => item.id === itemId);
    if (itemToEdit) {
      setNewItem({ ...itemToEdit });
      setOpenDialog(true);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setSelectedFileNames([]);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewItem({ name: '', category: '', description: '',serial_number: '', images: [],purchase_price:'', });
    setEditItemId(null);
    setSelectedCategory('');
    setProfilePicture(null);

    setImages([]);
    setBlobImages([]);
    setSelectedFileNames([]);

    // const fileInput = document.getElementById('custom-image-input');
    // if (fileInput) {
    //   fileInput.value = null;
    // }
  };


  const handleSaveItem = () => {
    editItem(editItemId);
    setNewItem({ name: '', category: '', description: '',serial_number: '', images: [],purchase_price:'' });
    setEditItemId(null);
    setOpenDialog(false);
    setProfilePicture(null);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchorEl(event.currentTarget as HTMLAnchorElement);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchorEl(null);
  };

  const handleCategorySelect = (category: React.SetStateAction<string>) => {
    setSelectedCategory(category);
    setCategoryMenuAnchorEl(null);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory] as never);
      updateCategoryList('add');
      setNewCategory('');
    }
  };

  const handleProfilePictureUpload = (images) => {
    // const file = files[0];
    // setProfilePicture(file);
    // console.log(event);
  };

  const handleExportChecked = () => {
    const checkedItems = items.filter((item: any) => item.checked);
    if (checkedItems.length > 0) {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Item Report', 10, 10);
      doc.setFontSize(12);
  
      let yPos = 20;
      const lineHeight = 10; // Adjust the line height as needed
      const pageHeight = 280; // Adjust the page height as needed
  
      checkedItems.forEach((item: any, index) => {
        const itemText = `Name: ${item.name}\nCategory: ${item.category}\nDescription: ${item.description}\nPrice: ${item.purchase_price}\nSerial Number: ${item.serial_number}`;
        const lines = doc.splitTextToSize(itemText, 180); // Adjust 180 according to your desired line width
  
        if (item.images) {
          const imageWidth = 50; // Adjust the image width as needed
          const imageHeight = (imageWidth * 3) / 4; // Assuming aspect ratio is 4:3, you can adjust this based on your image aspect ratio
  
          if (yPos + imageHeight > pageHeight) {
            doc.addPage();
            yPos = 20;
          }
  
          doc.addImage(item.images, 'JPEG', 10, yPos, imageWidth, imageHeight);
          doc.text(lines, 70, yPos + imageHeight / 2); // Position text next to the image
          yPos += Math.max(imageHeight, lines.length * lineHeight) + 10; // Adjust vertical position after adding image and text
        } else {
          if (yPos + lines.length * lineHeight > pageHeight) {
            doc.addPage();
            yPos = 20;
          }
  
          doc.text(lines, 10, yPos);
          yPos += lines.length * lineHeight + 10;
        }
      });
  
      doc.save('Items Report.pdf');
    }
  };

  const exportCenteredImageStyle = () => {
    const checkedItems = items.filter((item : any) => item.checked);
    if (checkedItems.length > 0) {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Item Report', 10, 10);
      doc.setFontSize(12);
  
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
  
      let yPos = 20; // Start from the top of the page
  
      const lineHeight = 10; // Adjust the line height as needed
  
      checkedItems.forEach((item : any, index) => {
        const itemText = `Name: ${item.name}\nCategory: ${item.category}\nDescription: ${item.description}\nPrice: ${item.purchase_price}\nSerial Number: ${item.serial_number}`;
        const lines = doc.splitTextToSize(itemText, 180); // Adjust 180 according to your desired line width
  
        const imageWidth = 50; // Adjust the image width as needed
        const imageHeight = (imageWidth * 3) / 4; // Assuming aspect ratio is 4:3, you can adjust this based on your image aspect ratio
  
        const totalContentHeight = imageHeight + lines.length * lineHeight;
  
        if (yPos + totalContentHeight > pageHeight) {
          doc.addPage();
          yPos = 20; // Start from the top of the new page
        }
  
        const imageX = (pageWidth - imageWidth) / 2; // Center horizontally
        doc.addImage(item.images, 'JPEG', imageX, yPos, imageWidth, imageHeight);
  
        const textX = (pageWidth - 180) / 2; // Center horizontally
        doc.text(lines, textX, yPos + imageHeight + 5); // Position text below the centered image
  
        yPos += totalContentHeight + 20; // Adjust vertical position after adding image and text
      });
  
      doc.save('Items Report.pdf');
    }
  };
  
  const handleViewItemImages = (itemId) => {
    getImages(itemId);
    setShowImages(true);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    const { checked } = event.target;
    setItems((prevItems: any) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, checked };
        }
        return item;
      })
    );
  };

  const handleSearch = (searchTerm, userId) => {
    // Implement your search logic here using the provided searchTerm
    console.log(`Performing search with searchTerm: ${searchTerm}`);
    // Update the items based on the search results
    searchItems(searchTerm);
    // For example, you can filter the items array and set it using setItems
  };
  
  const handleSearchbarFocus = () => {
    // Handle the search bar focus event if needed
  };
  
  const handleSearchbarBlur = () => {
    // Handle the search bar blur event if needed
  };

  const handleImageSelection = (files) => {
    setImages([]);
    setBlobImages([]);
    setSelectedFileNames(files.map((file) => file.name)); // Store selected file names
    files.forEach((file) => {
      setBlobImages((prevImages) => [...prevImages, file] as never[]);
      setImages((prevImages) => [
        ...prevImages,
        { name: file.name, src: URL.createObjectURL(file) },
      ] as never[]);
    });
  };

  const handleCheckedOutToggle = (item_checked) => {
    setItems((prevItems : any) =>
      prevItems.map((item) => {
        if (item.id === item_checked.id) {
          return { ...item, checked_out: !item.checked_out };
        }
        return item;
      })
    );
    item_checked.checked_out = !item_checked.checked_out
    item_checked.checked_out_date = Date.now()
    updateCheckedOut(item_checked);
  };

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };

  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
  };

  const handleExportCheckedCentered = () => {
    // Your logic for exporting checked items centered
    setOpenExportDialog(false);
  };

  const handleExportCheckedSideBySide = () => {
    // Your logic for exporting checked items side by side
    setOpenExportDialog(false);
  };


  const handleOpenRemoveCategoryDialog = () => {
    setOpenRemoveCategoryDialog(true);
  };

  const handleRemoveCategory = (categoryToRemove) => {
    // Implement the logic to remove the category from the list of categories.
    // You can use the 'setCategories' function to update the categories state.
    // Make sure to also update the items with the new category if they had the removed category.
    // ...
    updateCategory('remove', categoryToRemove);
    setCategories((prevCategories) => prevCategories.filter((category) => category !== categoryToRemove));
  };

  return (
    <><div className='background'>
      <LogoutButton />

      <Searchbar onSubmit={handleSearch} inputProps={{ onFocus: handleSearchbarFocus, onBlur: handleSearchbarBlur }} categories={categories} setSelectedCategory={selectedCategory} setItemFilter={setItemFilter} />
      {/* <Button variant="contained" color="secondary" onClick={handleOpenRemoveCategoryDialog}>
          Remove a Category
      </Button>  */}
      <RemoveCategoryDialog
        open={openRemoveCategoryDialog}
        onClose={() => setOpenRemoveCategoryDialog(false)}
        onRemoveCategory={handleRemoveCategory}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Add/Edit</TableCell>
              <TableCell>Export</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item : any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.id === editItemId ? (
                    <TextField
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      placeholder="Enter name" />
                  ) : (
                    item.name
                  )}
                </TableCell>
                <TableCell>
                  {item.id === editItemId ? (
                    <>
                      <TextField
                        name="Category"
                        value={newItem.category}
                        onChange={handleAddCategory}
                        placeholder='Enter Category' />
                    </>
                  ) : (
                    item.category
                  )}
                </TableCell>
                <TableCell>
                  {item.id === editItemId ? (
                    <div style={styles.imageContainer}>
                      {profilePictures.length > 0 ? (
                        profilePictures.map((profilePicture, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(profilePicture)}
                            alt={`N/A ${index + 1}`}
                            width="50"
                            height="50"
                            className="custom-image-display" // Add your custom class for the displayed image
                            onClick={()=>handleViewItemImages(item.id)}
                          />
                        ))
                      ) : (
                        <CustomFileSelector
                          onChange={(files) => handleProfilePictureUpload(files)}
                          className="custom-image-input" // Add your custom class for the image input
                        />
                      )}
                    </div>
                  ) : (
                    <div style={styles.imageContainer}>
                    <img
                      src={item.images}
                      alt="N/A"
                      width="50"
                      height="50"
                      className="custom-image-display" // Add your custom class for the displayed image
                      onClick={() => handleViewItemImages(item.id)}
                    />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {item.id === editItemId ? (
                    <TextField
                      name="serial_number"
                      value={newItem.serial_number}
                      onChange={handleInputChange}
                      placeholder="Enter serial number" />
                  ) : (
                    item.serial_number
                  )}
                </TableCell>
                <TableCell>
                  {item.id === editItemId ? (
                    <TextField
                      name="description"
                      value={newItem.description}
                      onChange={handleInputChange}
                      placeholder="Enter description" />
                  ) : (
                    item.description
                  )}
                </TableCell>
                <TableCell>
                  {item.id === editItemId ? (
                    <TextField
                      name="purchase_price"
                      value={newItem.purchase_price}
                      onChange={handleInputChange}
                      placeholder="Enter price" />
                  ) : (
                    item.purchase_price
                  )}
                </TableCell>
                <TableCell>
                  {item.id === editItemId ? (
                    <Button variant="contained" color="primary" onClick={handleSaveItem}>
                      Save
                    </Button>
                  ) : (
                    <>
                      <Button variant="outlined" color="primary" onClick={() => handleEditItem(item.id)}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                        Remove
                      </Button>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={<Checkbox
                      checked={item.checked || false}
                      onChange={(event) => handleCheckboxChange(event, item.id)} />}
                    label="Export" />
                </TableCell>
                <TableCell>
               <CheckedOut item={item} onToggle={() => handleCheckedOutToggle(item)} />
              </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField name="name" value={newItem.name} onChange={handleInputChange} placeholder="Enter name" />
              </TableCell>
              <TableCell>
                <Button component="div" onClick={handleCategoryMenuOpen}>
                  {selectedCategory || 'Select Category'}
                  
                </Button>
                <Menu
                  anchorEl={categoryMenuAnchorEl}
                  open={Boolean(categoryMenuAnchorEl)}
                  onClose={handleCategoryMenuClose}
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        selected={category === selectedCategory}
                        sx={{ color: 'black' }}
                      >
                        {category}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Categories added</MenuItem>
                  )}
                  <CategoryInput setNewCategory={setNewCategory} categories={categories} addCategory={handleAddCategory}/>
                  <Button variant="contained" color="secondary" onClick={handleOpenRemoveCategoryDialog}>
                    Remove
                  </Button>
                </Menu>
              </TableCell>
              <TableCell>
                <CustomFileSelector
                  onChange={handleImageSelection}
                  className="custom-image-input" // Add your custom class for the image input
                />
                {images.length > 0 ? (<ImagePreview images={images} />) : (<></>)}
              </TableCell>
              <TableCell>
                <TextField
                  name="serial_number"
                  value={newItem.serial_number}
                  onChange={handleInputChange}
                  placeholder="Enter serial number" />
              </TableCell>
              <TableCell>
                <TextField
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                  placeholder="Enter description" />
              </TableCell>
              <TableCell>
                <TextField 
                  name="purchase_price" // New field for the price
                  value={newItem.purchase_price}
                  onChange={handleInputChange}
                  placeholder="Enter price"/>
                  </TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={handleAddItem}>
                  Add
                </Button>
              </TableCell>
              <TableCell>
              <Button variant="contained" color="primary" onClick={handleOpenExportDialog}>
                Export Checked
              </Button>
              <Dialog open={openExportDialog} onClose={handleCloseExportDialog}>
        <DialogTitle>Export Checked Items</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose the export style:
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExportDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={exportCenteredImageStyle} color="primary">
            Export Image Centered
          </Button>
          <Button onClick={handleExportChecked} color="primary">
            Export Image Side by Side
          </Button>
        </DialogActions>
      </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {showImages ? ( <ViewItemImages images={images} setShowImages={setShowImages} setImages={setImages}/>) : (<></>)}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editItemId ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField name="name" value={newItem.name} onChange={handleInputChange} label="Name" fullWidth />
          <Button component="div" onClick={handleCategoryMenuOpen}>
            {selectedCategory || 'Select Category'}
          </Button>
          <Menu
            anchorEl={categoryMenuAnchorEl}
            open={Boolean(categoryMenuAnchorEl)}
            onClose={handleCategoryMenuClose}
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  selected={category === selectedCategory}
                  sx={{color:'black'}}
                >
                  {category}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Categories added</MenuItem>
            )}
            <CategoryInput setNewCategory={setNewCategory} categories={categories} addCategory={handleAddCategory}/>
            <Button variant="contained" color="secondary" onClick={handleOpenRemoveCategoryDialog}>
              Remove
            </Button>
          </Menu>
          <div>
            {profilePicture ? (
              <img src={URL.createObjectURL(profilePicture)} alt="N/A" width="50" height="50" />
            ) : (
              <div>
                <CustomFileSelector
                  onChange={handleImageSelection}
                  className="custom-image-input" // Add your custom class for the image input
                />
                {images.length > 0 ? (<ImagePreview images={images} />) : (<></>)}
              </div>
            )}
          </div>
          <TextField
            name="serial_number"
            value={newItem.serial_number}
            onChange={handleInputChange}
            label="Serial Number"
            fullWidth />
          <TextField
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            label="Description"
            fullWidth />
            <TextField
            name="purchase_price"
            value={newItem.purchase_price}
            onChange={handleInputChange}
            label="Price"
            fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary">
            {editItemId ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous Page
        </Button>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next Page
        </Button>
      </div>
      </>
      
  );
  
};

export default TableExample;

