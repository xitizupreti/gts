import "./App.css";
import Task from "./Task";
import ChargeTable from "./ChargeTable";
import CTable from "./charges.json";
import Items from "./items.json";
// See README.md

function App() {
  // console.log(Items.items);
  // console.log(Charges);
  return (
    <div className="App">
      <ChargeTable CTable={CTable} />
      <Task Items={Items} />
    </div>
  );
}

export default App;
