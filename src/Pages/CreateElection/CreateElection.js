import React, { useReducer, useState } from "react";
import Rules from "./Steps/Rules";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";

const CreateElection = () => {
	const [electionData, electionDataDispatchFunc] = useReducer(electionDataFunc, { step: 2, data: {} });
	const [agreeToRules, setAgreeToRules] = useState({ state: true, next: true });
	console.log(electionData);

	function electionDataFunc(electionData, action) {
		switch (action.type) {
			case "setData":
				return { step: electionData.step + 1, data: { ...electionData.data, ...action.payload } };
			default:
				return electionData;
		}
	}

	function nextStep(e, form) {
		e.preventDefault();
		let formData = new FormData(form);
		let data = Object.fromEntries(formData.entries());
		electionDataDispatchFunc({ type: "setData", payload: data });
	}

	function cancelElection(e) {
		e.preventDefault();
		setAgreeToRules({ state: false, next: false });
	}

	function prevStep(e) {
		console.log(e);
	}
	return (
		<main className="container createElection">
			<div className="createElection__container">
				{!agreeToRules.next && <Rules agreeToRules={agreeToRules} setAgreeToRules={setAgreeToRules} />}
				{agreeToRules.next && (
					<>
						{electionData.step === 1 && <Step1 nextStep={nextStep} cancelElection={cancelElection} />}
						{electionData.step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
					</>
				)}
			</div>
		</main>
	);
};

export default CreateElection;
