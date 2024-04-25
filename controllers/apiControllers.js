const axios = require("axios");
// const { spawn } = require("child_process");
// const { readFile } = require("fs/promises");
// const { appendFile } = require("fs/promises");
// const { join } = require("path");

const fs = require('fs')
const dotenv = require("dotenv");

dotenv.config();
const API_KEY = 'API_KEY';
const GPT_KEY = 'API_KEY';
const bodyParser = require('body-parser')


module.exports = {
  getData: function (req, res) {
    console.log(req.params["id"])
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${req.params["id"]}&key=${API_KEY}`
      )
      .then(function (data) {
        res.json(data.data.items[0]);
      });
  },
  generateTags: async function (req, res) {
    let returnData = [];
    console.log("working");
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", [
      "py_scripts.py",
      "generate_tags",
      req.params["id"],
      API_KEY,
    ]);
    console.log("connecting to python...");
    pythonProcess.stdout.on("data", (data) => {
      returnData = JSON.parse(data.toString())
      axios
        .get(
          `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${req.params["id"]}&key=${API_KEY}`
        )
        .then(function (youtubedata) {
          console.log('getting inside then og henerateTags function')
          let description = youtubedata.data.items[0].snippet.description
          description = description.split("\n")
          description = description.filter((str) => str != "" && str.includes("//"))
          description = description.slice(0, description.length-2)
          description.forEach(part => {
              returnData.push(part.split(":")[0])
          });
          console.log("done");
          console.log(returnData)
          res.json(returnData);
        })
        .catch((e) => {
          console.log(e)
        });
      
    });
  },
  // generateTitles: async function (req, res) {
  //   let returnData = [];
  //   console.log('working (generate_titles)')
  //   const spawn = require("child_process").spawn;
  //   const pythonProcess = spawn("python", ["py_scripts.py", "generate_titles", req.params["id"], API_KEY, GPT_KEY])
  //   console.log("connecting to python...")
  //   pythonProcess.stdout.on('data', (data) => {
  //       console.log(data.toString());
  //       res.json(JSON.parse(data.toString()))
  //   });

  // },

  generateTitles: async function (req, res) {
    console.log('working (generate_titles)');
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", ["py_scripts.py", "generate_titles", req.params["id"], API_KEY, GPT_KEY]);
    console.log("connecting to python...");

    let outputData = ''; // Buffer for collecting stdout data
    let errorData = ''; // Buffer for collecting stderr data

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString(); // Accumulate stdout data
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString(); // Accumulate stderr data
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        if (code !== 0) {
            console.error(`An error occurred: ${errorData}`);
            return res.status(500).send(errorData); // Send error response if the script failed
        }

        try {
            // Try parsing the accumulated stdout data as JSON
            const parsedData = JSON.parse(outputData);
            res.json(parsedData); // Send parsed data as response
        } catch (e) {
            console.error(`Error parsing JSON: ${e}`);
            res.status(500).send("Error parsing Python output"); // Send error response if parsing failed
        }
    });
},

  shortenVideo: function(req, res){
    console.log('shortening video')
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", ["py_scripts.py", "shorten_video", "https://www.youtube.com/watch?v=" + req.params["id"]])
    console.log("connecting to python...")
    pythonProcess.stdout.on('data', (data) => {
      console.log("finished shortening")
      res.end();
      
    });
  },
  sendVideo: function(req, res){
    console.log('sending video')

    const filePath = "video.mp4"
    if(!filePath){
        return res.status(404).send('File not found')
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range){
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunksize = end - start + 1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res)
    }
  }
};

// await appendFile("./args.json", JSON.stringify(req.params["id"]), {
//     encoding: "utf-8",
//     flag: "w",
//   });
//   console.log("appended")
//   const pythonProcess = await spawnSync("python3", [
//     "/py_scripts.py",
//     "generate_tags",
//     "/args.json",
//     "/results.json",
//   ]);
//   const result = pythonProcess.stdout?.toString()?.trim();
//   console.log(result);
//   const error = pythonProcess.stderr?.toString()?.trim();
//   console.log(error);
//   const status = result === "OK";
//   if (status) {
//     const buffer = await readFile("/results.json");
//     const resultParsed = JSON.parse(buffer?.toString());
//     res.send(resultParsed.toString());
//   } else {
//     console.log(error);
//     res.send(JSON.stringify({ status: 500, message: "Server error" }));
//   }
