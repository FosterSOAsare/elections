import React from "react";
import { useNavigate } from "react-router-dom";

const Rules = ({ setAgreeToRules, agreeToRules }) => {
	const navigate = useNavigate();
	return (
		<div className="rules">
			<h3>Create a new Election</h3>
			<h3 className="rules">Election Rules</h3>
			<ul>
				<li>A user is required to create an account and verify their email before they can create / conduct an election</li>
				<li>An election requires a name , desc , category(ies) and candidates .</li>
				<li>You will be asked the number of candiadtes that can be selected per each category. (1 is the default)</li>
				<li>The creator of the election is allowed to edit a newly created election until it is marked as in progress. At this juncture , it can no longer be edited</li>
				<li>An estimated number of voters is required to make sure people have the right access to vote on a particular election and also make sure people do not vote twice</li>

				<li>During the elections , the creator can mark the election as complete and it will be after that time that users(author and voters) can see the results of the elcetions</li>
			</ul>
			<div className="agree_to_rules">
				<input type="checkbox" name="agree" id="agree" onChange={(e) => setAgreeToRules({ state: e.target.checked, next: false })} />
				<label htmlFor="agree">I have read and agree to the rules above</label>
			</div>

			<div className="actions">
				<button className={`button__primary ${agreeToRules?.state ? "" : "disabled"}`} disabled={!agreeToRules.state} onClick={() => setAgreeToRules({ state: true, next: true })}>
					Continue
				</button>
				<button
					className="button__secondary"
					onClick={() => {
						navigate("/");
					}}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default Rules;
