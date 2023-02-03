import React from "react";
import LoadingGif from "../../assets/Images/loading.gif";

const Loading = () => {
	return (
		<main className="container loading ">
			<img src={LoadingGif} alt="" className="loading__img" />
			<p>Loading ...</p>
		</main>
	);
};

export default Loading;
