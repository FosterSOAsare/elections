import React from "react";
import { useElectionContext } from "../../../Context/ElectionContext";
import Category from "../Category/Category";

const Step3 = () => {
	const { electionData, prevStep } = useElectionContext();
	return (
		<section className="step3">
			<h3>Election Preview</h3>
			<p>
				Election name : <span>{electionData.data.name} </span>
			</p>
			<p>
				Election desc : <span>{electionData.data.desc}</span>
			</p>

			<section className="categories">
				<h3>Election Categories </h3>
				{electionData.data.categories.map((e, index) => {
					return <Category key={index} {...e} type="preview" />;
				})}
			</section>
			<div className="actions">
				<button className="button__secondary" onClick={() => prevStep()}>
					Prev
				</button>
				<button className="button__primary">Save Election</button>
			</div>
		</section>
	);
};

export default Step3;
