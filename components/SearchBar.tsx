// src/components/Searchbar.tsx
// src/components/Searchbar.tsx
import { SearchOutlined } from "@mui/icons-material";
import {
  Divider,
  IconButton,
  InputBase,
  InputBaseProps,
  Paper,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";

type Props = {
  // the outside components only needs to know if the searchbar form has been submitted
  onSubmit;
  // add inputProps so that we can listen to onFocus / onBlur events if needed
  inputProps: InputBaseProps;
  categories;
  setSelectedCategory;
  setItemFilter;
};

const Searchbar = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const[selectedCategory, setSelectedCategory] = useState('' as string);
  const [selectedFilter, setSelectedFilter] = useState('' as string);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCategorySelect = (category: React.SetStateAction<string>) => {
    props.setSelectedCategory(category);
    setSelectedCategory(category);
    setAnchorEl(null);
  };

  const handleFilterSelect = (filter: React.SetStateAction<string>) => {
    props.setItemFilter(filter);
    setSelectedFilter(filter);
    setAnchorEl(null);
  };

  const itemFilters = [
    'name',
    'category',
    'serial_number',
    'description',
  ]

  const filterNames = {
    'name': 'Name',
    'category': 'Category',
    'serial_number': 'Serial Number',
    'description': 'Description',
  }

  return (
    // We use the Paper component since it already contains the style that we want.
    <>
    <Paper
      component="form"
      elevation={3}
      sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit((searchTerm as string) ?? "");
      }}
    >
      {/* Input base contains the fewest styles possible so it's perfect for creating custom components like these */}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ "aria-label": "search" }}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        {...props.inputProps}
      />
      <Divider sx={{ height: 28, mx: 0.5 }} orientation="vertical" />
      <IconButton type="submit">
        <SearchOutlined />
      </IconButton>
    </Paper>

    <Button
        variant="outlined"
        component="div"
        onClick={handleClick}
        color="secondary"
        sx={{
          backgroundColor: "white",
          color: "#1976d2", // Set the desired text color (primary color in this example)
          border: "1px solid #1976d2", // Set the border color to match the text color
          borderRadius: "4px",
          padding: "8px 16px",
          // Add any other styles you need
        }}
      >
      {filterNames[selectedFilter] || 'Select Search Filter'}
    </Button>

    <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
    >
    {/* {props.categories.length > 0 ? (
      props.categories.map((category) => (
        <MenuItem
          key={category}
          onClick={() => handleCategorySelect(category)}
          selected={category === props.selectedCategory}
        >
          {category}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Categories added</MenuItem>
    )} */}

    {itemFilters.length > 0 ? (
      itemFilters.map((filter) => (
        <MenuItem
          key={filterNames[filter]}
          onClick={() => handleFilterSelect(filter)}
          selected={filter === selectedFilter}
          sx={{color:"black"}}
        >
          {filterNames[filter]}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No Categories added</MenuItem>
    )}
    </Menu>
    </>
  );
};
export default Searchbar;
