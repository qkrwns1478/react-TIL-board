import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import LoginForm from "./LoginForm";
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
                    <Route path="/login" element={<LoginForm mode="login" />} />
                    <Route path="/signup" element={<LoginForm mode="signup" />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
