import "./resume.css";
import ThemeToggle from "./ThemeToggle";

const Resume = ({ theme, onToggleTheme }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.html";
    link.download = "Roshan_Kharke_Resume.html";
    link.click();
  };

  return (
    <div className="resume-page">
      <nav className="resume-nav">
        <a href="/" className="resume-back">← Back</a>
        <span className="resume-nav-title">Resume</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ThemeToggle theme={theme} toggle={onToggleTheme} />
          <button className="resume-download-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </nav>
      <div className="resume-viewer">
        <iframe
          src="/resume.html"
          title="Roshan Kharke Resume"
          className="resume-iframe"
        />
      </div>
    </div>
  );
};

export default Resume;
