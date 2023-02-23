import React, {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function CreateArea(props) {
  const [inputText, setInputText] = useState({
    title: "",
    content: ""
  });

  const [isExpanded, setExpanded] = useState(false);

  function handleInput(event){
      const {value, name} = event.target;
      
      setInputText((prevValue) => {
          return {
            ...prevValue,
            [name]: value //sou obrigado a colocar os [] ao redor de name pra o programa entender que quero a variável dentro de name ("title" ou "content"), e não uma string chamada "name"
          };
      });
  }

  function submitItem(event){
    props.onAdd(inputText);
    setInputText(() => {
      return {
        title: "",
        content: ""
      };
    });
    event.preventDefault();
  }

  function expand(){
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && <input name="title" placeholder="Title" onChange={handleInput} value={inputText.title} />}
        <textarea name="content" placeholder="Take a note..." rows={isExpanded ? "3" : "1"} onChange={handleInput} onClick={expand} value={inputText.content} />
        <Zoom in={isExpanded}>
          <Fab onClick={submitItem} >
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;