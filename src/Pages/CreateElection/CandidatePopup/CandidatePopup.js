import React, { useRef, useState } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";

const CandidatePopup = () => {
	const { setShowCandidateForm, storeCandidate } = useElectionContext();
	const [candidateData, setCandidateData] = useState({
		name: "",
		imageFile: "",
		imageURL: "",
	});

	let inputRef = useRef(null);
	let formRef = useRef(null);
	function getImageURL(e) {
		let image = e.target.files[0];
		// Create streamable data
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.addEventListener("load", () => {
			setCandidateData((prev) => {
				return { ...prev, imageURL: reader.result, imageFile: image };
			});
		});
	}

	function setCandidateName(e) {
		setCandidateData((prev) => {
			return { ...prev, name: e.target.value };
		});
	}
	return (
		<aside className="categoryPopup candidatePopup container">
			<form action="" onSubmit={(e) => e.preventDefault()} ref={formRef}>
				<label htmlFor="name"> Enter candidate's name:</label>
				<input type="text" name="name" id="name" value={candidateData.name} onChange={setCandidateName} />

				<label htmlFor="image" className="candidate_img">
					{candidateData.imageURL === "" ? <p>Add Image </p> : <img alt="Candidate" src={candidateData?.imageURL} />}
				</label>
				<input type="file" accept="image/*" name="image" id="image" onChange={getImageURL} ref={inputRef} />
				<div className="actions">
					<button className="button__primary" onClick={() => storeCandidate(candidateData)}>
						Continue
					</button>
					<button className="button__secondary" onClick={() => setShowCandidateForm(false)}>
						Cancel
					</button>
				</div>
			</form>
		</aside>
	);
};

export default CandidatePopup;
