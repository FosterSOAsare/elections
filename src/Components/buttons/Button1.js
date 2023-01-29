import React from "react";

const Button1 = ({ text }) => {
	return (
		<button className="button1 button__primary">
			<i className="fa-solid fa-plus"></i>
			<p>{text}</p>
		</button>
	);
};

export default Button1;
