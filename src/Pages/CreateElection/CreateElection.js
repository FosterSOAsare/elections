import React, { useEffect } from "react";
import Rules from "./Steps/Rules";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useElectionContext } from "../../Context/ElectionContext";
import { Navigate, useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";

const CreateElection = () => {
	const { electionData, electionDataDispatchFunc, agreeToRules, setAgreeToRules, stored } = useElectionContext();
	const { electionId } = useParams();
	const { firebase } = useAppContext();

	useEffect(() => {
		// Clear ElectionData when user wants to create a new election
		if (!electionId && electionData.data.election_id) {
			electionDataDispatchFunc({ type: "resetData" });
		}
	}, [electionId, electionData, electionDataDispatchFunc]);

	useEffect(() => {
		// Fetch election Data when user needs to edit an election
		if (electionId) {
			electionDataDispatchFunc({ type: "resetData" });
			firebase.fetchElectionWithId(electionId, (res) => {
				electionDataDispatchFunc({ type: "setData", payload: res });
			});
		}
	}, [firebase, electionId, electionDataDispatchFunc]);
	return (
		<main className="container createElection">
			<div className="createElection__container">
				{!agreeToRules.next && <Rules agreeToRules={agreeToRules} setAgreeToRules={setAgreeToRules} />}
				{agreeToRules.next && (
					<>
						{electionData.step === 1 && <Step1 />}
						{electionData.step === 2 && <Step2 />}
						{electionData.step === 3 && <Step3 />}
					</>
				)}
				{stored && <Navigate to="/" />}
			</div>
		</main>
	);
};

export default CreateElection;
