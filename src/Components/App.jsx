import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import {getGoogleInfo} from "../googleApi";

function App(){
    const [items, setItems] = useState([]);
    const [isPosted, setPosted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        handleTokenFromQueryParams();

        fetch(process.env.REACT_APP_BACKEND_API)
          .then((res) => res.json())
          .then((data) => {
            setItems(data.map(entry => {
                return {
                    title: entry.title,
                    content: entry.content
                };
            }));
        });
    }, []);

    useEffect(() => {
        if(isPosted){
            fetch(process.env.REACT_APP_BACKEND_API, {
                method: "POST", 
                mode: "cors",
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(items)
            });
        }
        setPosted(false);

    }, [isPosted]);

    function addItem(newItem){
        setItems((prevItems) => {
            return [...prevItems, newItem];
        })

        setPosted(true);
    }

    function deleteItem(id){
        setItems((prevItems) => {
            return prevItems.filter((item, index) => {
                return index !== id;
            });
        });

        setPosted(true);
    }

    const createGoogleAuthLink = async () => {
        try {
          const request = await fetch(process.env.REACT_APP_BACKEND_AUTH_URL, {
            method: "POST",
          });
          const response = await request.json();
          window.location.href = response.url;
        } catch (error) {
          console.log("App.js 12 | error", error);
          throw new Error("Issue with Login", error.message);
        }
    };

    const handleTokenFromQueryParams = () => {
        const query = new URLSearchParams(window.location.search);
        const accessToken = query.get("accessToken");
        const refreshToken = query.get("refreshToken");
        const expirationDate = newExpirationDate();
        console.log("App.js 30 | expiration Date", expirationDate);
        if (accessToken && refreshToken) {
          storeTokenData(accessToken, refreshToken, expirationDate);
          setIsLoggedIn(true);
        }
    };

    const newExpirationDate = () => {
        var expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        return expiration;
    };

    const storeTokenData = async (token, refreshToken, expirationDate) => {
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("expirationDate", expirationDate);
    };

    const signOut = () => {
        setIsLoggedIn(false);
        sessionStorage.clear();
    };

    function handleLoginLogic(){
        if(!isLoggedIn){
            createGoogleAuthLink(); 
        } else {
            signOut();
        }
    }

    if(isLoggedIn){
        const userData = getGoogleInfo();
        console.log(userData);
    }

    return(
        <>
            <Header name="Keeper" handleLogin={handleLoginLogic} />
            <CreateArea onAdd={addItem} />
            {items.map((item, index) => {
                return <Note key={index} id={index} title={item.title} content={item.content} onDelete={deleteItem} />;
            })}
            <Footer />
        </>
    );
}

export default App;