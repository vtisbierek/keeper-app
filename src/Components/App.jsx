import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
/* import notes from "../notes"; */
import CreateArea from "./CreateArea";

function App(){
    const [items, setItems] = useState([]);
    const [isPosted, setPosted] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/")
          .then((res) => res.json())
          .then((data) => {
            setItems(data.map(entry => {
                return {
                    title: entry.title,
                    content: entry.content
                };
            }));
        });
        console.log("oi");
    }, []);

    useEffect(() => {
        if(isPosted){
            fetch("http://localhost:8000/", {
                method: "POST", 
                mode: "cors",
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(items)
            });
        }
        console.log("hey");

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

    return(
        <>
            <Header name="Keeper" />
            <CreateArea onAdd={addItem} />
            {items.map((item, index) => {
                return <Note key={index} id={index} title={item.title} content={item.content} onDelete={deleteItem} />;
            })}
            {/* {notes.map(note => (<Note key={note.key} title={note.title} content={note.content} />))} */}
            <Footer />
        </>
    );
}

export default App;