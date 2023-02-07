import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import Loading from "../../../Components/Loading/Loading";
import NotFound from "../../../Components/NotFound/NotFound";
import ResultCategory from "./ResultCategory";

const Results = () => {
	const [results, setResults] = useState({});
	const { pageLoading, setPageLoading } = useOutletContext();
	const { firebase, notFound, setNotFound } = useAppContext();
	const { electionId } = useParams();

	useEffect(() => {
		// Fetch election
		firebase.fetchElectionWithId(electionId, (res) => {
			if (res.error) return;
			setPageLoading(false);
			if (res.status !== "completed" || res.empty) {
				setNotFound(true);
				return;
			}
			setResults(res);
		});
	}, [setPageLoading, firebase, electionId, setNotFound]);
	return (
		<>
			{!pageLoading && (
				<>
					{!notFound && (
						<main className="container results">
							<h3 className="intro">Election Results</h3>
							{results?.categories?.map((category) => {
								return <ResultCategory key={category.category_id} {...category} />;
							})}
						</main>
					)}
					{notFound && <NotFound />}
				</>
			)}
			{pageLoading && <Loading />}
		</>
	);
};

export default Results;
