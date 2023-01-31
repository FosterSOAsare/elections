import React, { useState } from "react";
import Candidate from "./Candidate/Candidate";
import { useElectionContext } from "../../../Context/ElectionContext";

const Category = ({ name, categoryIndex, candidates = [] }) => {
	const { deleteCategory, setShowCategoryForm, setEditDataIndex } = useElectionContext();
	const { setShowCandidateForm } = useElectionContext();
	const [showContent, setShowContent] = useState(true);

	function prepareEdit() {
		setEditDataIndex({ categoryIndex: categoryIndex });
		setShowCategoryForm(true);
	}
	return (
		<div className="category" id={"category" + categoryIndex}>
			<div className="category__header">
				<h4>{name}</h4>
				<div className="actions">
					<i className="fa-solid fa-pencil small" onClick={prepareEdit}></i>
					<i className="fa-solid fa-trash small delete" onClick={() => deleteCategory(categoryIndex)}></i>
					<i className={`fa-solid fa-caret-${!showContent ? "down" : "up"}`} onClick={() => setShowContent((prev) => !prev)}></i>
				</div>
			</div>

			{showContent && (
				<div className="candidates">
					<h3>Candidates</h3>
					<div className="content">
						<div className="candidate add" onClick={() => setShowCandidateForm({ display: true, categoryIndex })}>
							<i className="fa-solid fa-plus"></i>
							<p>Add new candidate</p>
						</div>
						{candidates.map((e, index) => {
							return <Candidate key={index} {...e} candidateIndex={index} categoryIndex={categoryIndex} />;
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default Category;
