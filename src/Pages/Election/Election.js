import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { useElectionContext } from "../../Context/ElectionContext";
import Loading from "../../Components/Loading/Loading";
import ElectionComponent from "./ElectionComponent/ElectionComponent";
import NotFound from "../../Components/NotFound/NotFound";
import { useOutletContext } from "react-router-dom";
const Election = () => {
	const { electionData, electionDataDispatchFunc } = useElectionContext();
	const [votes, setVotes] = useState([]);
	const [voted, setVoted] = useState(false);
	const { firebase, credentials, notFound, setNotFound } = useAppContext();
	let electionOwner = credentials?.user?.username === electionData?.data?.author;

	const navigate = useNavigate();
	const { pageLoading, setPageLoading } = useOutletContext();

	// Fetch election
	let { electionId } = useParams();
	useEffect(() => {
		electionDataDispatchFunc({ type: "resetData" });
		firebase.fetchElectionWithId(electionId, (res) => {
			if (res.error) return;

			setPageLoading(false);
			if (res.empty) {
				setNotFound(true);
			}
			electionDataDispatchFunc({ type: "setData", payload: res });
			// Check if user has logged in or not , also check if user is the election owner. When the election is marked as started
			if (res.status === "started") {
				let voter_id = localStorage.getItem("election:voter");
				// If not logged in redirect user to log in
				if (((credentials?.user?.username && res.author !== credentials?.user?.username) || !credentials.userId) && !voter_id) {
					// User is not logged in
					navigate("./login");
				} else if (voter_id) {
					// Check legitimacy. Redirect if the voter_id is invalid
					firebase.fetchVoterWithId(electionId, voter_id, (res) => {
						if (res.error) return;
						if (res.empty) {
							// Delete local storage
							localStorage.removeItem("election:voter");
							navigate("./login");
						}

						// Check if user has voted already or not
						setVoted(res.voted);
					});
				}
			}
		});
	}, [firebase, electionId, electionDataDispatchFunc, setNotFound, setPageLoading, credentials, navigate]);

	// For setting category votes
	function storeVote(category_id, candidates) {
		let field = votes.find((e) => e.category_id === category_id);
		if (!field) {
			setVotes((prev) => [...prev, { category_id, candidates }]);
		} else {
			setVotes((prev) => prev.map((e) => (e.category_id === category_id ? { ...e, candidates } : e)));
		}
	}

	// Check page found
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

	// The account that created the election can not vote .
	// They can only do so if they log out or use a different machine

	function updateStatus(status) {
		firebase.updateElectionStatus(electionId, status, (res) => {
			if (res.error) return;
			navigate("/");
		});
	}

	function storeUserVotes() {
		firebase.insertVote(votes, electionId, localStorage.getItem("election:voter"), (res) => {
			if (res.error) return;
			// Saved
			setVoted(true);
			setTimeout(() => {
				localStorage.removeItem("election:voter");
				navigate("./login");
			}, 4000);
		});
	}

	function newLogin() {
		// Delete local storage
		localStorage.removeItem("election:voter");
		navigate("./login");
	}
	return (
		<>
			<>
				{!pageLoading && (
					<>
						{!notFound && (
							<main className="container election">
								{!voted && (
									<>
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
													return (
														<ElectionComponent
															key={index}
															{...e}
															election_id={electionId}
															categoryIndex={index}
															votes={votes}
															storeVote={storeVote}
															electionOwner={electionOwner}
														/>
													);
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
													{electionOwner && (
														<>
															<button className="button__primary" onClick={() => updateStatus("completed")}>
																Mark Completed
															</button>

															<button className="button__secondary" onClick={() => navigate(`./voters`)}>
																View Voters
															</button>
														</>
													)}
													{!electionOwner && (
														<button className="button__primary" onClick={storeUserVotes}>
															Confirm Vote
														</button>
													)}
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
									</>
								)}
								{voted && (
									<div className="voted">
										<i className="fa-solid fa-check"></i>
										<h3 className="intro">Your response has been received </h3>
										<p className="intro">Please check back after election is finalized for election results</p>

										<button onClick={newLogin}>Log in to a different account</button>
									</div>
								)}
							</main>
						)}
						{notFound && <NotFound />}
					</>
				)}
				{pageLoading && <Loading />}
			</>
		</>
	);
};

export default Election;
