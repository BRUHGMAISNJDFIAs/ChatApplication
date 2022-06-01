import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

const Signin = () => {
    const handleClick = async () => {
        const usernameEl = document.getElementById("username");
        const passwordEl = document.getElementById("password");
        const statusEl = document.getElementById("statusEl");
        
        const baseURL = require("../config.json").apiURL;
        
        const data = {
            "username": usernameEl.value,
            "password": passwordEl.value
        }
        
        const url = `${baseURL}/signin`;
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };

        try {
            await fetch(url, options).then(async response => {
                const jsonResponse = await response.json();
                if (jsonResponse.success) {
                    statusEl.textContent = `Successfully signed in as ${usernameEl.value}`;
                    localStorage.setItem("password", passwordEl.value);
                    localStorage.setItem("username", usernameEl.value);
                    usernameEl.value = "";
                    passwordEl.value = "";
                    window.document.location = "/messaging";
                } else {
                    statusEl.textContent = jsonResponse.cause
                };
            });
        }
        catch (err) {
            statusEl.textContent = "Something went wrong! Contact Mutayyab on discord: Mutyyab.#4275"
            console.log(err)
        }
    };

    useEffect(() => {
        (async () => {
            const username = localStorage.getItem("username");
            const password = localStorage.getItem("password");
            
            if (username && password) {
                const data = {
                    "username": username,
                    "password": password
                };

                const url = `${require("../config.json").apiURL}/signin`;
                
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                };
                
                try {
                    await fetch(url, options).then(async response => {
                        const jsonResponse = await response.json();
                        if (jsonResponse.success) {
                            window.document.location = "/messaging";
                        } else {
                            localStorage.removeItem("password");
                            localStorage.removeItem("username");
                        };
                    });
                } catch (err) {
                    statusEl.textContent = "Something went wrong! Contact Mutayyab on discord: Mutyyab.#4275"
                    console.log(err)
                }
            } else if (username || password) {
                localStorage.clear();
            };
        })();
    }, []);

    return (
        <>
            <h1>Sign In</h1>
        
            <input maxLength="50" className="inputBox" type="username" id="username" name="username" placeholder="Username" />

            <br />
            <br />

            <input maxLength="20" className="inputBox" type="password" id="password" name="password" placeholder="Password" />

            <p id="statusEl"></p>

            <button onClick={handleClick} id="submitButton">Sign In</button>

            <p className="footer">Alternatively, if you don't have an account, you can <Link to="/signup">sign up.</Link></p>
        </>
    );
};

export default Signin;