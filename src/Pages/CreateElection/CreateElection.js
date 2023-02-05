import React, { useEffect } from "react";
import Rules from "./Steps/Rules";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useElectionContext } from "../../Context/ElectionContext";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import NotFound from "../../Components/NotFound/NotFound";
import Loading from "../../Components/Loading/Loading";
import { useOutletContext } from "react-router-dom";

const CreateElection = () => {
	const { electionData, electionDataDispatchFunc, agreeToRules, setAgreeToRules } = useElectionContext();
	const { electionId } = useParams();
	const { firebase, notFound, setNotFound } = useAppContext();
	const { pageLoading, setPageLoading } = useOutletContext();

	useEffect(() => {
		if (!electionId) {
			electionDataDispatchFunc({ type: "resetData" });
			setAgreeToRules({ state: false, next: false });
			return;
		}
		// Fetch election Data when user needs to edit an election
		if (electionId) {
			electionDataDispatchFunc({ type: "resetData" });
			firebase.fetchElectionWithId(electionId, (res) => {
				setPageLoading(false);
				if (res.error) return;
				if (res.empty || res.status !== "pending") {
					setNotFound(true);
					return;
				}
				setAgreeToRules({ state: true, next: true });
				electionDataDispatchFunc({ type: "setData", payload: res });
			});
		}
	}, [firebase, electionId, electionDataDispatchFunc, setNotFound, setPageLoading, setAgreeToRules]);
	return (
		<>
			{!pageLoading && (
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
			{pageLoading && <Loading />}
		</>
	);
};

export default CreateElection;
