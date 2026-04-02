import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Resume from "./Resume";
import NutritionGuide from "./NutritionGuide";
import PasswordGate from "./PasswordGate";

export default function App() {
      return (
            <BrowserRouter>
                  <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/resume" exact element={<Resume />} />
                        <Route path="/nutrition" element={<PasswordGate><NutritionGuide /></PasswordGate>} />
                  </Routes>
            </BrowserRouter>
      );
}
