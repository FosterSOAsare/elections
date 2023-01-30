import React, { useState } from "react";

const PasswordField = ({ text, handleFocus, name }) => {
	const [type, setType] = useState("password");

	function toggleType() {
		setType((prev) => (prev === "password" ? "text" : "password"));
	}
	return (
		<div className="passwordField">
			<label htmlFor={name}>{text}</label>
			<div className="field">
				<input type={type} aria-placeholder={text} placeholder="**********" onFocus={handleFocus} name={name} />
				<i className={`fa-solid fa-eye${type === "password" ? "" : "-slash"}`} onClick={toggleType}></i>
			</div>
		</div>
	);
};

export default PasswordField;
