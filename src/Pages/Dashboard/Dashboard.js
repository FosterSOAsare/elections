import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Election from "../../Components/Election";
import { useAppContext } from "../../Context/AppContext";
import Loading from "../../Components/Loading/Loading";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
	const [userElections, setUserElections] = useState([]);
	const { firebase, credentials } = useAppContext();
	const { pageLoading, setPageLoading } = useOutletContext();

	useEffect(() => {
		firebase.fetchUserElections(credentials?.user?.username, (res) => {
			if (res.error) return;
			setUserElections(res);
			setPageLoading(false);
		});
	}, [firebase, credentials?.user?.username, setPageLoading]);
	return (
		<>
			{!pageLoading && (
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
			{pageLoading && <Loading />}
		</>
	);
};

export default Dashboard;
