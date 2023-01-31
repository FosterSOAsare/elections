import React, { useRef } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";

const Step1 = () => {
	const { nextStep, setAgreeToRules } = useElectionContext();
	function cancelElection(e) {
		e.preventDefault();
		setAgreeToRules({ state: false, next: false });
	}
	const formRef = useRef(null);
	return (
		<section className="step1">
			<form action="" ref={formRef}>
				<label htmlFor="name">Enter name for election</label>
				<input type="text" id="name" name="name" aria-placeholder="Enter election name" />
				<label htmlFor="voters">Enter estimated number of voters</label>
				<input type="text" id="voters" name="voters" aria-placeholder="Enter estimated number of voters" />

				<label htmlFor="desc">Enter election description</label>
				<textarea type="text" id="desc" name="desc" aria-placeholder="Enter election description"></textarea>

				<div className="actions">
					<button className="button__primary" onClick={(e) => nextStep(e, formRef.current)}>
						Next
					</button>
					<button className="button__secondary" onClick={cancelElection}>
						Cancel
					</button>
				</div>
			</form>
		</section>
	);
};

export default Step1;
