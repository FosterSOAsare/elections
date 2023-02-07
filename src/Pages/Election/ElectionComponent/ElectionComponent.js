import React, { useState } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";

const ElectionComponent = ({ name, categoryIndex, candidates, limit, votes, storeVote, electionOwner, category_id }) => {
	const [actives, setActives] = useState(votes.find((e) => e.category_id === category_id)?.candidates || []);
	const { electionData } = useElectionContext();

	function selectCandidate(candidateId) {
		// // Election owner can not
		if (electionData.data.status === "started" && !electionOwner) {
			limit = parseInt(limit);
			let selected = actives;

			if (actives.length === limit) {
				selected.shift();
				selected = [...selected, candidateId];
			} else {
				selected = [...actives, candidateId];
			}

			storeVote(category_id, selected);
			setActives(selected);
		}
	}

	// Fetch Candidates
	return (
		<section className="election__component">
			<div className="component__header">{name}</div>
			<div className="component__content">
				<div className="candidates">
					{candidates.map((e, index) => {
						return (
							<div key={index} className="candidate" onClick={() => selectCandidate(e.candidate_id)} index={index}>
								<>
									<img src={e.imageURL} alt="" />
									<div className="text__content">
										<p>{e.name}</p>
									</div>
								</>
								{votes && actives.includes(e.candidate_id) && (
									<div className="cover">
										<i className="fa-solid fa-check"></i>
										<p>Selected</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
				<p className="limit">User can select {parseInt(limit) === 1 ? "only 1 candidate" : `${limit} candidates`}</p>
			</div>
		</section>
	);
};

export default ElectionComponent;
