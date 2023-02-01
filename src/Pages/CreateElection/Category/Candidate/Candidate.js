import React from "react";
import { useElectionContext } from "../../../../Context/ElectionContext";

const Candidate = ({ name, imageURL, candidateIndex, categoryIndex, type, done }) => {
	const { deleteCandidate, setEditDataIndex, setShowCandidateForm } = useElectionContext();

	function setEdit() {
		setEditDataIndex({ categoryIndex, candidateIndex });
		setShowCandidateForm({ display: true, categoryIndex });
	}
	return (
		<div className="candidate">
			<img src={imageURL} alt="candidate" />
			<div className="details">
				<p>{name}</p>
				{type !== "preview" && !done && (
					<div className="actions">
						<i className="fa-solid fa-pencil small" onClick={setEdit}></i>
						<i className="fa-solid fa-trash small delete" onClick={() => deleteCandidate(categoryIndex, candidateIndex)}></i>
					</div>
				)}
			</div>
		</div>
	);
};

export default Candidate;
