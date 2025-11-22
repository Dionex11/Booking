import React, { useState, useEffect } from "react";
import Datepick from "./date"
import dayjs from "dayjs";
import BookingModal  from "./Booking";
import SimpleCard from "./card";



//---Main Application ---
export default function App() {
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs().add(1, 'hour'));
  const [results, setResults] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSearch = async () => {
    setSuccessMessage("");
    const res = await fetch("http://127.0.0.1:5000/ws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_start: start.toISOString(),
          user_end: end.toISOString(),
        }),
      });
    const data = await res.json();
    setResults(data);
    
    // Simulate network delay
    const originalText = document.querySelector('.btn-primary').innerText;
    document.querySelector('.btn-primary').innerText = "Searching...";
    
    setTimeout(() => {
        document.querySelector('.btn-primary').innerText = originalText;
        // Just reshuffle mock data to show interaction
        setResults(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 800);
  };

  const onConfirmBooking = async (data) => {
    const res = await fetch("http://127.0.0.1:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids:data.items,
          start_ts: start.toISOString(),
          end_ts: end.toISOString(),
        }),
      });
    const response = await res.json();
      setIsModalOpen(false);
      setSelectedIds([]);
      setSuccessMessage(`🚀 Success! Booked ${data.items.length} resource(s).`);
      setTimeout(() => setSuccessMessage(""), 5000);
  };

  const selectedItems = results.filter(item => selectedIds.includes(item.id));

  return (
    <>
      
      <div className="app-container">
        
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <h1>Reserve Your Space</h1>
            <p className="subtitle">Select a time range to find high-tech workspaces.</p>
        </div>

        {successMessage && (
          <div className="success-banner">
            {successMessage}
          </div>
        )}

        {/* Controls Wrapper: 70% Date inputs, 30% Button */}
        <div className="controls-wrapper">
            <div className="date-group">
                <Datepick label="Start Date" value={start} setValue={setStart} />
                <Datepick label="End Date" value={end} setValue={setEnd} />
            </div>
            <div className="search-action">
                <button className="btn btn-primary" onClick={handleSearch}>
                    Search Availability
                </button>
            </div>
        </div>

        {/* Grid */}
        <div className="grid-container">
            {results.map((item) => (
            <SimpleCard
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onToggle={toggleSelection}
            />
            ))}
        </div>

        {results.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '60px' }}>
                <p>No resources available. Try a different time range.</p>
            </div>
        )}

        {/* Floating Action Bar */}
        {selectedIds.length > 0 && (
            <div className="bottom-bar">
            <span className="bottom-bar-text">{selectedIds.length} selected</span>
            <button 
                className="btn-floating" 
                onClick={() => setIsModalOpen(true)}
            >
                Proceed to Book
            </button>
            </div>
        )}

        {/* Modal */}
        <BookingModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedItems={selectedItems}
            initialStart={start}
            initialEnd={end}
            onConfirmBooking={onConfirmBooking}
        />
      </div>
    </>
  );
}