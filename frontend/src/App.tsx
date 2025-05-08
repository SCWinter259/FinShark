// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import NavBar from "./Components/NavBar/NavBar.tsx";
import {Outlet} from "react-router";
// import Hero from "./Components/Hero/Hero.tsx";

function App() {
    

  return (
    <>
        <NavBar/>
        <Outlet/>
    </>
  );
}

export default App;
