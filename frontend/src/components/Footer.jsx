import React from 'react';
import { Car, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-black text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col justify-between h-full">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Car className="h-7 w-7 text-yellow-500" />
                <span className="font-bold text-xl tracking-tight text-zinc-50">MOTO<span className="text-yellow-500">MATE</span></span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Premium, convenient, and eco-friendly car wash and detailing services at your doorstep.
              </p>
            </div>
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} MOTOMate Technologies. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-zinc-50 font-bold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition-colors">Our Services</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing Plans</Link></li>
              <li><Link to="/#reviews" className="hover:text-blue-400 transition-colors">Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-zinc-50 font-bold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-zinc-50 font-bold text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 shrink-0" />
                <span>123 MOTOMate Hub, Tech Park,<br/>Mumbai 400001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                <span>support@motormate.com</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h4 className="text-zinc-50 font-bold text-sm mb-4 uppercase tracking-wider">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 text-zinc-500 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all transform hover:-translate-y-1">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4 text-xs text-zinc-400">
              <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
