import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faImages, faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const sidebarVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '-100%' },
};

const sidebarTransition = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.button
        className="fixed top-4 left-4 z-50 p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        onClick={toggleSidebar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
      </motion.button>

      <motion.nav
        className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 shadow-lg z-40"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        exit="closed"
        variants={sidebarVariants}
        transition={sidebarTransition}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <motion.ul 
              className="space-y-2 py-4"
              variants={{
                open: {
                  transition: { staggerChildren: 0.07, delayChildren: 0.2 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
            >
              <motion.li variants={{
                open: { y: 0, opacity: 1 },
                closed: { y: -20, opacity: 0 }
              }}>
                <Link
                  to="/home"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-3" />
                  <span>Home</span>
                </Link>
              </motion.li>
              <motion.li variants={{
                open: { y: 0, opacity: 1 },
                closed: { y: -20, opacity: 0 }
              }}>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-3" />
                  <span>Profile</span>
                </Link>
              </motion.li>
              <motion.li variants={{
                open: { y: 0, opacity: 1 },
                closed: { y: -20, opacity: 0 }
              }}>
                <Link
                  to="/addPost"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faImages} className="w-5 h-5 mr-3" />
                  <span>Add Post</span>
                </Link>
              </motion.li>
              <motion.li variants={{
                open: { y: 0, opacity: 1 },
                closed: { y: -20, opacity: 0 }
              }}>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <FontAwesomeIcon icon={faCog} className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </motion.li>
            </motion.ul>
          </div>
          <div className="border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </motion.nav>

      <main className="ml-64 p-4 transition-all duration-300 ease-in-out">
        {/* Main content */}
      </main>
    </>
  );
}