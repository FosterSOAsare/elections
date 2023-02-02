import React from "react";
import Rules from "./Steps/Rules";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useElectionContext } from "../../Context/ElectionContext";
import { Navigate } from "react-router-dom";
const CreateElection = () => {
	const { electionData, agreeToRules, setAgreeToRules, stored } = useElectionContext();

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
