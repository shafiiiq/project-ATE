import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../../assets/images/al-ansari.png';
import '../Header/Header.css';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef(null);
  const activeItemRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Set active link based on current route
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    // Update the indicator position when activeLink changes
    updateIndicatorPosition();
  }, [activeLink]);

  const updateIndicatorPosition = () => {
    if (!navRef.current) return;
    
    // Find the active nav item
    const navItems = navRef.current.querySelectorAll('li');
    let activeItem = null;
    
    navItems.forEach(item => {
      const link = item.querySelector('a');
      const href = link.getAttribute('href');
      const to = link.getAttribute('to');
      
      if ((to === activeLink) || (href === activeLink)) {
        activeItem = item;
      }
    });

    if (activeItem) {
      const activeLink = activeItem.querySelector('a');
      const { width, left } = activeLink.getBoundingClientRect();
      const navLeft = navRef.current.getBoundingClientRect().left;
      
      // Set the indicator position and width
      setIndicatorStyle({
        width: `${width * 0.8}px`,
        left: `${left - navLeft + (width * 0.1)}px`
      });
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = (path) => {
    setActiveLink(path);
    setMenuOpen(false);
  };

  useEffect(() => {
    // Prevent body scrolling when menu is open
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // Update indicator position when window is resized
  useEffect(() => {
    window.addEventListener('resize', updateIndicatorPosition);
    // Initial position
    setTimeout(updateIndicatorPosition, 100);
    
    return () => {
      window.removeEventListener('resize', updateIndicatorPosition);
    };
  }, []);

  return (
    <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-section">
          <img src={logoImage} alt="Al Ansari Logo" className="header-logo" />
        </div>

        <div className={`hamburger-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <div className="hamburger-inner">
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </div>
        </div>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`} ref={navRef}>
          <div className="mobile-nav-background">
            <div className="animated-shape shape1"></div>
            <div className="animated-shape shape2"></div>
            <div className="animated-shape shape3"></div>
            <div className="animated-shape shape4"></div>
          </div>
          
          <div className="nav-indicator" ref={indicatorRef} style={indicatorStyle}></div>
          
          <ul>
            <li className={activeLink === '/' ? 'active' : ''}>
              <Link to="/">Home</Link>
            </li>
            <li className={activeLink === '/equipments' ? 'active' : ''}>
              <Link to="/equipments" onClick={() => handleNavClick('/equipments')}>Equipements Inventory</Link>
            </li>
            <li className={activeLink === '/stocks' ? 'active' : ''}>
              <Link to="/stocks" onClick={() => handleNavClick('/stocks')}>Stocks Inventory</Link>
            </li>
            <li className={activeLink === '/equipment-updates' ? 'active' : ''}>
              <Link to="/equipment-updates" onClick={() => handleNavClick('/equipment-updates')}>Equipments Updates</Link>
            </li>
            <li className={activeLink === '/notification/next-full-service' ? 'active' : ''}>
              <Link to="/notification/next-full-service" onClick={() => handleNavClick('/notification/next-full-service')}>Notifications</Link>
            </li>
            <li className={activeLink === '#clients' ? 'active' : ''}>
              <a href="#clients" onClick={() => handleNavClick('#clients')}>LPO For Quatation</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="header-background">
        <div className="animated-shape shape1"></div>
        <div className="animated-shape shape2"></div>
        <div className="animated-shape shape3"></div>
      </div>
    </header>
  );
};

export default Header;