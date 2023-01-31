import React from "react";
import Rules from "./Steps/Rules";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import { useElectionContext } from "../../Context/ElectionContext";
const CreateElection = () => {
	const { electionData, agreeToRules, setAgreeToRules } = useElectionContext();

	return (
		<main className="container createElection">
			<div className="createElection__container">
				{!agreeToRules.next && <Rules agreeToRules={agreeToRules} setAgreeToRules={setAgreeToRules} />}
				{agreeToRules.next && (
					<>
						{electionData.step === 1 && <Step1 />}
						{electionData.step === 2 && <Step2 />}
					</>
				)}
			</div>
		</main>
	);
};

export default CreateElection;
