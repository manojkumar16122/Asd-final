import React from 'react';

export default function Footer() {
  const handleContactClick = () => {
    window.open('https://forms.gle/VqRu8SzbDdPrUnu8A', '_blank');
  };

  return (
    <footer className="bg-white rounded-xl shadow-sm mt-8 p-8">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
          <span>📞</span> Need Help?
        </h3>
        <p className="text-gray-600 mb-6">We're here to support you and your child's journey</p>
        <button
          onClick={handleContactClick}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center gap-2 mx-auto"
        >
          <span>✉️</span> Contact Us
        </button>
      </div>
    </footer>
  );
}