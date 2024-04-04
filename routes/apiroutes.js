const apiControllers = require("../controllers/apiControllers");
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, '')
  },
  filename: function (req, file, cb) {
      cb(null, "retention.csv")
  },
})
const upload = multer({ storage: storage })
module.exports = function(app){
    app.get("/api/getData/:id", function(req, res){
        apiControllers.getData(req, res);
    })
    app.get("/api/generateTags/:id", async function(req, res){
        apiControllers.generateTags(req, res);
    })
    app.get("/api/generateTitles/:id", async function(req, res) {
        apiControllers.generateTitles(req, res);
    })
    app.get("/api/shortenVideo/:id", async function(req, res) {
        apiControllers.shortenVideo(req, res);
    })
    app.post('/api/retention', upload.single('file'), function(req, res){
        res.end();
        console.log("uploaded")
    })
    app.get("/api/sendVideo", async function(req, res) {
        apiControllers.sendVideo(req, res);
    })
};