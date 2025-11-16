import { useState } from "react";
import dayjs from "dayjs";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
} from "@mui/material";


import Datepick from "./date";

function App() {
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());
  const [results, setResults] = useState([]);

  async function handleSubmit() {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/`
      );
   
      const res1 = await fetch("http://127.0.0.1:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: start.toISOString(),
          end: end.toISOString(),
        }),
      });
  
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("API Fetch Error:", error);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" mb={3}>
        Select Start & End Date-Time
      </Typography>

   <div style={{ display: "flex", gap: "20px" }}>
  <Datepick label="Start" value={start} setValue={setStart} />
  <Datepick label="End" value={end} setValue={setEnd} />
</div>


      <Button
        variant="contained"
        sx={{ mt: 3 }}
        fullWidth
        onClick={handleSubmit}
      >
        Submit
      </Button>

      {/* Display results */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {results.map((item) => (
          <Grid size={6} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2">{item.info}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {results.length === 0 && (
        <Typography mt={3} color="text.secondary">
          No data fetched yet.
        </Typography>
      )}
    </Container>
  );
}

export default App;
