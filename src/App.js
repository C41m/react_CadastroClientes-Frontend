import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CrudComponent from "../src/components/Clientes/CrudComponent";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <CrudComponent />
    </div>
  );
}

export default App;
