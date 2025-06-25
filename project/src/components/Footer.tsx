import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4 mt-8 border-t border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm">
      <span>&copy; 2025 Syed Nusrath Hussaine. All rights reserved.</span>
      <span className="mx-4">|</span>
      <span>Authorized & Developed by <strong>Syed Nusrath Hussaine</strong></span>
      <span className="mx-4">|</span>
      <span>Contact: <a href="mailto:syednusrath2604@gmail.com" className="underline hover:text-green-600">syednusrath2604@gmail.com</a></span>
    </footer>
  );
};

export default Footer;
