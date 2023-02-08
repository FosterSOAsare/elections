import React from "react";
import CategoryPopup from "../CategoryPopup/CategoryPopup";
import Category from "../Category/Category";
import CandidatePopup from "../CandidatePopup/CandidatePopup";
import { useElectionContext } from "../../../Context/ElectionContext";
import Error from "../../../Components/form/Error";
import { useAuthContext } from "../../../Context/AuthContext";

const Step2 = () => {
	const { electionData, showCategoryForm, showCandidateForm, setShowCategoryForm, prevStep, electionDataDispatchFunc } = useElectionContext();
	const { error, errorDispatchFunc } = useAuthContext();

	function previewElection() {
		let limitPassed = electionData.data.categories.every((category) => {
			return parseInt(category.limit) < category.candidates.length;
		});
		if (!limitPassed) {
			errorDispatchFunc({ type: "displayError", payload: "Please make sure all categories have more candidates than the limit specified " });
			setTimeout(() => {
				errorDispatchFunc({ type: "clearError" });
			}, 5000);
			return;
		}
		electionDataDispatchFunc({ type: "nextStep" });
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
					{electionData?.data?.categories?.map((e, index) => {
						return <Category key={index} {...e} categoryIndex={index} />;
					})}
				</div>

				{error.display === "block" && <Error text={error.text} />}

				{electionData?.data?.categories?.length > 0 && (
					<div className="actions">
						<button className="button__secondary" onClick={prevStep}>
							Prev
						</button>
						<button className="button__primary" onClick={previewElection}>
							Preview Election
						</button>
					</div>
				)}

				{showCategoryForm && <CategoryPopup />}
				{showCandidateForm.display && <CandidatePopup />}
			</section>
		</>
	);
};

export default Step2;
