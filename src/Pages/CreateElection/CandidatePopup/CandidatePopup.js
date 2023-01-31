import React, { useRef, useState } from "react";

const CandidatePopup = ({ storeCandidate, setCandidateForm }) => {
	const [candidateImgUrl, setCandidateImageUrl] = useState(null);

	let inputRef = useRef(null);
	let formRef = useRef(null);
	function getImageURL(e) {
		let image = e.target.files[0];
		// Create streamable data
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.addEventListener("load", () => {
			setCandidateImageUrl(reader.result);
		});
	}

	function saveCandidateData(e) {
		let formData = new FormData(formRef.current);
		let name = formData.get("name");
		let imageURL = candidateImgUrl;
		let imageFile = inputRef.current.files[0];
		storeCandidate({ name, imageURL, imageFile });
	}

	return (
		<aside className="categoryPopup candidatePopup container">
			<form action="" onSubmit={(e) => e.preventDefault()} ref={formRef}>
				<label htmlFor="name"> Enter candidate's name:</label>
				<input type="text" name="name" id="name" />

				<label htmlFor="image" className="candidate_img">
					{!candidateImgUrl ? <p>Add Image </p> : <img alt="Candidate" src={candidateImgUrl} />}
				</label>
				<input type="file" accept="image/*" name="image" id="image" onChange={getImageURL} ref={inputRef} />
				<div className="actions">
					<button className="button__primary" onClick={saveCandidateData}>
						Continue
					</button>
					<button
						className="button__secondary"
						onClick={() => {
							setCandidateForm({ display: false, category_id: null });
						}}>
						Cancel
					</button>
				</div>
			</form>
		</aside>
	);
};

export default CandidatePopup;
