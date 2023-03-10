import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import Firebase from "../Utils/Firebase";
import { useLocation } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({ children }) => {
	const [credentials, credentialsDispatchFunc] = useReducer(credentailsFunc, { userId: localStorage.getItem("election:userId") || null, user: null });
	const location = useLocation();
	const [notFound, setNotFound] = useState(false);
	const firebase = useMemo(() => {
		return new Firebase();
	}, []);

	function credentailsFunc(credentails, action) {
		switch (action.type) {
			case "setUserId":
				return { ...credentails, userId: action.payload };
			case "setUser":
				return { ...credentails, user: action.payload };
			case "logOut":
				return { user: null, userId: null };
			default:
				return credentails;
		}
	}

	useEffect(() => {
		// Fetch the user details of logged in user
		credentials?.userId &&
			firebase.fetchUserWithUid(credentials?.userId, (res) => {
				if (res.error) return;
				if (res.empty) {
					// Logout user
					if (navigator.onLine) {
						credentialsDispatchFunc({ type: "logOut" });
					}
					return;
				}
				credentialsDispatchFunc({ type: "setUser", payload: res });
			});
	}, [firebase, credentials?.userId]);

	useEffect(() => {
		if (credentials?.userId) {
			localStorage.setItem("election:userId", credentials?.userId);
		} else {
			localStorage.removeItem("election:userId");
		}
	}, [credentials?.userId]);

	useEffect(() => {
		setNotFound(false);
	}, [location]);

	return <AppContext.Provider value={{ firebase, credentials, credentialsDispatchFunc, notFound, setNotFound }}>{children}</AppContext.Provider>;
};

export function useAppContext() {
	return useContext(AppContext);
}
export default AppProvider;
