import * as React from "react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Container } from "@mui/material";

export default function Datepick({ label, value, setValue }) {
  return (
    <Container maxWidth="sm" sx={{
        backgroundColor: 'white', 
        paddingY: 3,             
        paddingX: 3,             
        borderRadius: 2,         
        boxShadow: 3,            
        marginTop: 4,             
      }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px", backgroundColor:"white" }}>
        <DatePicker
          label={`${label} Date`}
          value={value}
          onChange={(newVal) => setValue(newVal)}
        />

        <TimePicker
          label={`${label} Time`}
          value={value}
          onChange={(newVal) => setValue(newVal)}
        />
      </div>
    </LocalizationProvider>
    </Container>
  );
}
