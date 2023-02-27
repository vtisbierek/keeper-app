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
    const [isUserReady, setUserReady] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        handleTokenFromQueryParams();
    }, []);
    
    useEffect(() => {
        if(isUserReady){
            const searchParam = encodeURIComponent(userData.sub);
            console.log(isUserReady, searchParam, "get request");
            fetch(process.env.REACT_APP_BACKEND_API+"?author="+searchParam)
            .then((res) => res.json())
            .then((data) => {
                setItems(data.map(entry => {
                    return {
                        title: entry.title,
                        content: entry.content,
                        author: entry.author
                    };
                }));
            });
        }
    }, [isUserReady]);

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

    useEffect(() => {
        async function getUserData() {
          try { 
            const data = await getGoogleInfo(); //se o login for feito com sucesso, pega as informações do Google
            setUserData(data);   
            
          } catch (e) {
            console.warn(e);
          } finally {
            console.log(userData, userData.picture, "aleluia");
          }
        }

        if(isLoggedIn){
            getUserData();
        }

    }, [isLoggedIn]);

    useEffect(() => {    //após as informações do Google serem carregadas, seta o usuário como ready pra renderizar tudo
        if(Object.keys(userData).length !== 0){
            setUserReady(true);
        }
    }, [userData]);

    function addItem(newItem){
        newItem.author = userData.sub;
    
        setItems((prevItems) => {
            console.log(prevItems);
            return [...prevItems, newItem];
        })

        setPosted(true);
    }

    function deleteItem(id){
        setItems((prevItems) => {
            console.log(prevItems);
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

    const handleTokenFromQueryParams = async () => {
        const query = new URLSearchParams(window.location.search);

        const accessToken = query.get("accessToken");
        const refreshToken = query.get("refreshToken");

        const expirationDate = newExpirationDate();
        console.log("App.js 30 | expiration Date", expirationDate);

        const isValidAuth = await fetch(process.env.REACT_APP_BACKEND_CHECK_AUTH_URL)
            .then((res) => res.json())
            .then((data) => {
                return data;
            });

        console.log(isValidAuth, "isValidAuth");

        if (isValidAuth && accessToken && refreshToken) {
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
        console.log("se foi 0");
        fetch(process.env.REACT_APP_BACKEND_REVOKE_AUTH_URL, {
            method: "POST", 
            mode: "cors",
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({auth: "revoke"})
        });

        setIsLoggedIn(false);
        setUserData({});
        setUserReady(false);
        sessionStorage.clear();
    };

    function loginUser(){
        createGoogleAuthLink();  
    }

    function logoutUser(){
        signOut();
    }

    return(
        <>
            <Header name="Keeper" handleLogin={loginUser} handleLogout={logoutUser} isReady={isUserReady} imgURL={userData.picture} userName={userData.fullName} />
            <CreateArea onAdd={addItem} />
            {isUserReady && items.map((item, index) => {
                return <Note key={index} id={index} title={item.title} content={item.content} onDelete={deleteItem} />;
            })}
            <Footer />
        </>
    );
}

export default App;