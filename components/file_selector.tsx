import React, { useState } from "react";
import classNames from "classnames";

const CustomFileSelector = ({ onChange, className }) => {
  const handleFileChange = (e) => {
    const files = e.target.files;
    onChange(Array.from(files));
  };

  return (
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileChange}
      className={classNames({
        // Modify the Button shape, spacing, and colors using the `file`: directive
        // button colors
        "file:bg-violet-50 file:text-violet-500 hover:file:bg-violet-100": true,
        "file:rounded-lg file:rounded-tr-none file:rounded-br-none": true,
        "file:px-4 file:py-2 file:mr-4 file:border-none": true,
        // overall input styling
        "hover:cursor-pointer border rounded-lg text-gray-400": true,
        [className]: !!className,
      })}
    />
  );
};

export default CustomFileSelector;


