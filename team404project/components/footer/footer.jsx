export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-14">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Social Media</h3>
          <div className="flex gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md cursor-pointer">
              <i className="fab fa-instagram text-lg"></i>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md cursor-pointer">
              <i className="fab fa-twitter text-lg"></i>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md cursor-pointer">
              <i className="fab fa-linkedin-in text-lg"></i>
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Links</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="cursor-pointer hover:text-black">Home</li>
            <li className="cursor-pointer hover:text-black">About</li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Help & Support</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="cursor-pointer hover:text-black">Contact Us</li>
            <li className="cursor-pointer hover:text-black">Blog</li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
