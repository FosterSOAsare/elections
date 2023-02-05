import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import Loading from "../../../Components/Loading/Loading";
import NotFound from "../../../Components/NotFound/NotFound";

const Voters = () => {
	const [loading, setLoading] = useState(true);
	const [voters, setVoters] = useState([]);
	const { electionId } = useParams();
	const { firebase, notFound, setNotFound } = useAppContext();

	useEffect(() => {
		firebase.fetchVoters(electionId, (res) => {
			setLoading(false);
			if (res.error) return;
			if (res.empty) {
				setNotFound(true);
				return;
			}
			setVoters(res);
		});
	}, [firebase, electionId, setNotFound]);
	// Fetch voters
	return (
		<>
			{!loading && (
				<>
					{!notFound && (
						<main className="container voters">
							<h3>Voter Credentials</h3>
							<table>
								<thead>
									<tr>
										<th>Id</th>
										<th>Password</th>
										<th>Voted</th>
									</tr>
								</thead>
								<tbody>
									{voters.map((e, index) => {
										return (
											<tr key={index}>
												<td>{e.id}</td>
												<td>{e.password}</td>
												<td>{e.voted ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-x"></i>}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</main>
					)}
					{notFound && <NotFound />}
				</>
			)}
			{loading && <Loading />}
		</>
	);
};

export default Voters;
