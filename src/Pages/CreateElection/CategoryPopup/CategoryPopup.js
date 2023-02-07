import React, { useRef, useState } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";
import Error from "../../../Components/form/Error";
import { useAuthContext } from "../../../Context/AuthContext";

const CategoryPopup = () => {
	const { electionData, setShowCategoryForm, storeCategory, editDataIndex, updateCategory, setEditDataIndex } = useElectionContext();
	const { error, errorDispatchFunc, clearError, validations } = useAuthContext();

	const formRef = useRef(null);
	let editData = null;
	if (editDataIndex?.categoryIndex !== null) {
		editData = electionData?.data?.categories[editDataIndex?.categoryIndex];
	}

	const [categoryData, setCategoryData] = useState(
		editData || {
			name: "",
			limit: "",
			candidates: [],
		}
	);

	function handleChange(event) {
		let input = event.target;
		let key = input.name;
		setCategoryData((prev) => {
			return { ...prev, [key]: input.value };
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		// Form validations
		let formData = new FormData(formRef.current);
		let name = formData.get("name");
		let limit = formData.get("limit");

		if (!name || !limit) {
			errorDispatchFunc({ type: "displayError", payload: "Please fill in all credentials" });
			return;
		}
		if (!validations.validateName(name)) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter a valid category name" });
			return;
		}
		if (!validations.validateNumber(limit)) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter a valid limit : (Numbers only) " });
			return;
		}
		if (electionData?.data?.categories) {
			if (editDataIndex?.categoryIndex !== null && electionData?.data?.categories[editDataIndex?.categoryIndex]) {
				updateCategory(categoryData, editDataIndex?.categoryIndex);
			} else {
				storeCategory(categoryData);
			}
		}
	}
	return (
		<aside className="categoryPopup container">
			<form action="" onSubmit={handleSubmit} ref={formRef}>
				<label htmlFor="name"> Enter category name:</label>
				<input type="text" name="name" id="name" value={categoryData?.name} onChange={handleChange} onFocus={clearError} />
				<label htmlFor="limit"> Enter selection limit:</label>
				<input type="text" name="limit" id="limit" value={categoryData?.limit} onChange={handleChange} onFocus={clearError} />
				{error.display === "block" && <Error text={error.text} />}
				<div className="actions">
					<button className="button__primary">Continue</button>
					<button
						className="button__secondary"
						onClick={() => {
							setEditDataIndex({ categoryIndex: null, candidateIndex: null });
							setShowCategoryForm(false);
						}}>
						Cancel
					</button>
				</div>
			</form>
		</aside>
	);
};

export default CategoryPopup;
