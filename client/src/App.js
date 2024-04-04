import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
  Link,
} from "react-router-dom";
import Home from "./pages/Home"
import Tags from "./pages/Tags";
import Title from "./pages/Title";
import Video from "./pages/Video";
import LoadingModal from "./LoadingModal";


function App() {
  const [loading, setLoading] = useState(false)
  const toggleLoading = (bool) => {
    setLoading(bool)
  }
  return (
    <div className="App">
     
      <Router>
      <nav className="w-full bg-blue-500 align-middle relative inline-block shadow-md">
      <Link
        to="/"
        className="inline-block text-white font-medium p-5 text-xl hover:text-gray-300 transition-all"
      >
        Home
      </Link>
      <Link
        to="/tags"
        className="inline-block text-white font-medium p-5 text-xl hover:text-gray-300 transition-all"
      >
        Tag Generator
      </Link>
      <Link
        to="/title"
        className="inline-block text-white font-medium p-5 text-xl hover:text-gray-300 transition-all"
      >
        Title Generator
      </Link>
      <Link
        to="/shorten"
        className="inline-block text-white font-medium p-5 text-xl hover:text-gray-300 transition-all"
      >
        Video Shortener
      </Link>
      </nav>
      <div className={loading ? "opacity-20" : ""}>
        <Switch>
          <Route exact path="/" element={<Home toggleLoading={toggleLoading}/>}/>
          <Route path="/tags" element={<Tags toggleLoading={toggleLoading}/>}/>
          <Route path="/title" element={<Title toggleLoading={toggleLoading}/>}/>
          <Route path="/title" element={<Title toggleLoading={toggleLoading}/>}/>
          <Route path="/shorten" element={<Video toggleLoading={toggleLoading}/>}/>

        </Switch>
        </div>
        {loading ? <LoadingModal/> : ""}
      </Router>
      
    </div>
  );
}

export default App;
