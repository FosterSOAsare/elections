import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, applyActionCode } from "firebase/auth";
import { collection, query, where, getFirestore, getDocs, setDoc, doc, onSnapshot } from "firebase/firestore";

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
}

export default Firebase;
