import React from "react";

const Candidate = ({ name, imageURL, imageFile, candidateIndex, categoryIndex, setCandidateForm }) => {
	function deleteCandidate() {}
	return (
		<div className="candidate">
			<img src={imageURL} alt="candidate" />
			<div className="details">
				<p>{name}</p>
				<div className="actions">
					<i className="fa-solid fa-pencil small"></i>
					<i className="fa-solid fa-trash small delete" onClick={deleteCandidate}></i>
				</div>
			</div>
		</div>
	);
};

export default Candidate;
