import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Portfolio from "./Portfolio";
import SignalPortfolio from "./signal/SignalPortfolio";
import KageOriginal from "./KageOriginal";
import Resume from "./Resume";
import NutritionGuide from "./NutritionGuide";
import PasswordGate from "./PasswordGate";
import { useTheme } from "./useTheme";

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignalPortfolio />} />
        <Route path="/temple" element={<Portfolio />} />
        <Route path="/classic" element={<Home theme={theme} onToggleTheme={toggle} />} />
        <Route path="/kage" element={<KageOriginal />} />
        <Route path="/resume" exact element={<Resume theme={theme} onToggleTheme={toggle} />} />
        <Route path="/nutrition" element={<PasswordGate><NutritionGuide theme={theme} onToggleTheme={toggle} /></PasswordGate>} />
      </Routes>
    </BrowserRouter>
  );
}
