import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CalendarPage from "./pages/CalendarPage";
import 'rsuite/dist/rsuite.min.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/calendar" element={<CalendarPage/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
