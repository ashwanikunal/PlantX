export default function Footer() {
  return (
    <footer className="w-full bg-[#f7f6f4] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* BRAND */}
          <div>
            <h3 className="text-2xl font-semibold text-green-900 mb-4">
              Green India
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Building a greener, smarter future through data-driven
              environmental insights and community action.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800 mb-4">
              Links
            </h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-green-900 cursor-pointer transition">
                Home
              </li>
              <li className="hover:text-green-900 cursor-pointer transition">
                About
              </li>
              <li className="hover:text-green-900 cursor-pointer transition">
                Get Started
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800 mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-green-900 cursor-pointer transition">
                Contact
              </li>
              <li className="hover:text-green-900 cursor-pointer transition">
                Blog
              </li>
              <li className="hover:text-green-900 cursor-pointer transition">
                FAQs
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-800 mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-green-100 transition">
                <i className="fab fa-facebook-f text-gray-800"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-green-100 transition">
                <i className="fab fa-twitter text-gray-800"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-green-100 transition">
                <i className="fab fa-instagram text-gray-800"></i>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-300 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Green India. All rights reserved.</span>
          <span className="mt-2 md:mt-0">
            Made with 💚 for a sustainable future by <span className="font-semibold">TEAM404</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
