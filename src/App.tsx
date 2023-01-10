import React, {useState} from 'react';
import './App.css';
import GamePage from "./GamePage/GamePage";
import RegistrationPage from "./RegistrationPage/RegistrationPage";
import LeaderboardPage from "./LeadboardPage/LeaderboardPage";
import {Route, Routes} from "react-router-dom";
import {AuthProvider} from "./AuthProvider";
import LoginDialog from "./Shared/Components/LoginDialog/LoginDialog";

function App() {
    const [isLoginVisible, setIsLoginVisible] = useState<boolean>(false);
    return (
        <div className="app-container">
            <AuthProvider>
                <Routes>
                    <Route index path="/" element={<LeaderboardPage onShowLogin={() => setIsLoginVisible(true)}/>}/>
                    <Route path="/game" element={<GamePage/>}/>
                    <Route path="/registration" element={<RegistrationPage/>}/>
                </Routes>
                {isLoginVisible && <LoginDialog onClose={() => setIsLoginVisible(false)}/>}
            </AuthProvider>
        </div>
    );
}

export default App;
