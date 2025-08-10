import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="min-h-dvh min-w-screen bg-gray-100">
      <Outlet />
    </div>
  );
}

export default App;
