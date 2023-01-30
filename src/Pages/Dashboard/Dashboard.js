import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Election from "../../Components/Election";
import { useAppContext } from "../../Context/AppContext";

const Dashboard = () => {
	const [userElections, setUserElections] = useState([]);
	const { firebase, credentials } = useAppContext();

	useEffect(() => {
		firebase.fetchUserElections(credentials?.userId, (res) => {
			if (res.error) return;
			setUserElections(res);
		});
	}, [firebase, credentials?.userId]);
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
								return <Election key={index} {...e} />;
							})}
					</div>
				</div>
			</div>
		</main>
	);
};

export default Dashboard;
