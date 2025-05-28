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
        <Provider store={store}>
            <UserProvider>
                <NavBar/>
                <Outlet/>
                <ToastContainer/>
            </UserProvider>
        </Provider>
    </>
  );
}

export default App;
