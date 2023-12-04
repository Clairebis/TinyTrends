import { useState } from "react";

import LocalizationProvider from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MobileDatePicker from "@mui/x-date-pickers/MobileDatePicker";

export default function DatePicker() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        label="Select Date"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
}
