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
        console.log(sessionStorage, "sessionStorage");
        handleTokenFromQueryParams();
    }, []);
    
    useEffect(() => {
        if(isUserReady){
            if(sessionStorage.sessionStarting === "true"){
                startNewSession();
            }

            const searchParam = encodeURIComponent(userData.sub);
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
            console.log("is posted");

            let itemsToSend = [...items];
            itemsToSend.push(userData.sub);

            console.log(itemsToSend, "itemsToSend");

            fetch(process.env.REACT_APP_BACKEND_API, {
                method: "POST", 
                mode: "cors",
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(itemsToSend)
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
            console.log("get user data");
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
            console.log(prevItems, "xx");
            return [...prevItems, newItem];
        })
        setPosted(true);
    }

    function deleteItem(id){
        setItems((prevItems) => {
            console.log(prevItems, "yy");
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

    const startNewSession = async () => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get("accessToken");

        const sessionToken = {
            token: token,
            authorization: true
        };

        console.log(sessionStorage, "dentro");
        await fetch(process.env.REACT_APP_BACKEND_CHECK_AUTH_URL, {
            method: "POST",
            mode: "cors",
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(sessionToken)
        });
        sessionStorage.setItem("sessionStarting", false);
        sessionStorage.setItem("sessionStarted", true);
    };

    const handleTokenFromQueryParams = async () => {
        const query = new URLSearchParams(window.location.search);
        const accessToken = query.get("accessToken");
        const refreshToken = query.get("refreshToken");

        const expirationDate = newExpirationDate();
        console.log("App.js 30 | expiration Date", expirationDate);

        let conditionalAcceptance = true;

        if(sessionStorage.sessionStarted === "true" || sessionStorage.sessionEnded === "true"){           
            const searchParam = encodeURIComponent(accessToken);
            conditionalAcceptance = await fetch(process.env.REACT_APP_BACKEND_CHECK_AUTH_URL+"?token="+searchParam)
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "retorno de auth check");
                return data;
            });
        }

        if (conditionalAcceptance && accessToken && refreshToken) {
            console.log("set is logged in");
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
        const revokeToken = {
            token: sessionStorage.accessToken,
        }

        fetch(process.env.REACT_APP_BACKEND_REVOKE_AUTH_URL, {
            method: "POST", 
            mode: "cors",
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(revokeToken)
        });

        setIsLoggedIn(false);
        setUserData({});
        setUserReady(false);
        sessionStorage.clear();
        sessionStorage.setItem("sessionEnded", true); //como já tinha uma sessão em andamento, eu deixo essa flag marcada
    };

    function loginUser(){
        sessionStorage.setItem("sessionEnded", false);
        sessionStorage.setItem("sessionStarting", true);
        createGoogleAuthLink();
    }

    function logoutUser(){
        signOut();
    }

    return(
        <>
            <Header name="Keeper" handleLogin={loginUser} handleLogout={logoutUser} isReady={isUserReady} imgURL={userData.picture} userName={userData.fullName} />
            {isUserReady && <CreateArea onAdd={addItem} />}
            {isUserReady && items.map((item, index) => {
                return <Note key={index} id={index} title={item.title} content={item.content} onDelete={deleteItem} />;
            })}
            <Footer />
        </>
    );
}

export default App;