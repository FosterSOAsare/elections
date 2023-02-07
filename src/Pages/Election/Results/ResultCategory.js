import React, { useMemo } from "react";

const ResultCategory = ({ name, candidates, limit }) => {
	let totalVotes = useMemo(() => {
		return candidates.reduce((total, candidate) => total + candidate.votes, 0);
	}, [candidates]);
	return (
		<section className="result___category">
			<table>
				<caption>{name}</caption>
				<thead>
					<tr>
						<th>Position</th>
						<th>Candidate Name</th>
						<th>Votes</th>
						<th>Percentage</th>
					</tr>
				</thead>
				<tbody>
					{candidates
						.sort((a, b) => b.votes - a.votes)
						.map((candidate, index) => {
							return (
								<tr key={candidate.candidate_id} className={limit >= index + 1 ? "won" : "lost"}>
									<td>{index + 1}</td>
									<td>{candidate.name}</td>
									<td>{candidate.votes}</td>
									<td>{((candidate.votes / totalVotes) * 100).toFixed(2)}</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</section>
	);
};

export default ResultCategory;
