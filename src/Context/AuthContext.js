import React, { createContext, useContext, useMemo, useReducer, useState, useEffect } from "react";
import { Validations } from "../Utils/Validations";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [error, errorDispatchFunc] = useReducer(errorFunc, { display: "none", text: "" });
	const [redirect, redirectDispatchFunc] = useReducer(redirectFunc, { redirect: false, path: "" });
	const [waiting, setWaiting] = useState(false);

	const validations = useMemo(() => new Validations(), []);

	function errorFunc(error, action) {
		switch (action.type) {
			case "displayError":
				return { display: "block", text: action.payload };
			case "clearError":
				return { display: "none", text: "" };
			default:
				return error;
		}
	}

	useEffect(() => {
		if (error.display === "block") {
			setWaiting(false);
		}
	}, [error.display]);
	function redirectFunc(error, action) {
		switch (action.type) {
			case "redirect":
				return { redirect: "true", path: action.payload };
			case "clearRedirect":
				return { redirect: false, path: "" };
			default:
				return error;
		}
	}

	function clearError() {
		error.display === "block" && errorDispatchFunc({ type: "clearError" });
	}
	return <AuthContext.Provider value={{ error, errorDispatchFunc, clearError, validations, redirect, waiting, setWaiting, redirectDispatchFunc }}> {children} </AuthContext.Provider>;
};

export function useAuthContext() {
	return useContext(AuthContext);
}
export default AuthProvider;
