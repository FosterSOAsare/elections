import React, { useState } from "react";
import PasswordField from "../Components/form/PasswordField";
import Error from "../Components/form/Error";
import { useAuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { Navigate } from "react-router-dom";
const Login = () => {
	const { error, clearError, errorDispatchFunc, validations, waiting, setWaiting } = useAuthContext();
	const { firebase, credentialsDispatchFunc } = useAppContext();
	const [navigate, setNavigate] = useState({ state: false, path: "" });

	function submitForm(e) {
		setWaiting(true);
		e.preventDefault();
		let formData = new FormData(e.target);
		let email = formData.get("email");
		let password = formData.get("password");
		if (!email || !password) {
			errorDispatchFunc({ type: "displayError", payload: "Please fill in all credentails" });
			return;
		}
		// Email validation
		if (!validations.validateEmail(email)) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter a valid email address" });
			return;
		}

		// Password validation
		if (!validations.validatePassword(password)) {
			errorDispatchFunc({ type: "displayError", payload: "Password must contain at least eight characters, at least one number , both lower and uppercase letters and a special character" });
			return;
		}

		// Sign in user
		firebase.signInUser(email, password, (res) => {
			if (res.error) {
				if (res.payload) {
					errorDispatchFunc({ type: "displayError", payload: res.payload });
				}
				return;
			}
			if (!res?.user?.emailVerified) {
				// Send email and Redirect to verifcation page
				firebase.sendUserVerificationEmail(res.user, (res) => {
					if (res?.error) return;
					setNavigate({ state: true, path: "/verifications?mode=emailSent" });
					// Store the uid
				});
				return;
			}
			setWaiting(false);
			credentialsDispatchFunc({ type: "setUserId", payload: res?.user?.uid });
		});
	}
	return (
		<>
			<main className="container register auth">
				<div className="auth__container">
					<h3>Log in to your account </h3>
					<form action="" onSubmit={submitForm}>
						<label htmlFor="email">Enter your email address:</label>
						<input type="text" aria-placeholder="Enter your email address" onFocus={clearError} name="email" id="email" />
						<PasswordField text="Enter your password" handleFocus={clearError} name="password" />
						{error.display === "block" && <Error text={error.text} />}
						{!waiting && <button className="button__primary">Log in</button>}
						{waiting && (
							<button className="button__primary waiting" disabled>
								Waiting...
							</button>
						)}
						<p className="redirect">
							Don't have an account ?
							<Link to="/register" className="secondary">
								Sign Up
							</Link>
						</p>
					</form>
				</div>
			</main>
			{navigate.state && <Navigate to={navigate.path} />}
		</>
	);
};

export default Login;
