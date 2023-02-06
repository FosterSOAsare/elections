import React, { useRef } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../../../Components/form/Error";
import { useAuthContext } from "../../../Context/AuthContext";

const Step1 = () => {
	const { nextStep, setAgreeToRules, electionData, electionDataDispatchFunc } = useElectionContext();
	const { electionId } = useParams();
	const navigate = useNavigate();
	const { error, errorDispatchFunc, clearError, validations } = useAuthContext();
	const formRef = useRef(null);

	function cancelElection(e) {
		e.preventDefault();
		if (electionId) {
			navigate(`/election/${electionId}`);
			// Navigate to election
			return;
		}
		setAgreeToRules({ state: false, next: false });
	}
	function formValidation(e) {
		let formData = new FormData(formRef.current);
		let name = formData.get("name");
		let desc = formData.get("desc");
		let voters = formData.get("voters");
		if (!name || !voters || !desc) {
			errorDispatchFunc({ type: "displayError", payload: "Please fill in all credentials" });
			return false;
		}

		if (!validations.validateName(name)) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter a valid name" });
			return false;
		}
		if (!validations.validateNumber(voters)) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter a valid number of voters" });
			return false;
		}
		if (validations.checkLength(desc, 25)) {
			errorDispatchFunc({ type: "displayError", payload: "Description should not be less than 25 characters" });
			return false;
		}
		return true;
	}

	function storeChanges(e) {
		// Form validation
		electionDataDispatchFunc({ type: "storeProperty", name: e.target.name, payload: e.target.value });
	}

	return (
		<section className="step1">
			<form action="" ref={formRef}>
				<label htmlFor="name">Enter name for election</label>
				<input type="text" id="name" name="name" aria-placeholder="Enter election name" value={electionData?.data?.name || ""} onChange={storeChanges} onFocus={clearError} />
				<label htmlFor="voters">Enter estimated number of voters</label>
				<input
					type="text"
					id="voters"
					name="voters"
					aria-placeholder="Enter estimated number of voters"
					value={electionData?.data?.voters || ""}
					onChange={storeChanges}
					onFocus={clearError}
				/>

				<label htmlFor="desc">Enter election description</label>
				<textarea type="text" id="desc" name="desc" aria-placeholder="Enter election description" value={electionData?.data.desc || ""} onChange={storeChanges} onFocus={clearError}></textarea>

				{error.display === "block" && <Error text={error.text} />}
				<div className="actions">
					{
						<button className="button__secondary" onClick={cancelElection}>
							Cancel
						</button>
					}
					<button
						className="button__primary"
						onClick={(e) => {
							e.preventDefault();
							// Form validation
							if (formValidation(e)) {
								// Move to next step if there is no error
								nextStep(e, formRef.current);
							}
						}}>
						Next
					</button>
				</div>
			</form>
		</section>
	);
};

export default Step1;
