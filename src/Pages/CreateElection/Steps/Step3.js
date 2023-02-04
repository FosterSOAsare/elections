import React, { useReducer } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";
import Category from "../Category/Category";
import LoadingGif from "../../../assets/Images/loading.gif";
import { generateText } from "../../../Utils/Text";
import { useAppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";

const Step3 = () => {
	const { electionData, prevStep, electionDataDispatchFunc, setAgreeToRules, setStored } = useElectionContext();
	const { credentials } = useAppContext();
	const [waiting, waitingDispatchFunc] = useReducer(waitingFunc, { display: false, text: "" });
	const { firebase } = useAppContext();
	const navigate = useNavigate();

	function waitingFunc(waiting, action) {
		switch (action.type) {
			case "setDisplay":
				return { ...waiting, display: action.payload };
			case "setText":
				return { ...waiting, text: action.payload };
			case "reset":
				return { display: false, text: "" };
			default:
				return waiting;
		}
	}

	function storeElection(e) {
		e.preventDefault();
		waitingDispatchFunc({ type: "setDisplay", payload: true });
		waitingDispatchFunc({ type: "setText", payload: "Preparing to store election data" });
		// Generate users
		setTimeout(() => {
			waitingDispatchFunc({ type: "setText", payload: "Storing election data" });

			let data = { ...electionData.data, author: credentials?.user?.username };
			firebase.storeElectionData(data, (res) => {
				waitingDispatchFunc({ type: "setText", payload: "Generating and storing voters" });
				if (res.error) return;

				// Generate and store voters
				let limit = +electionData.data.voters;
				for (let i = 0; i < limit; i++) {
					let id = generateText(10);
					let password = generateText(14);
					// Store voters
					firebase.storeVoter(password, id, res.id, (res) => {
						if (res.error) return;
						if (i === limit - 1) {
							electionDataDispatchFunc({ type: "clearData" });
							waitingDispatchFunc({ type: "reset" });
							setAgreeToRules({ state: false, next: false });
							setStored(true);
							setStored(false);
						}
					});
				}
			});
		}, 2000);

		// Store users

		// Store election data
	}
	function updateElection(e) {
		e.preventDefault();
		firebase.updateElectionData(electionData.data, electionData.data.election_id, (res) => {
			if (res.error) return;
			navigate(`/election/${electionData.data.election_id}`);
		});
	}
	return (
		<section className="step3">
			{!waiting.display && (
				<>
					<h3>Election Preview</h3>
					<p>
						Election name : <span>{electionData.data.name} </span>
					</p>
					<p>
						Election desc : <span>{electionData.data.desc}</span>
					</p>

					<section className="categories">
						<h3>Election Categories </h3>
						{electionData.data.categories.map((e, index) => {
							return <Category key={index} {...e} type="preview" />;
						})}
					</section>
					<div className="actions">
						<button className="button__secondary" onClick={() => prevStep()}>
							Prev
						</button>
						<button className="button__primary" onClick={electionData?.data?.election_id ? updateElection : storeElection}>
							{electionData?.data?.election_id ? "Update" : "Save"} Election
						</button>
					</div>
				</>
			)}
			{waiting.display && (
				<div className="waiting">
					<img src={LoadingGif} alt="Loading" className="loading__img" />
					<p>{waiting.text}</p>
				</div>
			)}
		</section>
	);
};

export default Step3;
