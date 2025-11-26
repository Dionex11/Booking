// --- 3. Modal Component ---
import React, { useState, useEffect } from "react";
import Datepick from "./date";
import Textbox from "./textbox";

const BookingModal = ({ isOpen, onClose, selectedItems, initialStart, initialEnd, onConfirmBooking }) => {
  const [modalStart, setModalStart] = useState(initialStart);
  const [modalEnd, setModalEnd] = useState(initialEnd);
  const [formdata,setformData]=useState({'Name':"",'Phone':"",'Email':""});

  useEffect(() => {
    if(isOpen) {
        setModalStart(initialStart);
        setModalEnd(initialEnd);
    }
  }, [isOpen, initialStart, initialEnd]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const bookingData = {
      items: selectedItems.map(i => i.id),
      start: modalStart.toISOString(),
      end: modalEnd.toISOString()
    };
    onConfirmBooking(bookingData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Booking</h2>
        <p className="modal-subtitle">
            You are booking <span className="highlight">{selectedItems.length}</span> item(s):
        </p>
        <div className="modal-items-list">
            {selectedItems.map(i => (
                <span key={i.id} className="item-tag">{i.name}</span>
            ))}
        </div>

        <div className="modal-inputs">
            <Datepick label="Start Date/Time" value={modalStart} setValue={setModalStart} />
            <Datepick label="End Date/Time" value={modalEnd} setValue={setModalEnd} />
            
        </div>
            <Textbox label="Name"  value={formdata.Name} setformData={setformData} formdata={formdata}/>
            <Textbox label="Phone" value={formdata.Phone} setformData={setformData} formdata={formdata}/>
            <Textbox label="Email"  value={formdata.Email} setformData={setformData} formdata={formdata}/>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;