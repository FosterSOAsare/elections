import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { NavLink } from "react-router-dom";

const Header = () => {
	const { credentials, credentialsDispatchFunc, notFound } = useAppContext();

	useEffect(() => {
		if (credentials.user?.username) document.title = "Dashboard - " + credentials?.user?.username;
	}, [credentials?.user?.username]);
	return (
		<>
			{!notFound && (
				<>
					<section className="container header">
						<h3>Elections</h3>
						<nav>
							<ul>
								<li>
									<NavLink to="/dashboard"> My Elections</NavLink>
								</li>
								<li>
									<NavLink to="/new">Create New</NavLink>
								</li>
								<li className="logout" onClick={() => credentialsDispatchFunc({ type: "logOut" })}>
									Logout
								</li>
							</ul>
						</nav>
					</section>
				</>
			)}
			<Outlet />
		</>
	);
};

export default Header;
