import "./App.css";
import Task from "./Task";
import Charges from "./charges.json";
import Items from "./items.json";

function App() {
  // console.log(Items.items);
  // console.log(Charges);
  return (
    <div className="App">
      <Task Items={Items} />
    </div>
  );
}

export default App;
