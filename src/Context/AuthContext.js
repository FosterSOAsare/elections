import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Validations } from "../Utils/Validations";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [error, errorDispatchFunc] = useReducer(errorFunc, { display: "none", text: "" });

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

	function clearError() {
		error.display === "block" && errorDispatchFunc({ type: "clearError" });
	}
	return <AuthContext.Provider value={{ error, errorDispatchFunc, clearError, validations }}> {children} </AuthContext.Provider>;
};

export function useAuthContext() {
	return useContext(AuthContext);
}
export default AuthProvider;
