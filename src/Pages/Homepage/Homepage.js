import React from "react";
const Homepage = () => {
	return (
		<main className="container homepage">
			<h3>Welcome To Elections app</h3>
			<p>This is a project created to help in the creation of digital elections without any hustle.</p>
			<p>Create an account to organize and election or navigate to an election to cast your vote with the right access</p>

			<div className="actions">
				<button className="button__primary">Get Started</button>
				<button className="button__secondary">Log in to your account </button>
			</div>
		</main>
	);
};

export default Homepage;
