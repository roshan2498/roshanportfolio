import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Resume from "./Resume";
import NutritionGuide from "./NutritionGuide";
import PasswordGate from "./PasswordGate";
import { useTheme } from "./useTheme";

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home theme={theme} onToggleTheme={toggle} />} />
        <Route path="/resume" exact element={<Resume theme={theme} onToggleTheme={toggle} />} />
        <Route path="/nutrition" element={<PasswordGate><NutritionGuide theme={theme} onToggleTheme={toggle} /></PasswordGate>} />
      </Routes>
    </BrowserRouter>
  );
}
