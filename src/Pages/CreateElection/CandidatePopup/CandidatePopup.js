import React, { useRef, useState } from "react";
import { useElectionContext } from "../../../Context/ElectionContext";
import { useAppContext } from "../../../Context/AppContext";
import { sanitizeText } from "../../../Utils/Text";
import { useAuthContext } from "../../../Context/AuthContext";
import Error from "../../../Components/form/Error";

const CandidatePopup = () => {
	const { setShowCandidateForm, storeCandidate, updateCandidate, setEditDataIndex } = useElectionContext();
	const { editDataIndex, electionData } = useElectionContext();
	const { errorDispatchFunc, error, validations, clearError } = useAuthContext();
	const { firebase } = useAppContext();
	const [waiting, setWaiting] = useState(false);

	let editData = null;
	if (editDataIndex?.categoryIndex !== null && editDataIndex?.categoryIndex !== null) {
		editData = electionData?.data?.categories[editDataIndex?.categoryIndex]?.candidates[editDataIndex?.candidateIndex];
	}
	const [candidateData, setCandidateData] = useState(
		editData || {
			name: "",
			imageURL: "",
		}
	);

	let inputRef = useRef(null);
	let formRef = useRef(null);
	function getImageURL(e) {
		let image = e.target.files[0];
		// Create streamable data
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.addEventListener("load", () => {
			setCandidateData((prev) => {
				return { ...prev, imageURL: reader.result };
			});
		});
	}

	function storeImage(e) {
		let image = e.target.files[0];
		let name = sanitizeText(image.name);

		firebase.uploadImage(name, image, (res) => {
			setWaiting(false);
			setCandidateData((prev) => {
				return { ...prev, imageURL: res };
			});
		});
	}

	function setCandidateName(e) {
		setCandidateData((prev) => {
			return { ...prev, name: e.target.value };
		});
	}
	function prepareCandidateStorage() {
		// Form validation
		let formData = new FormData(formRef.current);
		let name = formData.get("name");
		let image = formData.get("image");

		if (!name) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter candidate's name" });
			return;
		}
		if (!image.name) {
			errorDispatchFunc({ type: "displayError", payload: "Please select candidate's image" });
			return;
		}
		if (!validations.validateName(name)) {
			errorDispatchFunc({ type: "displayError", payload: "Please enter a valid candidate name" });
			return;
		}
		if (editDataIndex.candidateIndex !== null) {
			updateCandidate(candidateData, editDataIndex.categoryIndex, editDataIndex.candidateIndex);
		} else {
			storeCandidate(candidateData);
		}
	}
	return (
		<aside className="categoryPopup candidatePopup container">
			<form action="" onSubmit={(e) => e.preventDefault()} ref={formRef}>
				<label htmlFor="name"> Enter candidate's name:</label>
				<input type="text" name="name" id="name" value={candidateData.name} onChange={setCandidateName} onFocus={clearError} />

				<label htmlFor="image" className="candidate_img">
					{candidateData.imageURL === "" ? <p>Add Image </p> : <img alt="Candidate" src={candidateData?.imageURL} />}
				</label>
				<input
					type="file"
					accept="image/*"
					name="image"
					id="image"
					onChange={(e) => {
						setWaiting(true);
						getImageURL(e);
						storeImage(e);
					}}
					onClick={clearError}
					ref={inputRef}
				/>
				{error.display === "block" && <Error text={error.text} />}
				<div className="actions">
					<button className={`button__primary${waiting ? " disabled" : ""}`} onClick={prepareCandidateStorage} disabled={waiting}>
						Continue
					</button>
					<button
						className="button__secondary"
						onClick={() => {
							setEditDataIndex({ categoryIndex: null, candidateIndex: null });
							setShowCandidateForm(false);
						}}>
						Cancel
					</button>
				</div>
			</form>
		</aside>
	);
};

export default CandidatePopup;
