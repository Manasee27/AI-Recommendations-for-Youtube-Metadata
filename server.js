const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require("./routes/apiroutes")(app)

app.listen(PORT, function () {
console.log('App running on port http://localhost:'  + PORT); 
});