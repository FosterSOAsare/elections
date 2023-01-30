import "./App.scss";
import Homepage from "./Pages/Homepage/Homepage";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Verifications from "./Pages/Verifications/Verifications";
import { useAppContext } from "./Context/AppContext";
import Dashboard from "./Pages/Dashboard/Dashboard";

function LogInRequired({ children }) {
	const { credentials } = useAppContext();
	return credentials?.user ? children : <Navigate to="/"></Navigate>;
}

function CheckLogged({ children }) {
	const { credentials } = useAppContext();
	return !credentials?.user ? children : <Navigate to="/dashboard"></Navigate>;
}

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/">
					<Route index element={<Homepage />}></Route>
					<Route
						path="login"
						element={
							<CheckLogged>
								<Login />
							</CheckLogged>
						}></Route>
					<Route path="verifications" element={<Verifications />}></Route>
					<Route
						path="register"
						element={
							<CheckLogged>
								<Register />
							</CheckLogged>
						}></Route>
					<Route
						path="dashboard"
						element={
							<LogInRequired>
								<Dashboard />
							</LogInRequired>
						}></Route>
				</Route>
			</Routes>
		</div>
	);
}

export default App;
