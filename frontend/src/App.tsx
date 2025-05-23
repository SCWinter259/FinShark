import './App.css'
import NavBar from "./Components/NavBar.tsx";
import {Outlet} from "react-router";
import "react-toastify/dist/ReactToastify.css"  // styles for the toast
import {ToastContainer} from "react-toastify";
import {UserProvider} from "../Context/useAuth.tsx";
import store from './Redux/store.ts';
import {Provider} from "react-redux";

function App() {
    

  return (
    <>
        <UserProvider>
            <Provider store={store}>
                <NavBar/>
                <Outlet/>
                <ToastContainer/>
            </Provider>
        </UserProvider>
    </>
  );
}

export default App;
