import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, applyActionCode } from "firebase/auth";
import { collection, query, where, getFirestore, getDocs, setDoc, addDoc, deleteDoc, doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class Firebase {
	constructor() {
		this.config = {
			apiKey: process.env.REACT_APP_FIREBASE_KEY,
			authDomain: "elections-app-2aa42.firebaseapp.com",
			projectId: "elections-app-2aa42",
			storageBucket: "elections-app-2aa42.appspot.com",
			messagingSenderId: "756810628356",
			appId: "1:756810628356:web:aee320d1a9fab8a6f3e451",
		};
		this.app = initializeApp(this.config);
		this.auth = getAuth();
		this.db = getFirestore(this.app);
		this.storage = getStorage(this.app);
	}

	async checkUserExists(username, callback) {
		try {
			let q = query(collection(this.db, "users"), where("username", "==", username));
			let docs = await getDocs(q);
			callback(!docs.empty);
		} catch (error) {
			callback({ error: "true" });
		}
	}

	async createNewAuth(email, password, callback) {
		try {
			let auth = await createUserWithEmailAndPassword(this.auth, email, password);
			callback(auth);
		} catch (error) {
			if (error.code === "auth/email-already-in-use") {
				callback({ error: true, payload: "Email is already in use by another account" });
			}
			callback({ error: true });
		}
	}

	async sendUserVerificationEmail(user, callback) {
		try {
			await sendEmailVerification(user, {
				url: "http://localhost:3000/verifications",
				handleCodeInApp: true,
			});
			callback({ success: true });
		} catch (error) {
			callback({ error: true });
		}
	}

	async addNewUser(username, uid, callback) {
		try {
			await setDoc(doc(this.db, "users", uid), { username });
			callback("success");
		} catch (error) {
			callback({ error: true });
		}
	}

	async signInUser(email, password, callback) {
		try {
			let res = await signInWithEmailAndPassword(this.auth, email, password);
			callback(res);
		} catch (error) {
			if (error.code === "auth/wrong-password") {
				callback({ error: true, payload: "Password is invalid, Check details and try again" });
				return;
			}
			if (error.code === "auth/user-not-found") {
				callback({ error: true, payload: "User is not found, Check details and try again" });
			}
			callback({ error: true });
		}
	}

	async fetchUserWithUid(uid, callback) {
		try {
			let q = doc(this.db, "users", uid);
			onSnapshot(q, (res) => {
				if (!res.data()) {
					callback({ empty: true });
					return;
				}
				callback(res.data());
			});
		} catch (error) {
			callback({ error: "true" });
		}
	}

	async checkEmailVerificationCode(oobCode, callback) {
		try {
			let res = await applyActionCode(this.auth, oobCode);
			callback(res);
		} catch (error) {
			if (error.code === "auth/invalid-action-code") {
				callback({ error: true, payload: "Invalid code " });
				return;
			}
			callback({ error: true });
		}
	}

	async fetchUserElections(username, callback) {
		try {
			let q = query(collection(this.db, "elections"), where("author", "==", username));
			onSnapshot(q, (res) => {
				if (res.empty) {
					callback({ empty: true });
					return;
				}
				res = res.docs.map((e) => {
					let data = e.data();
					return { desc: data.desc, name: data.name, election_id: e.id };
				});
				callback(res);
			});
		} catch (error) {
			callback({ error: true });
		}
	}

	async uploadImage(imageName, image, callback) {
		try {
			const storageRef = ref(this.storage, "elections/" + imageName);
			const uploadTask = uploadBytesResumable(storageRef, image);
			uploadTask.on("state_changed", (snapshot) => {
				if (snapshot.bytesTransferred / snapshot.totalBytes === 1) {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						callback(downloadURL);
					});
				}
			});
		} catch (e) {
			callback({ error: true });
		}
	}

	async storeElectionData(data, callback) {
		try {
			// Store basic data
			let basicData = { name: data.name, desc: data.desc, author: data.author, status: "pending", timestamp: serverTimestamp() };
			let response = await addDoc(collection(this.db, "elections"), basicData);
			data.categories.forEach((category) => {
				let categoryData = { name: category.name, limit: category.limit };
				addDoc(collection(this.db, "elections", response.id, "categories"), categoryData).then((res) => {
					category.candidates.forEach(async (candidate) => {
						await addDoc(collection(this.db, "elections", response.id, "categories", res.id, "candidates"), candidate);
					});
				});
			});
			// Callback election Res to be used to store the voters of the election
			callback(response);
		} catch (error) {
			callback({ error: "true" });
		}
	}
	// async updateElectionData(data, electionId, callback) {
	// 	try {
	// 		let basicData = { name: data.name, desc: data.desc };
	// 		// await updateDoc(doc(this.db, "elections", electionId), basicData);
	// 		// // 	Update candidates and ategories
	// 		await data.categories.forEach(async (category) => {
	// 			let categoryData = { name: category.name, limit: category.limit };
	// 			let candidatesPromise = [];
	// 			// If user updates a category
	// 			if (category.category_id) {
	// 				updateDoc(doc(this.db, "elections", electionId, "categories", category.category_id), categoryData);
	// 				category.candidates.forEach(async (candidate) => {
	// 					if (candidate.candidate_id) {
	// 						// If user updates a  candidate in the category
	// 						let candidate_id = candidate.candidate_id;
	// 						delete candidate.candidate_id;
	// 						candidatePromise.push(updateDoc(doc(this.db, "elections", electionId, "categories", category.category_id, "candidates", candidate_id), candidate));
	// 					} else {
	// 						// If user adds a new candidate in the category
	// 						await addDoc(collection(this.db, "elections", electionId, "categories", category.category_id, "candidates"), candidate);
	// 					}
	// 				});
	// 			} else {
	// 				// If user adds a new category and new candidates in the category
	// 				await addDoc(collection(this.db, "elections", electionId, "categories"), categoryData).then((res) => {
	// 					category.candidates.forEach(async (candidate) => {
	// 						await addDoc(collection(this.db, "elections", electionId, "categories", res.id, "candidates"), candidate);
	// 					});
	// 				});
	// 			}
	// 		});

	// 		// Check deletions
	// 		// let categories = await getDocs(collection(this.db, "elections", electionId, "categories"));
	// 		// categories.docs.forEach(async (e) => {
	// 		// 	let found = data.categories.find((category) => {
	// 		// 		return category.category_id === e.id;
	// 		// 	});
	// 		// 	if (!found) {
	// 		// 		await deleteDoc(doc(this.db, "elections", electionId, "categories", e.id));
	// 		// 	}
	// 		// });
	// 	} catch (error) {
	// 		console.log(error);
	// 		callback({ error: "true" });
	// 	}
	// }

	async updateElectionData(data, electionId, callback) {
		console.log(data);
		try {
			// Update the base election
			let baseData = { name: data.name, desc: data.desc };
			await updateDoc(doc(this.db, "elections", electionId), baseData);

			let promise = await new Promise((resolve) => this.updateCategories(data.categories, electionId, (res) => resolve(res)));
			promise = Promise.resolve(promise);
			console.log(promise);
		} catch (e) {
			console.log(e);
			callback({ error: true });
		}
	}

	async updateCategories(dataCategories, electionId, callback) {
		try {
			// Fetch stored categories
			let categories = await getDocs(collection(this.db, "elections", electionId, "categories"));
			categories = categories.docs.map((e) => {
				return { ...e.data(), category_id: e.id };
			});

			// Update or add new category based on the electionData
			dataCategories.forEach(async (category) => {
				let categoryData = { name: category.name, limit: category.limit };
				let promise = "";
				if (category.category_id) {
					// Update
					promise = new Promise(async (resolve) => resolve(await updateDoc(doc(this.db, "elections", electionId, "categories", category.category_id), categoryData)));
				} else {
					// Add
					promise = new Promise(async (resolve) => resolve(await addDoc(collection(this.db, "elections", electionId, "categories"), categoryData)));
				}
				// After updating or adding , store candidates

				promise = await Promise.resolve(promise);

				let category_id = category.category_id || promise?.id;

				let candidates = new Promise((resolve) =>
					this.updateCandidates(category.candidates, electionId, category_id, (res) => {
						resolve(res);
					})
				);
				console.log(candidates);
			});
		} catch (e) {
			console.log(e);
			console.log("error");
		}
	}
	async updateCandidates(categoryCandidates, electionId, category_id, callback) {
		try {
			// This promise is used to wait for all the updates or adds that might occur in the candidates sub-collection.
			let updateEditPromise = new Promise((resolve) => {
				categoryCandidates.forEach(async (candidate) => {
					//
					let promise = "";
					if (candidate.candidate_id) {
						let candidate_id = candidate.candidate_id;
						delete candidate.candidate_id;
						// 	// Update
						promise = new Promise(async (resolve) => resolve(await updateDoc(doc(this.db, "elections", electionId, "categories", category_id, "candidates", candidate_id), candidate)));
					} else {
						// 	// Add
						promise = new Promise(async (resolve) => resolve(await addDoc(collection(this.db, "elections", electionId, "categories", category_id, "candidates"), candidate)));
					}
					// // After updating or adding , store candidates
					promise = await Promise.resolve(promise);
					resolve(promise);
				});
			});
			await Promise.resolve(updateEditPromise);

			// // Delete candidates that were deleted
			// // Fetch stored candidates
			// let storedCandidates = await getDocs(collection(this.db, "elections", electionId, "categories", category_id, "candidates"));
			// storedCandidates = storedCandidates.docs.map((e) => {
			// 	return { ...e.data(), candidate_id: e.id };
			// });

			// // Filter
			// storedCandidates.forEach((storedCandidate) => {
			// 	console.log(storedCandidate);
			// 	console.log(categoryCandidates);
			// 	// let found = categoryCandidates.find((e) => e.candidate_id === storedCandidate.category_id);
			// 	// console.log(found);
			// 	// if (!found) {
			// 	// 	console.log(storedCandidate.category_id);
			// 	// }
			// });
		} catch (e) {
			console.log(e);
			console.log("error");
		}
	}

	async storeVoter(password, id, election_id, callback) {
		try {
			await addDoc(collection(this.db, "elections", election_id, "voters"), { password, id });
			callback("success");
		} catch (e) {
			callback({ error: true });
		}
	}

	async fetchElectionWithId(election_id, callback) {
		try {
			onSnapshot(doc(this.db, "elections", election_id), async (res) => {
				if (!res.exists()) {
					callback({ empty: true });
					return;
				}
				let categories = new Promise((resolve) => {
					this.fetchCategories(election_id, (res) => {
						resolve(res);
					});
				});
				let voters = new Promise((resolve) => {
					this.fetchVoters(election_id, (res) => {
						resolve(res);
					});
				});

				categories = await Promise.resolve(categories);
				voters = await Promise.resolve(voters);
				let electionData = { ...res.data(), election_id: res.id, categories, voters: voters.length };

				callback(electionData);
			});
		} catch (e) {
			callback({ error: true });
		}
	}

	async fetchCategories(election_id, callback) {
		try {
			onSnapshot(collection(this.db, "elections", election_id, "categories"), async (categories) => {
				categories = categories.docs.map(async (category) => {
					let candidates = await new Promise((resolve) => {
						this.fetchCandidates(election_id, category.id, (res) => {
							resolve(res);
						});
					});
					candidates = await Promise.resolve(candidates);
					return { ...category.data(), category_id: category.id, candidates: [...candidates] };
				});
				categories = await Promise.all(categories);

				callback(categories);
			});
		} catch (e) {
			callback({ error: true });
		}
	}

	async fetchVoters(election_id, callback) {
		try {
			onSnapshot(collection(this.db, "elections", election_id, "voters"), (voters) => {
				voters = voters.docs.map((voter) => {
					return { ...voter.data(), voter_id: voter.id };
				});

				callback(voters);
			});
		} catch (e) {
			callback({ error: true });
		}
	}
	async fetchCandidates(election_id, category_id, callback) {
		try {
			onSnapshot(collection(this.db, "elections", election_id, "categories", category_id, "candidates"), (res) => {
				callback(
					res.docs.map((e) => {
						return { ...e.data(), candidate_id: e.id };
					})
				);
			});
		} catch (e) {
			callback({ error: true });
		}
	}

	updateElectionStatus(electionId, status, callback) {
		try {
			updateDoc(doc(this.db, "elections", electionId), { status });
			callback("success");
		} catch (e) {
			callback({ error: true });
		}
	}
}

export default Firebase;
