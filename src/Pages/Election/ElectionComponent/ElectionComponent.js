import React, { useState } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";

const ElectionComponent = ({ name, categoryIndex, candidates, limit, votes, storeVote }) => {
	const [actives, setActives] = useState(votes[categoryIndex] || []);
	const { electionData } = useElectionContext();

	function selectCandidate(candidateIndex) {
		if (electionData.data.status === "started") {
			limit = parseInt(limit);
			let selected = actives;
			if (actives.length === limit) {
				selected.shift();
				selected = [...selected, candidateIndex];
			} else {
				selected = [...actives, candidateIndex];
			}

			storeVote(categoryIndex, selected);
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
							<div key={index} className="candidate" onClick={() => selectCandidate(index)} index={index}>
								<>
									<img src={e.imageURL} alt="" />
									<div className="text__content">
										<p>{e.name}</p>
									</div>
								</>
								{votes && actives.includes(index) && (
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
