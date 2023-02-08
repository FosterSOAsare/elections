import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { NavLink } from "react-router-dom";

const Header = () => {
	const { credentials, credentialsDispatchFunc, notFound } = useAppContext();
	const [pageLoading, setPageLoading] = useState(true);
	let location = useLocation();

	useEffect(() => {
		// For routes that do not have to wait for data .
		let routes = ["/new"];
		if (routes.includes(location.pathname)) {
			setPageLoading(false);
			return;
		}
		setPageLoading(true);
	}, [location]);

	useEffect(() => {
		if (credentials.user?.username) document.title = "Dashboard - " + credentials?.user?.username;
	}, [credentials?.user?.username]);

	return (
		<>
			{!pageLoading && (
				<>
					{!notFound && (
						<>
							<section className="container header">
								<NavLink to="/" className="link">
									<h3>Elections</h3>
								</NavLink>
								{credentials?.user?.username && (
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
								)}
								<i className="fa-solid fa-bars menuBtn"></i>
							</section>
						</>
					)}
				</>
			)}
			<Outlet context={{ pageLoading, setPageLoading }} />
		</>
	);
};

export default Header;
