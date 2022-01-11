import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Resume from "./Resume";
import RickRoll from "./RickRoll";

export default function App() {
      return (
            <BrowserRouter>
                  <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/resume" exact element={<Resume />} />
                        <Route path="/onlyfans" exact element={<RickRoll />} />
                  </Routes>
            </BrowserRouter>
      );
}
