import React from "react";
const svgString = `<svg height="512px" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="_x32_16-microsoft"><g><rect height="215.65" style="fill:#F25022;" width="215.648" x="30.905" y="30.904"/><rect height="215.65" style="fill:#7FBA00;" width="215.648" x="265.446" y="30.904"/><rect height="215.651" style="fill:#00A4EF;" width="215.648" x="30.905" y="265.444"/><rect height="215.651" style="fill:#FFB900;" width="215.648" x="265.446" y="265.444"/></g></g><g id="Layer_1"/></svg>`;

const MicrosoftLogo = () => {
  return (
    <div
      style={{ width: "24px", height: "24px" }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

export default MicrosoftLogo;
