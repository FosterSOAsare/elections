import React from "react";
import { useElectionContext } from "../../../../Context/ElectionContext";

const Candidate = ({ name, imageURL, imageFile, candidateIndex, categoryIndex, setCandidateForm }) => {
	const { deleteCandidate } = useElectionContext();
	return (
		<div className="candidate">
			<img src={imageURL} alt="candidate" />
			<div className="details">
				<p>{name}</p>
				<div className="actions">
					<i className="fa-solid fa-pencil small"></i>
					<i className="fa-solid fa-trash small delete" onClick={() => deleteCandidate(categoryIndex, candidateIndex)}></i>
				</div>
			</div>
		</div>
	);
};

export default Candidate;
