import "./App.scss";
import Homepage from "./Pages/Homepage/Homepage";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Verifications from "./Pages/Verifications/Verifications";
import { useAppContext } from "./Context/AppContext";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Header from "./Components/Header/Header";
import Election from "./Components/Election";
import CreateElection from "./Pages/CreateElection/CreateElection";

function LogInRequired({ children }) {
	const { credentials } = useAppContext();
	return credentials?.userId ? children : <Navigate to="/login"></Navigate>;
}

function CheckLogged({ children }) {
	const { credentials } = useAppContext();
	return !credentials?.userId ? children : <Navigate to="/dashboard"></Navigate>;
}

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/">
					<Route
						index
						element={
							<CheckLogged>
								<Homepage />
							</CheckLogged>
						}></Route>
					<Route
						path="login"
						element={
							<CheckLogged>
								<Login />
							</CheckLogged>
						}></Route>
					<Route
						path="verifications"
						element={
							<CheckLogged>
								<Verifications />
							</CheckLogged>
						}></Route>
					<Route
						path="register"
						element={
							<CheckLogged>
								<Register />
							</CheckLogged>
						}></Route>
				</Route>
				<Route path="/" element={<Header />}>
					<Route
						path="dashboard"
						element={
							<LogInRequired>
								<Dashboard />
							</LogInRequired>
						}></Route>
					<Route
						path="new"
						element={
							<LogInRequired>
								<CreateElection />
							</LogInRequired>
						}></Route>
					<Route path="election/:electionId" element={<CreateElection />}></Route>
				</Route>
			</Routes>
		</div>
	);
}

export default App;
