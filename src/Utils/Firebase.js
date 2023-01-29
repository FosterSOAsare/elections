import { initializeApp } from "firebase/app";

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
	}
}

export default Firebase;
