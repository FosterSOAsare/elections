import React from "react";
import CategoryPopup from "../CategoryPopup/CategoryPopup";
import Category from "../Category/Category";
import CandidatePopup from "../CandidatePopup/CandidatePopup";
import { useElectionContext } from "../../../Context/ElectionContext";

const Step2 = () => {
	const { electionData, showCategoryForm, showCandidateForm, setShowCategoryForm } = useElectionContext();

	return (
		<>
			<section className="step2">
				<h3>Add Categories and Candidates</h3>

				<div className="categories">
					<div className="category add" onClick={() => setShowCategoryForm(true)}>
						<i className="fa-solid fa-plus"></i>
						<p>Add a new category</p>
					</div>
					{electionData?.data?.categories?.map((e, index) => {
						return <Category key={index} {...e} categoryIndex={index} />;
					})}
				</div>

				{electionData?.data?.categories?.length > 0 && (
					<div className="actions">
						<button className="button__secondary">Prev</button>
						<button className="button__primary">Next</button>
					</div>
				)}

				{showCategoryForm && <CategoryPopup />}
				{showCandidateForm.display && <CandidatePopup />}
			</section>
		</>
	);
};

export default Step2;
