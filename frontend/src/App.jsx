import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <HeroSection />
    </BrowserRouter>
  );
}

export default App;