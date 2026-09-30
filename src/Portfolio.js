import { useEffect } from "react";
import { KageLandingPage } from "./threeui/landing-pages/LandingPages";
import "./threeui/threeui.css";
import "./Portfolio.css";

export default function Portfolio() {
  useEffect(() => {
    document.title = "Roshan Kharke — Full-Stack Software Engineer";
  }, []);

  return (
    <div className="shader-frame">
      <KageLandingPage
        sourceUrl="/landing-pages/roshan.html"
        title="Roshan Kharke — Full-Stack Software Engineer"
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
