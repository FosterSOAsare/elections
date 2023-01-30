import React from "react";
import { NavLink } from "react-router-dom";
import { truncateText } from "../Utils/Text";

const Election = ({ desc, name, election_id }) => {
	return (
		<div className="election">
			<p>{name}</p>
			<p className="desc">{truncateText(desc, 125)}</p>
			<div className="control">
				<NavLink to={`/election/${election_id}`}>
					<i className="fa-solid fa-code"></i>
				</NavLink>
			</div>
		</div>
	);
};

export default Election;
