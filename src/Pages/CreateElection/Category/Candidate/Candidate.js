import React from "react";

const Candidate = ({ name, imageURL, imageFile }) => {
	return (
		<div className="candidate">
			<img src={imageURL} alt="candidate" />
			<p>{name}</p>
		</div>
	);
};

export default Candidate;
