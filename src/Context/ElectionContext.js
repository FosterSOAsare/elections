import React, { createContext, useContext, useState, useReducer } from "react";

const ElectionContext = createContext();

const ElectionProvider = ({ children }) => {
	const [electionData, electionDataDispatchFunc] = useReducer(electionDataFunc, { step: 2, data: { categories: [] } });
	const [agreeToRules, setAgreeToRules] = useState({ state: true, next: true });
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [showCandidateForm, setShowCandidateForm] = useState({ display: false, categoryIndex: null });

	function electionDataFunc(electionData, action) {
		switch (action.type) {
			case "setData":
				return { step: electionData.step + 1, data: { ...electionData.data, ...action.payload } };
			case "storeCategory":
				return { ...electionData, data: { ...electionData.data, categories: action.payload } };
			case "storeCandidate":
				return { ...electionData, data: { ...electionData.data, categories: action.payload } };
			default:
				return electionData;
		}
	}
	function nextStep(e, form) {
		e.preventDefault();
		let formData = new FormData(form);
		let data = Object.fromEntries(formData.entries());
		electionDataDispatchFunc({ type: "setData", payload: data });
	}
	function prevStep(e) {
		console.log(e);
	}

	function storeCategory(data) {
		let categories = [...electionData.data.categories, data];
		electionDataDispatchFunc({ type: "storeCategory", payload: categories });
		setShowCategoryForm(false);
	}
	function storeCandidate(data) {
		let categories = electionData.data.categories.map((e, index) => {
			return index === showCandidateForm.categoryIndex ? { ...e, candidates: [...e.candidates, data] } : e;
		});
		electionDataDispatchFunc({ type: "storeCategory", payload: categories });
		setShowCandidateForm({ display: false, categoryIndex: null });
	}

	return (
		<ElectionContext.Provider
			value={{
				agreeToRules,
				setAgreeToRules,
				electionData,
				electionDataDispatchFunc,
				storeCategory,
				showCandidateForm,
				setShowCategoryForm,
				nextStep,
				prevStep,
				showCategoryForm,
				setShowCandidateForm,
				storeCandidate,
			}}>
			{children}
		</ElectionContext.Provider>
	);
};

export function useElectionContext() {
	return useContext(ElectionContext);
}
export default ElectionProvider;
