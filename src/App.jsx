import "./App.css";
import { createContext, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
export const AppContext = createContext();
function App() {
  const [user, setUser] = useState({});
  return (
    <div className="App-Container">
      <AppContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Header />
            <Routes>
              <Route index element={<Login />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="register" element={<Register />} />
              <Route path="logout" element={<Logout />} />
            </Routes>
          <Footer />
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
