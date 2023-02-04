import React, { createContext, useContext, useState, useReducer, useEffect } from "react";

const ElectionContext = createContext();

const ElectionProvider = ({ children }) => {
	let startUp = { step: 1, data: { categories: [] } };
	const [electionData, electionDataDispatchFunc] = useReducer(electionDataFunc, { ...(JSON.parse(localStorage.getItem("electionData")) || { ...startUp }) });
	const [agreeToRules, setAgreeToRules] = useState({ state: true, next: true });
	const [editDataIndex, setEditDataIndex] = useState({ candidateIndex: null, categoryIndex: null });
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [showCandidateForm, setShowCandidateForm] = useState({ display: false, categoryIndex: null });
	const [stored, setStored] = useState(false);

	useEffect(() => {
		localStorage.setItem("electionData", JSON.stringify(electionData));
	}, [electionData]);
	function electionDataFunc(electionData, action) {
		switch (action.type) {
			case "setData":
				return { ...electionData, data: { ...electionData.data, ...action.payload } };
			case "resetData":
				return { step: 3, data: {} };
			case "clearData":
				return startUp;
			case "prevStep":
				return { ...electionData, step: parseInt(electionData.step) - 1 };
			case "nextStep":
				return { ...electionData, step: parseInt(electionData.step) + 1 };
			case "storeCategory":
				return { ...electionData, data: { ...electionData.data, categories: action.payload } };
			case "storeProperty":
				return { ...electionData, data: { ...electionData.data, [action.name]: action.payload } };
			case "storeCandidate":
				return { ...electionData, data: { ...electionData.data, categories: action.payload } };
			default:
				return electionData;
		}
	}

	function nextStep(e, form) {
		e.preventDefault();
		electionDataDispatchFunc({ type: "nextStep" });
		setShowCandidateForm(false);
		setShowCategoryForm(false);
		setEditDataIndex({ categoryIndex: null, candidateIndex: null });
	}
	function prevStep() {
		electionDataDispatchFunc({ type: "prevStep" });
		setShowCandidateForm(false);
		setShowCategoryForm(false);
		setEditDataIndex({ categoryIndex: null, candidateIndex: null });
	}

	function storeCategory(data) {
		let categories = [...electionData.data.categories, data];
		electionDataDispatchFunc({ type: "storeCategory", payload: categories });
		setShowCategoryForm(false);
	}
	function storeCandidate(data) {
		let categoryIndex = showCandidateForm.categoryIndex !== null ? showCandidateForm.categoryIndex : data.categoryIndex !== null ? data.categoryIndex : null;

		if (data.categoryIndex) delete data.categoryIndex;
		let categories = electionData.data.categories.map((e, index) => {
			return index === categoryIndex ? { ...e, candidates: [...e.candidates, data] } : e;
		});
		electionDataDispatchFunc({ type: "storeCategory", payload: categories });
		setShowCandidateForm({ display: false, categoryIndex: null });
	}
	function updateCategory(data, categoryIndex) {
		let categories = electionData.data.categories.map((e, index) => {
			return index === categoryIndex ? { ...data } : e;
		});
		electionDataDispatchFunc({ type: "storeCategory", payload: categories });
		setShowCategoryForm(false);
		setEditDataIndex({ candidateIndex: null, categoryIndex: null });
	}

	function updateCandidate(data, categoryIndex, candidateIndex) {
		let categoriesData = electionData.data.categories.map((category, index) => {
			if (index === categoryIndex) {
				let candidates = category.candidates.map((e, index) => {
					return index === candidateIndex ? data : e;
				});
				return { ...category, candidates };
			}
			return category;
		});
		electionDataDispatchFunc({ type: "storeCategory", payload: categoriesData });
		setShowCandidateForm({ display: false, categoryIndex: null });
		setEditDataIndex({ candidateIndex: null, categoryIndex: null });
	}

	function deleteCandidate(categoryIndex, candidateIndex) {
		let categoriesData = electionData.data.categories.map((e, index) => {
			if (index === categoryIndex) {
				return { ...e, candidates: e.candidates.filter((candidate, index) => index !== candidateIndex) };
			}
			return e;
		});
		electionDataDispatchFunc({ type: "storeCategory", payload: categoriesData });
	}

	function deleteCategory(categoryIndex) {
		let categoriesData = electionData.data.categories.filter((e, index) => {
			return index !== categoryIndex;
		});
		electionDataDispatchFunc({ type: "storeCategory", payload: categoriesData });
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
				deleteCandidate,
				deleteCategory,
				editDataIndex,
				setEditDataIndex,
				updateCategory,
				updateCandidate,
				stored,
				setStored,
			}}>
			{children}
		</ElectionContext.Provider>
	);
};

export function useElectionContext() {
	return useContext(ElectionContext);
}
export default ElectionProvider;
