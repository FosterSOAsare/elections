import React, { useEffect } from "react";
import PasswordField from "../../../Components/form/PasswordField";
import Error from "../../../Components/form/Error";
import { useAuthContext } from "../../../Context/AuthContext";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import NotFound from "../../../Components/NotFound/NotFound";
import Loading from "../../../Components/Loading/Loading";
const VotersLogin = () => {
	const { error, clearError, errorDispatchFunc, waiting, setWaiting } = useAuthContext();
	const { firebase } = useAppContext();
	const { electionId } = useParams();
	const { notFound, setNotFound } = useAppContext();
	const { pageLoading, setPageLoading } = useOutletContext();
	let navigate = useNavigate();

	// Check if election exists
	useEffect(() => {
		firebase.fetchElectionBasicData(electionId, (res) => {
			setPageLoading(false);
			if (res.empty) {
				// Set 404
				setNotFound(true);
				return;
			}
		});
	}, [firebase, electionId, setNotFound, setPageLoading]);

	// Check if user has already logged in , redirect
	useEffect(() => {
		let voter_id = localStorage.getItem("election:voter");
		if (voter_id) {
			// Check legitimacy
			firebase.fetchVoterWithId(electionId, voter_id, (res) => {
				if (res.error) return;
				if (res.empty) {
					// If not legitimate , delete localStorage
					localStorage.removeItem("election:voter");
					return;
				}
				navigate("../");
			});
		}
	}, [firebase, electionId, navigate]);
	function submitForm(e) {
		setWaiting(true);
		e.preventDefault();
		let formData = new FormData(e.target);
		let id = formData.get("id");
		let password = formData.get("password");

		if (!id || !password) {
			errorDispatchFunc({ type: "displayError", payload: "Please fill in all credentails" });
			return;
		}

		// Validate id and password
		firebase.validateVoter(electionId, id, password, (res) => {
			setWaiting(false);
			if (res.error) return;
			if (res.empty) {
				errorDispatchFunc({ type: "displayError", payload: "Details error : Please check your details and try again" });
				return;
			}
			// Stored data
			localStorage.setItem("election:voter", res.voter_id);
			navigate("../");
		});
	}
	useEffect(() => {
		error.display === "block" && setWaiting(false);
	}, [error.display, setWaiting]);
	return (
		<>
			{!pageLoading && (
				<>
					{!notFound && (
						<main className="container register auth">
							<div className="auth__container">
								<h3>Voter Login </h3>
								<p className="desc">
									<span>NB:</span> password and id are case-sensitive
								</p>
								<form action="" onSubmit={submitForm}>
									<label htmlFor="id">Enter your id:</label>
									<input type="text" aria-placeholder="Enter your email address" onFocus={clearError} name="id" id="id" />
									<PasswordField text="Enter your password" handleFocus={clearError} name="password" />
									{error.display === "block" && <Error text={error.text} />}
									{!waiting && <button className="button__primary">Log in</button>}
									{waiting && (
										<button className="button__primary waiting" disabled>
											Waiting...
										</button>
									)}
								</form>
							</div>
						</main>
					)}
					{notFound && <NotFound />}
				</>
			)}
			{pageLoading && <Loading />}
		</>
	);
};

export default VotersLogin;
