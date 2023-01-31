import React from "react";

const Button2 = ({ text }) => {
	return (
		<button className="button1 button__secondary">
			<i className="fa-solid fa-plus"></i>
			<p>{text}</p>
		</button>
	);
};

export default Button2;
