import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "../VideoPlayer";

const Video = ({toggleLoading}) => {
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);
  const [file, setFile] = useState(null);
  // useEffect(()=>{
  //     axios.get("/api/generateTags/" +  "wT3BGq7l9w8").then(function(data){
  //         console.log(data.data)
  //     })
  // }, [])

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

  const search = async () => {
    toggleLoading(true)
    if (file && document.getElementById("videoId").value) {
      setError(false)
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("/api/retention", formData);
      axios
        .get("/api/shortenVideo/" + document.getElementById("videoId").value)
        .then(async function (data) {
          console.log('shortened the video')
          await timeout(10000)
          setFinished(true)
          toggleLoading(false)
        });
    } else {
      setError(true);
    }
  };

  return (
    <div className="container w-full m-auto p-4 py-16 text-center">
      <input
        className="w-3/4 m-auto border-gray-200 border-2 rounded-md shadow-lg p-6 focus:ring-4 focus:ring-blue-300 focus:border-none focus:outline-none block my-4"
        placeholder="Enter a video id..."
        id="videoId"
      ></input>
      {/* <input type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
      <div className="group relative border-2 rounded-xl border-gray-300 bg-blue-50/50 h-16 transition hover:bg-blue-50 w-2/3 m-auto mt-2 mb-10">
        <input
          className="z-10 absolute left-0 w-full h-full opacity-0 cursor-pointer"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div
            className="text-center  w-full h-full text-slate-500 flex flex-col items-center justify-center space-y-2"
          >
            {file ? file.name : "Upload the retention graph for your video as a .csv file"}
          </div>
      </div>
      <button
        id="search"
        className="w-1/4 bg-blue-700 text-white font-bold text-2xl rounded-lg p-4"
        onClick={search}
      >
      
        Generate Video!
      </button>
      {error ? <p className="text-red-600 font-bold text-lg">Please make sure all fields are filled out.</p> : ""}
      <div className="data w-3/4 m-auto border-gray-200 border-2 rounded-md shadow-lg p-6 block font-medium text-xl my-6 text-center">
        {finished ? <VideoPlayer/> : ""}
      </div>
    </div>
  );
};

export default Video;
