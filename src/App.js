import './App.css';
import PackageList from './components/PackageList';
import ChargeTable from './components/ChargeTable';
import CTable from './data/charges.json';
import Items from './data/items.json';
// See README.md

function App() {
    // console.log(Items.items);
    // console.log(Charges);
    return (
        <div
            className='App'
            style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                padding: 20,
            }}
        >
            <PackageList Items={Items} />
            <ChargeTable CTable={CTable} />
        </div>
    );
}

export default App;
