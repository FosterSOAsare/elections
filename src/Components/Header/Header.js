import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";

const Header = () => {
	const { credentials, credentialsDispatchFunc } = useAppContext();

	useEffect(() => {
		if (credentials.user?.username) document.title = "Dashboard - " + credentials?.user?.username;
	}, [credentials?.user?.username]);
	return (
		<>
			<section className="container header">
				<h3>Elections</h3>
				<nav>
					<ul>
						<li>My Elections</li>
						<li>Create New</li>
						<li className="logout" onClick={() => credentialsDispatchFunc({ type: "logOut" })}>
							Logout
						</li>
					</ul>
				</nav>
			</section>
			<Outlet />
		</>
	);
};

export default Header;
