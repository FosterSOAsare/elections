import React, { useState } from "react";
import PasswordField from "../Components/form/PasswordField";
import Error from "../Components/form/Error";
import { useAuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

const Register = () => {
	const { error, clearError, errorDispatchFunc, validations, waiting, setWaiting } = useAuthContext();
	const [navigate, setNavigate] = useState(false);
	const { firebase } = useAppContext();

	function submitForm(e) {
		setWaiting(true);
		e.preventDefault();
		let formData = new FormData(e.target);
		let email = formData.get("email");
		let username = formData.get("username");
		let password = formData.get("password");
		let confirmPassword = formData.get("confirmPassword");
		// Validations
		if ((!username || !email || !password, !confirmPassword)) {
			errorDispatchFunc({ type: "displayError", payload: "Please fill in all credentials" });
			return;
		}
		// Email validation
		if (!validations.validateEmail(email)) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter a valid email address" });
			return;
		}

		// Password validation
		if (!validations.validatePassword(password) || !validations.validatePassword(confirmPassword)) {
			errorDispatchFunc({ type: "displayError", payload: "Password must contain at least eight characters, at least one number , both lower and uppercase letters and a special character" });
			return;
		}

		// Check password confirmation
		if (password !== confirmPassword) {
			errorDispatchFunc({ type: "displayError", payload: "Passwords do not match" });
			return;
		}

		// Check if username exists
		firebase.checkUserExists(username, (res) => {
			if (res.error) return;
			if (res) {
				errorDispatchFunc({ type: "displayError", payload: "Username has already been used" });
				return;
			}
			// Create a new auth
			firebase.createNewAuth(email, password, (res) => {
				if (res.error) {
					if (res.payload) {
						errorDispatchFunc({ type: "displayError", payload: res.payload });
					}
					return;
				}
				let uid = res?.user?.uid;
				firebase.sendUserVerificationEmail(res?.user, (res) => {
					if (res.error) return;
					// Store Data
					firebase.addNewUser(username, uid, (res) => {
						if (res.error) return;
						setWaiting(false);
						setNavigate(true);
					});
				});
			});
		});

		// Store Data
	}

	return (
		<>
			<main className="container register auth">
				<div className="auth__container">
					<h3>Register an account </h3>
					<form action="" onSubmit={submitForm}>
						<label htmlFor="username">Enter a username:</label>
						<input type="text" aria-placeholder="Enter a username" onFocus={clearError} name="username" id="username" />
						<label htmlFor="email">Enter your email address:</label>
						<input type="text" aria-placeholder="Enter your email address" onFocus={clearError} name="email" id="email" />
						<PasswordField text="Enter a password" handleFocus={clearError} name="password" />
						<PasswordField text="Confirm password" handleFocus={clearError} name="confirmPassword" />
						{error.display === "block" && <Error text={error.text} />}

						{!waiting && <button className="button__primary">Sign Up</button>}
						{waiting && (
							<button className="button__primary waiting" disabled>
								Waiting...
							</button>
						)}
						<p className="redirect">
							Already have an account ?{" "}
							<Link to="/login" className="secondary">
								Log in
							</Link>
						</p>
					</form>
				</div>
			</main>
			{navigate && <Navigate to="/verifications?mode=emailSent"></Navigate>}
		</>
	);
};

export default Register;
