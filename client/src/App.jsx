import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Header from "./Header";
import Footer from "./Footer";
import Error from "./Error";
import "./css/App.css";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
