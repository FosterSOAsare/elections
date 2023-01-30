import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import { useAppContext } from "../../Context/AppContext";

const Verifications = () => {
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const { redirect, redirectDispatchFunc, error, errorDispatchFunc } = useAuthContext();
	const { firebase } = useAppContext();
	const [navigate, setNavigate] = useState(false);

	let { mode, oobCode } = Object.fromEntries(query);

	useEffect(() => {
		if (!mode) {
			// Redirect to login page
			redirectDispatchFunc({ type: "redirect", payload: "/login" });
		}

		// Check oobCode

		oobCode &&
			firebase.checkEmailVerificationCode(oobCode, (res) => {
				if (res.error) {
					if (res.payload) {
						errorDispatchFunc({ type: "displayError", payload: res.payload });
					}
					return;
				}
				// Redirect to login page
				setTimeout(() => {
					setNavigate(true);
				}, 3000);
			});
	}, [mode, redirectDispatchFunc, firebase, oobCode, errorDispatchFunc]);
	return (
		<>
			<main className="container verifications">
				<div className="verifications__container">
					{mode === "emailSent" && (
						<>
							<i className="fa-solid fa-check"></i>
							<h3>Verifications</h3>
							<p>A verification mail has been sent to your email address. Please click on the link in the mail to verify your account</p>
						</>
					)}

					{mode === "verifyEmail" && oobCode && (
						<>
							{error.display === "none" && (
								<>
									<i className="fa-solid fa-check success"></i>
									<h3>Success</h3>
									<p>Your email has been successfully verified.</p>
									<p>
										<span>
											<Link to="/login" className="secondary link">
												Click here
											</Link>
											, if you are not automatically redirected to the login page
										</span>
									</p>
								</>
							)}

							{error.display === "block" && (
								<div>
									<i className="fa-solid fa-x"></i>
									<p>{error.text}</p>
								</div>
							)}
						</>
					)}
				</div>
			</main>
			{redirect.redirect && <Navigate to={redirect.path} />}
			{navigate && <Navigate to={"/login"} />}
		</>
	);
};

export default Verifications;
