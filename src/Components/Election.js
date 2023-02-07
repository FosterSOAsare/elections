import React from "react";
import { NavLink } from "react-router-dom";
import { truncateText } from "../Utils/Text";

const Election = ({ desc, name, election_id, status }) => {
	return (
		<div className="election">
			<div className="heading">
				<p>{name}</p>

				<i className={`fa-solid ${status === "completed" ? "fa-check" : status === "started" ? "fa-play" : ""}`}></i>
			</div>
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
