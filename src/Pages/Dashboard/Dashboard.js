import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Election from "../../Components/Election";

const Dashboard = () => {
	const [userElections, setUserElections] = useState([1, 3, 4, 5]);
	return (
		<main className="container dashboard">
			<div className="elections">
				<div className="content">
					<h3>Your Elections </h3>
					<div className="elections">
						<div className="election add">
							<i className="fa-solid fa-plus"></i>
							<p>Add Election</p>
							<div className="control">
								<NavLink to={`/new`}>
									<i className="fa-solid fa-code"></i>
								</NavLink>
							</div>
						</div>
						{userElections.length > 0 &&
							userElections.map((e, index) => {
								return <Election key={index} />;
							})}
					</div>
				</div>
			</div>
		</main>
	);
};

export default Dashboard;
