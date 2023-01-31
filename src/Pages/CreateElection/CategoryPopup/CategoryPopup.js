import React, { useRef, useState } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";

const CategoryPopup = ({ categoryPrevData }) => {
	const { setShowCategoryForm, storeCategory } = useElectionContext();
	const formRef = useRef(null);
	const [categoryData, setCategoryData] = useState(
		categoryPrevData || {
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
		storeCategory(categoryData);
	}
	return (
		<aside className="categoryPopup container">
			<form action="" onSubmit={handleSubmit} ref={formRef}>
				<label htmlFor="name"> Enter category name:</label>
				<input type="text" name="name" id="name" value={categoryData?.name} onChange={handleChange} />
				<label htmlFor="limit"> Enter selection limit:</label>
				<input type="text" name="limit" id="limit" value={categoryData?.limit} onChange={handleChange} />
				<div className="actions">
					<button className="button__primary">Continue</button>
					<button className="button__secondary" onClick={() => setShowCategoryForm(false)}>
						Cancel
					</button>
				</div>
			</form>
		</aside>
	);
};

export default CategoryPopup;
