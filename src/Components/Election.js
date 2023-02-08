import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { truncateText } from "../Utils/Text";
import { useAppContext } from "../Context/AppContext";

const Election = ({ desc, name, election_id, status }) => {
	const { firebase } = useAppContext();
	const navigate = useNavigate();
	function deleteElection() {
		firebase.deleteElectionData(election_id, (res) => {
			if (res.error) return;
			navigate("/");
		});
	}
	return (
		<div className="election">
			<div className="heading">
				<p>{name}</p>
				<div className="actions">
					<i className={`fa-solid ${status === "completed" ? "fa-check" : status === "started" ? "fa-play" : ""}`}></i>
					{status !== "started" && <i className="fa-solid fa-trash" onClick={deleteElection}></i>}
				</div>
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
