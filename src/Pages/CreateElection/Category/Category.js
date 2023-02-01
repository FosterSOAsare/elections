import React, { useState } from "react";
import Candidate from "./Candidate/Candidate";
import { useElectionContext } from "../../../Context/ElectionContext";

const Category = ({ name, categoryIndex, candidates = [], type, limit }) => {
	const { deleteCategory, setShowCategoryForm, setEditDataIndex } = useElectionContext();
	const { setShowCandidateForm } = useElectionContext();
	const [showContent, setShowContent] = useState(true);
	const [done, setDone] = useState(false);

	function prepareEdit() {
		setEditDataIndex({ categoryIndex: categoryIndex });
		setShowCategoryForm(true);
	}
	return (
		<div className="category" id={"category" + categoryIndex}>
			<div className="category__header">
				<h4>{name}</h4>
				<div className="actions">
					{type !== "preview" && !done && (
						<>
							<i className="fa-solid fa-pencil small" onClick={prepareEdit}></i>
							<i className="fa-solid fa-trash small delete" onClick={() => deleteCategory(categoryIndex)}></i>
						</>
					)}
					<i className={`fa-solid fa-caret-${!showContent ? "down" : "up"}`} onClick={() => setShowContent((prev) => !prev)}></i>
				</div>
			</div>

			{showContent && (
				<div className="candidates">
					<p className="note">
						NB:
						<span>
							User must select
							<b>
								{" " + limit} candidate{parseInt(limit) === 1 ? "" : "s"}
							</b>
						</span>
					</p>
					<h3>Candidates</h3>
					<div className="content">
						{type !== "preview" && (
							<div className="candidate add" onClick={() => setShowCandidateForm({ display: true, categoryIndex })}>
								<i className="fa-solid fa-plus"></i>
								<p>Add new candidate</p>
							</div>
						)}
						{candidates.map((e, index) => {
							return <Candidate key={index} {...e} candidateIndex={index} {...{ type, done, setDone, categoryIndex }} />;
						})}
					</div>
				</div>
			)}

			{!done && type !== "preview" && (
				<div className="markDone">
					<button
						className="button__primary"
						onClick={() => {
							setDone(true);
						}}>
						Done
					</button>
				</div>
			)}
		</div>
	);
};

export default Category;
