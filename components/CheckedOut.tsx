import React, { useState } from 'react';
import Button from '@mui/material/Button';

const CheckedOut = ({ item, onToggle }) => {
  const [showDate, setShowDate] = useState(true);
  const [date, setDate] = useState(item.checked_out_date);

  const handleToggle = () => {
    onToggle();
    setShowDate(!showDate);
    console.log(item.checked_out_date);
    setDate(item.checked_out_date);
  };

  return (
    <div>
      <Button variant="contained" color={item.checked_out ? 'secondary' : 'primary'} onClick={handleToggle}>
        {item.checked_out ? 'Check In' : 'Check Out'}
      </Button>
      {item.checked_out ?  <div>Date Checked Out: {new Date(date).toLocaleDateString()}</div> : ''}
    </div>
  );
};

export default CheckedOut;
