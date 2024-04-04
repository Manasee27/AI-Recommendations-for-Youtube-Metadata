import React, { useState, useEffect } from "react";
import axios from "axios";

const Title = ({toggleLoading}) => {
  const [titles, setTitles] = useState(null);
  // useEffect(()=>{
  //     axios.get("/api/generateTags/" +  "wT3BGq7l9w8").then(function(data){
  //         console.log(data.data)
  //     })
  // }, [])

  const search = () => {
    toggleLoading(true);
    axios
      .get("/api/generateTitles/" + document.getElementById("videoId").value)
      .then(function (data) {
        console.log(data.data);
        setTitles(data.data);
        toggleLoading(false)
      });
  };

  return (
    <div className="container w-full m-auto p-4 py-16 text-center">
      <input
        className="w-3/4 m-auto border-gray-200 border-2 rounded-md shadow-lg p-6 focus:ring-4 focus:ring-blue-300 focus:border-none focus:outline-none block my-4"
        placeholder="Enter a video id..."
        id="videoId"
      ></input>
      <button
        id="search"
        className="w-1/4 bg-blue-700 text-white font-bold text-2xl rounded-lg p-4"
        onClick={search}
      >
        Generate Titles!
      </button>

      <div className="data w-3/4 m-auto border-gray-200 border-2 rounded-md shadow-lg p-6 block font-medium text-xl my-6">
        <h1 className="font-bold text-lg">
          Potential titles based on your video:
        </h1>
        {titles ? (
          <ul>
            {titles.map((element) => {
              return <li>{element}</li>;
            })}
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Title;
