import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Signin from "./pages/Signin.js";
import Login from "./pages/Login.js";
import Terms from "./pages/Terms.js";
import User from "./pages/User.js";
import Roadmap from "./pages/Roadmap.js";
import Output from "./pages/Output.js";
import Loading from "./pages/Loading.js";
import Error from "./pages/Error.js";
import Audh from "./pages/Audh.js";
import Notallow from "./pages/Notallow.js";

import Particles from "./components/Particle.js";

function App() {
  return (
    <Router>
       {/* Particle Effect Applied Globally */}
      <Particles />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/user" element={<User />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/output" element={<Output />} />
        <Route path="/*" element={<Error />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/auth" element={<Audh />} />
         <Route path="/notallowed" element={<Notallow />} />
      </Routes>
    </Router>
  );
}

export default App;
