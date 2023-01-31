import React, { useRef } from "react";

const CategoryPopup = ({ storeCategoriesData }) => {
	const formRef = useRef(null);

	function addCategory() {
		let formData = new FormData(formRef.current);
		let data = Object.fromEntries(formData.entries());
		storeCategoriesData(data);
	}
	return (
		<aside className="categoryPopup container">
			<form action="" onSubmit={(e) => e.preventDefault()} ref={formRef}>
				<label htmlFor="name"> Enter category name:</label>
				<input type="text" name="name" id="name" />
				<label htmlFor="limit"> Enter selection limit:</label>
				<input type="text" name="limit" id="limit" />
				<div className="actions">
					<button className="button__primary" onClick={addCategory}>
						Continue
					</button>
					<button className="button__secondary">Cancel</button>
				</div>
			</form>
		</aside>
	);
};

export default CategoryPopup;
