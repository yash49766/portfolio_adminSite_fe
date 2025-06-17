import './App.css'
import Navbar from "./component/navbar.jsx";
import {Route, Routes} from "react-router-dom";
import Project from "./component/project.jsx";
import Contact from "./component/contact.jsx";

function App() {

  return (
    <>
  <Navbar />
        <Routes>
            <Route path="/project" element={<Project />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    </>
  )
}

export default App
