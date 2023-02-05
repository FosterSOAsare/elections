import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { useElectionContext } from "../../Context/ElectionContext";
import Loading from "../../Components/Loading/Loading";
import ElectionComponent from "./ElectionComponent/ElectionComponent";
import NotFound from "../../Components/NotFound/NotFound";
const Election = () => {
	const { electionData, electionDataDispatchFunc } = useElectionContext();
	const [votes, setVotes] = useState([]);
	const { firebase, credentials, notFound, setNotFound } = useAppContext();
	let electionOwner = credentials?.user?.username === electionData?.data?.author;

	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	// Fetch election
	let { electionId } = useParams();
	useEffect(() => {
		// This added is for when a user updates the election. The update wil still be in progress

		electionDataDispatchFunc({ type: "resetData" });
		firebase.fetchElectionWithId(electionId, (res) => {
			if (res.error) return;
			setLoading(false);
			if (res.empty) {
				setNotFound(true);
			}
			electionDataDispatchFunc({ type: "setData", payload: res });
		});
	}, [firebase, electionId, electionDataDispatchFunc, setNotFound]);

	function storeVote(categoryIndex, newVotes) {
		let newData = votes;
		newData[categoryIndex] = newVotes;
		setVotes((prev) => newData);
	}

	// Check found
	useEffect(() => {
		if (electionData.data.status === "pending") {
			let notFound = false;
			if (!credentials?.user) {
				notFound = true;
			} else {
				if (credentials?.user?.username !== electionData?.data?.author) {
					notFound = true;
				}
			}
			setNotFound(notFound);
		}
	}, [credentials, electionData.data, setNotFound]);

	function updateStatus(status) {
		firebase.updateElectionStatus(electionId, status, (res) => {
			if (res.error) return;
			navigate("/");
		});
	}

	return (
		<>
			<>
				{!loading && (
					<>
						{!notFound && (
							<main className="container election">
								<h3 className="intro">Welcome to {electionData.data.name}</h3>
								<p className="intro">{electionData.data.desc}</p>
								<div className="notes">
									<p>
										<span></span> Please click on a candidate to select the candidate
									</p>
									<p>
										<span></span> Not clicking on any candidate leaves the category blank, hence no vote on the category
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

								<div className="actions">
									{electionData.data.status === "pending" && (
										<>
											<button className="button__primary" onClick={() => updateStatus("started")}>
												Start Election
											</button>
											<button className="button__secondary" onClick={() => navigate(`/edit/${electionId}`)}>
												Edit Election
											</button>
										</>
									)}
									{electionData.data.status === "started" && (
										<>
											<button className="button__primary" onClick={() => updateStatus("completed")}>
												Mark Completed
											</button>
											<button className="button__secondary" onClick={() => navigate(`./voters`)}>
												View Voters
											</button>
										</>
									)}
									{electionData.data.status === "completed" && (
										<>
											<button className="button__primary" onClick={() => navigate(`./results`)}>
												View Results
											</button>
											{electionOwner && (
												<button className="button__secondary button__error" onClick={() => navigate(`/edit/${electionId}`)}>
													Delete Election
												</button>
											)}
										</>
									)}
								</div>
							</main>
						)}
						{notFound && <NotFound />}
					</>
				)}
				{loading && <Loading />}
			</>
		</>
	);
};

export default Election;
