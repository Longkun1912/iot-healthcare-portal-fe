import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// import { GoogleOAuthProvider } from '@react-oauth/google';

import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <GoogleOAuthProvider clientId="727915438661-vg0o1amnnrm7ivtuk344q97tp7p6p9s5.apps.googleusercontent.com">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </GoogleOAuthProvider>
  
);