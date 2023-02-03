import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Election from "../../Components/Election";
import { useAppContext } from "../../Context/AppContext";
import Loading from "../../Components/Loading/Loading";

const Dashboard = () => {
	const [userElections, setUserElections] = useState([]);
	const { firebase, credentials } = useAppContext();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		firebase.fetchUserElections(credentials?.user?.username, (res) => {
			if (res.error) return;
			setUserElections(res);
			setLoading(false);
		});
	}, [firebase, credentials?.user?.username]);
	return (
		<>
			{!loading && (
				<main className="container dashboard">
					<div className="elections">
						<div className="content">
							<h3>Your Elections </h3>
							<div className="elections">
								<NavLink className="election add" to="/new">
									<i className="fa-solid fa-plus"></i>
									<p>Add Election</p>
								</NavLink>
								{userElections.length > 0 &&
									userElections.map((e, index) => {
										return <Election key={index} {...e} />;
									})}
							</div>
						</div>
					</div>
				</main>
			)}
			{loading && <Loading />}
		</>
	);
};

export default Dashboard;
