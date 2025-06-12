import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Header from "./Header";
import Footer from "./Footer";
import Error from "./Error";
import "./css/App.css";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <main>
                <nav>
                    <Link to="/">HOME</Link> | <Link to="/login">로그인</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
