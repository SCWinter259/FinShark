import './App.css'
import NavBar from "./Components/NavBar/NavBar.tsx";
import {Outlet} from "react-router";
import "react-toastify/dist/ReactToastify.css"  // styles for the toast
import {ToastContainer} from "react-toastify";
import {UserProvider} from "../Context/useAuth.tsx";
// import Hero from "./Components/Hero/Hero.tsx";

function App() {
    

  return (
    <>
        <UserProvider>
            <NavBar/>
            <Outlet/>
            <ToastContainer/>
        </UserProvider>
    </>
  );
}

export default App;
