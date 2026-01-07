const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const app = require('./src/app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
