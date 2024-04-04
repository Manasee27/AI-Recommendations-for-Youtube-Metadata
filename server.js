const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

require("./routes/apiroutes")(app)

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})

app.listen(PORT, function () {
    console.log('App running on port http://localhost:'  + PORT); 
});

module.exports = app;