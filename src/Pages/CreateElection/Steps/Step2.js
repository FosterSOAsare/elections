import React, { useState } from "react";
import CategoryPopup from "../CategoryPopup/CategoryPopup";
import Category from "../Category/Category";
import CandidatePopup from "../CandidatePopup/CandidatePopup";

const Step2 = () => {
	const [categoriesData, setCategoriesData] = useState([]);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [candidateForm, setCandidateForm] = useState({ display: false, category_id: null });

	function storeCategoriesData(data) {
		data.candidates = [];
		data = [...categoriesData, data];
		setCategoriesData(data);
		setShowCategoryForm(false);
	}

	function storeCandidate(data) {
		let newCategoriesData = categoriesData.map((e, index) => {
			return index === candidateForm.category_id ? { ...e, candidates: [...e.candidates, data] } : e;
		});
		setCategoriesData(newCategoriesData);
		setCandidateForm({ display: false, category_id: null });
	}
	return (
		<>
			<section className="step2">
				<h3>Add Categories and Candidates</h3>

				<div className="categories">
					<div className="category add" onClick={() => setShowCategoryForm(true)}>
						<i className="fa-solid fa-plus"></i>
						<p>Add a new category</p>
					</div>
					{categoriesData.map((e, index) => {
						return <Category key={index} {...e} index={index} setCandidateForm={setCandidateForm} />;
					})}
				</div>

				{showCategoryForm && <CategoryPopup storeCategoriesData={storeCategoriesData} />}
				{candidateForm.display && <CandidatePopup storeCandidate={storeCandidate} setCandidateForm={setCandidateForm} />}
			</section>
		</>
	);
};

export default Step2;
