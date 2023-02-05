import React, { useRef } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";
import { useNavigate, useParams } from "react-router-dom";

const Step1 = () => {
	const { nextStep, setAgreeToRules, electionData, electionDataDispatchFunc } = useElectionContext();
	const { electionId } = useParams();
	const navigate = useNavigate();

	function cancelElection(e) {
		e.preventDefault();
		if (electionId) {
			navigate(`/election/${electionId}`);
			// Navigate to election
			return;
		}
		setAgreeToRules({ state: false, next: false });
	}

	function storeChanges(e) {
		electionDataDispatchFunc({ type: "storeProperty", name: e.target.name, payload: e.target.value });
	}
	const formRef = useRef(null);
	return (
		<section className="step1">
			<form action="" ref={formRef}>
				<label htmlFor="name">Enter name for election</label>
				<input type="text" id="name" name="name" aria-placeholder="Enter election name" value={electionData?.data?.name || ""} onChange={storeChanges} />
				<label htmlFor="voters">Enter estimated number of voters</label>
				<input type="text" id="voters" name="voters" aria-placeholder="Enter estimated number of voters" value={electionData?.data?.voters || ""} onChange={storeChanges} />

				<label htmlFor="desc">Enter election description</label>
				<textarea type="text" id="desc" name="desc" aria-placeholder="Enter election description" value={electionData?.data.desc || ""} onChange={storeChanges}></textarea>

				<div className="actions">
					{
						<button className="button__secondary" onClick={cancelElection}>
							Cancel
						</button>
					}
					<button
						className="button__primary"
						onClick={(e) => {
							nextStep(e, formRef.current);
						}}>
						Next
					</button>
				</div>
			</form>
		</section>
	);
};

export default Step1;
