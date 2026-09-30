import { KageLandingPage } from "./threeui/landing-pages/LandingPages";
import "./threeui/threeui.css";
import "./Portfolio.css";

export default function KageOriginal() {
  return (
    <div className="shader-frame">
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
    </div>
  );
}
