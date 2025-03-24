'use client'
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle("overflow-hidden");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <img src="https://i.postimg.cc/PrkvMc05/Artboard12.png" alt="Pesabu" className="w-16 h-16 md:w-24 md:h-24" />
        </a>
  
        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-2">
          <li><a href="#" className="nav-link">Home</a></li>
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#services" className="nav-link">Services</a></li>
          <li><a href="#testimonials" className="nav-link">Testimonials</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
          <li><a href="/pinsights" className="nav-link">Mpesa Analyser</a></li>

        </ul>
  
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-pesabu-teal" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          <Menu size={24} />
        </button>
  
        {/* Mobile Navigation */}
        <div className={`fixed top-0 left-0 h-full w-full md:hidden bg-white transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-50`}>
          <div className="flex justify-end p-6">
            <button onClick={closeMenu} className="text-pesabu-teal">
              <X size={24} />
            </button>
          </div>
          <ul className="flex flex-col items-center space-y-6 mt-10 p-6">
            <li><a href="#" className="nav-link text-xl" onClick={closeMenu}>Home</a></li>
            <li><a href="#about" className="nav-link text-xl" onClick={closeMenu}>About</a></li>
            <li><a href="#services" className="nav-link text-xl" onClick={closeMenu}>Services</a></li>
            <li><a href="#testimonials" className="nav-link text-xl" onClick={closeMenu}>Testimonials</a></li>
            <li><a href="#gallery" className="nav-link text-xl" onClick={closeMenu}>Gallery</a></li>
            <li><a href="#contact" className="nav-link text-xl" onClick={closeMenu}>Contact</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
