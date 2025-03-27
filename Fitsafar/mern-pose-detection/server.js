const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

// Example route for video processing
app.get('/process-video', (req, res) => {
  // You can add logic here for real-time video processing if needed in the backend
  res.send('Video Processing Route');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
