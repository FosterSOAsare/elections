import React, { createContext, useEffect, useMemo } from "react";
import Firebase from "../Utils/Firebase";

const AppContext = createContext();

const AppProvider = ({ children }) => {
	const firebase = useMemo(() => {
		return new Firebase();
	}, []);

	console.log(firebase);
	return <AppContext.Provider value={{ firebase }}>{children}</AppContext.Provider>;
};

export function useAppContext() {
	return useEffect(AppContext);
}
export default AppProvider;
