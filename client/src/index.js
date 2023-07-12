import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { EuiProvider } from "@elastic/eui";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@elastic/eui/dist/eui_theme_light.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <GoogleOAuthProvider clientId="83137024241-048f1j11et4aenjjg5ntk5o1leu8uqum.apps.googleusercontent.com">
          <EuiProvider>
            <Routes>
              <Route path="/*" element={<App />} />
           
            </Routes>
          </EuiProvider>
        </GoogleOAuthProvider>
      </Provider>
    </Router>
  </React.StrictMode>
);
