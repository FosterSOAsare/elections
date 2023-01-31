import React, { useState } from "react";
import Candidate from "./Candidate/Candidate";

const Category = ({ name, index, setCandidateForm, candidates = [] }) => {
	const [showContent, setShowContent] = useState(true);
	return (
		<div className="category" id={"category" + index}>
			<div className="category__header">
				<h4>{name}</h4>
				<i className={`fa-solid fa-caret-${!showContent ? "down" : "up"}`} onClick={() => setShowContent((prev) => !prev)}></i>
			</div>

			{showContent && (
				<div className="candidates">
					<h3>Candidates</h3>
					<div className="content">
						<div className="candidate add" onClick={() => setCandidateForm({ display: true, category_id: index })}>
							<i className="fa-solid fa-plus"></i>
							<p>Add new candidate</p>
						</div>
						{candidates.map((e, index) => {
							return <Candidate key={index} {...e} />;
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default Category;
