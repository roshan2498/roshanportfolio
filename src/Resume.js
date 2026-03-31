import "./resume.css";

const Resume = () => {
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
        <button className="resume-download-btn" onClick={handleDownload}>
          Download
        </button>
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
