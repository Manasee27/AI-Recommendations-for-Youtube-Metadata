import React, {useState, useEffect} from "react";
import axios from "axios";

const Home = ({toggleLoading}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const search = () => {
        const videoId = document.getElementById('videoId').value;
        if (!videoId) {
          setError('Please enter a valid video ID');
          return;
        }
    
        toggleLoading(true);
        setError('');
    
        axios.get("/api/getData/" + videoId)
          .then(function (response) {
            toggleLoading(false);
            if (response.data && response.data.snippet && response.data.snippet.thumbnails) {
              setData(response.data);
            } else {
              setError('No data found for this video ID or no thumbnails available.');
              setData(null);
            }
          })
          .catch(function (error) {
            toggleLoading(false);
            setError('An error occurred while fetching video data.');
            console.error('Error fetching video data:', error);
          });
      };
    


    // const search = () => {
    //     toggleLoading(true)
    //     axios.get("/api/getData/" +  document.getElementById("videoId").value).then(function(data){
    //         toggleLoading(false)
    //         setData(data.data)
    //     })
    // }
    
    return(
        <div className="container w-full m-auto p-4 py-16 text-center">
            <input className="w-3/4 m-auto border-gray-200 border-2 rounded-md shadow-lg p-6 focus:ring-4 focus:ring-blue-300 focus:border-none focus:outline-none block my-4" placeholder="Enter a video id..." id="videoId"></input>
            <button id="search" className="w-1/4 bg-blue-700 text-white font-bold text-2xl rounded-lg p-4" onClick={search}>Search!</button>

            <div className="data w-3/4 m-auto border-gray-200 border-2 rounded-md shadow-lg p-6 block font-medium text-xl my-6">
                <img className="mb-6" src={data ? data.snippet.thumbnails.maxres.url : "https://placehold.co/1280x720"} width="1280" height="720"/>
                <p className="mb-2 title"><strong>Title: </strong>{data ? data.snippet.title : ""}</p>
                <p className="mb-2 description"><strong>Description: </strong>{data ? data.snippet.description : ""}</p>
                <p className="mb-2 channelTitle"><strong>Channel Title: </strong>{data ? data.snippet.channelTitle : ""}</p>
                <p className="mb-2 tags"><strong>Tags: </strong>{data ? JSON.stringify(data.snippet.tags) : ""}</p>
                <p className="mb-2 viewCount"><strong>View Count: </strong>{data ? data.statistics.viewCount : ""}</p>
                <p className="mb-2 likeCount"><strong>Like Count: </strong>{data ? data.statistics.likeCount : ""}</p>
                <p className="mb-2 commentCount"><strong>Comment Count: </strong>{data ? data.statistics.commentCount : ""}</p>
            </div>

        </div>
    )
}

export default Home;