import React, {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
/* import notes from "../notes"; */
import CreateArea from "./CreateArea";

function App(){
    const [items, setItems] = useState([]);

    function addItem(newItem){
        setItems((prevItems) => {
            return [...prevItems, newItem];
        });
        console.log(items);
    }

    function deleteItem(id){
        setItems((prevItems) => {
            return prevItems.filter((item, index) => {
                return index !== id;
            });
        });
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