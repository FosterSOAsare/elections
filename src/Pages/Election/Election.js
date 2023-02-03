import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { useElectionContext } from "../../Context/ElectionContext";
import ElectionComponent from "./ElectionComponent/ElectionComponent";
const Election = () => {
	const { electionData, electionDataDispatchFunc } = useElectionContext();
	const [votes, setVotes] = useState([]);
	const { firebase } = useAppContext();
	// Fetch election
	let { electionId } = useParams();
	useEffect(() => {
		firebase.fetchElectionWithId(electionId, (res) => {
			electionDataDispatchFunc({ type: "resetData" });
			electionDataDispatchFunc({ type: "setData", payload: res });
		});
	}, [firebase, electionId, electionDataDispatchFunc]);

	function storeVote(categoryIndex, newVotes) {
		let newData = votes;
		newData[categoryIndex] = newVotes;
		setVotes((prev) => newData);
	}

	return (
		<main className="container election">
			<h3 className="intro">Welcome to {electionData.data.name}</h3>

			<p className="intro">{electionData.data.desc}</p>
			<div className="notes">
				<p>
					<span></span> Please click on a candidate to select the candidate
				</p>
				<p>
					<span></span> Not clicking on any candidate leaves the category blank, hence no vote
				</p>
				<p>
					<span></span> Selection more than the limit will toggle the previous selections
				</p>
			</div>

			<section className="components">
				{electionData.data.categories &&
					electionData.data.categories.map((e, index) => {
						return <ElectionComponent key={index} {...e} election_id={electionId} categoryIndex={index} votes={votes} storeVote={storeVote} />;
					})}
			</section>
		</main>
	);
};

export default Election;
