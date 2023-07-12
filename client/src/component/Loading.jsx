import React from "react";

import "../sass/loading.scss";

const Loading = ({msg}) => {
  return (
    <div className="loading">
      <img src="/loader.svg" alt="loader" className="imageContainer" />
      <div>
      <p  className="loadingName">
        {msg}
      </p>
      </div>
    
    </div>
  );
};

export default Loading;
