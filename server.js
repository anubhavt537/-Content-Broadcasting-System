import app from './app.js';
import { pool } from './config/db.config.js';

const PORT = process.env.PORT || 3000;

pool.connect()
  .then((client) => {
    client.release();
  
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });