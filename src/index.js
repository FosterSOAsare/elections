import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppProvider from "./Context/AppContext";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./Context/AuthContext";
import ElectionProvider from "./Context/ElectionContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<BrowserRouter>
		<AppProvider>
			<AuthProvider>
				<ElectionProvider>
					<App />
				</ElectionProvider>
			</AuthProvider>
		</AppProvider>
	</BrowserRouter>
);
