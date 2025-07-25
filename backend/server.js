const app = require("./src/app");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
