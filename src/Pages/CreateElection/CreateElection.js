import React, { useEffect, useState } from "react";
import Rules from "./Steps/Rules";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useElectionContext } from "../../Context/ElectionContext";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import NotFound from "../../Components/NotFound/NotFound";
import Loading from "../../Components/Loading/Loading";

const CreateElection = () => {
	const { electionData, electionDataDispatchFunc, agreeToRules, setAgreeToRules } = useElectionContext();
	const { electionId } = useParams();
	const { firebase, notFound, setNotFound } = useAppContext();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Clear ElectionData when user wants to create a new election
		if (!electionId && electionData.data.election_id) {
			electionDataDispatchFunc({ type: "resetData" });
		}
	}, [electionId, electionData, electionDataDispatchFunc]);

	useEffect(() => {
		// Fetch election Data when user needs to edit an election
		if (electionId) {
			setLoading(true);
			electionDataDispatchFunc({ type: "resetData" });
			firebase.fetchElectionWithId(electionId, (res) => {
				setLoading(false);
				if (res.error) return;
				if (res.empty || res.status !== "pending") {
					setNotFound(true);
					return;
				}
				electionDataDispatchFunc({ type: "setData", payload: res });
			});
		}
	}, [firebase, electionId, electionDataDispatchFunc, setNotFound]);
	return (
		<>
			{!loading && (
				<main className="container createElection">
					{!notFound && (
						<div className="createElection__container">
							{!agreeToRules.next && <Rules agreeToRules={agreeToRules} setAgreeToRules={setAgreeToRules} />}
							{agreeToRules.next && (
								<>
									{electionData.step === 1 && <Step1 />}
									{electionData.step === 2 && <Step2 />}
									{electionData.step === 3 && <Step3 />}
								</>
							)}
						</div>
					)}
					{notFound && <NotFound />}
				</main>
			)}
			{loading && <Loading />}
		</>
	);
};

export default CreateElection;
