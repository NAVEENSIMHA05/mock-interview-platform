const express = require('express');
const cors = require('cors');
const connectDB = async () => { require('./config/db')(); };

const app = express();

// Middleware frameworks
app.use(express.json()); // Parses incoming JSON text frames
app.use(cors());         // Resolves security blocks between front and backend communication ports

// Connect Database Instance
require('./config/db')();

// Inject Modular Route Handlers
app.use('/api/auth', require('./routes/auth'));
// Add this right under your app.use('/api/auth'...) line:
app.use('/api/requests', require('./routes/requests'));


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] Engine executing flawlessly on: http://localhost:${PORT}`);
});