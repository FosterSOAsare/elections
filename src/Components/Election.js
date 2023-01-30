import React from "react";
import { NavLink } from "react-router-dom";

const Election = () => {
	return (
		<div className="election">
			<p>Elections-app</p>
			<p className="desc">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem, a!</p>
			<div className="control">
				<NavLink to={`/elections`}>
					<i className="fa-solid fa-code"></i>
				</NavLink>
			</div>
		</div>
	);
};

export default Election;
