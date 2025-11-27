import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Información de la Empresa */}
          <div>
            <h3 className="text-base font-bold mb-2 text-blue-400">Ferretería Bastidas</h3>
            <p className="text-gray-400 text-xs mb-3 leading-relaxed">
              Sistema de gestión de inventario profesional para control completo de productos, 
              entradas, salidas y movimientos de stock.
            </p>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center text-xs text-gray-400">
                <MapPinIcon className="h-3 w-3 mr-1.5" />
                <span>Colombia</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <EnvelopeIcon className="h-3 w-3 mr-1.5" />
                <a href="mailto:cbastidas52@gmail.com" className="hover:text-blue-400 transition-colors truncate">
                  cbastidas52@gmail.com
                </a>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <PhoneIcon className="h-3 w-3 mr-1.5" />
                <a href="tel:+573042189080" className="hover:text-blue-400 transition-colors">
                  +57 304 218 9080
                </a>
              </div>
            </div>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-base font-bold mb-2 text-blue-400">Soporte</h3>
            <ul className="space-y-1.5">
              <li>
                <a 
                  href="mailto:cbastidas52@gmail.com?subject=Soporte - Inventario Ferretería Bastidas" 
                  className="flex items-center text-xs text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <QuestionMarkCircleIcon className="h-3 w-3 mr-1.5" />
                  Contactar Soporte
                </a>
              </li>
              <li>
                <a 
                  href="mailto:cbastidas52@gmail.com?subject=Documentación - Inventario Ferretería Bastidas" 
                  className="flex items-center text-xs text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                  Documentación
                </a>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-xs text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <span className="mr-1.5">📊</span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Créditos */}
          <div>
            <h3 className="text-base font-bold mb-2 text-blue-400">Desarrollado por</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-white">Carlos Bastidas</p>
              <p className="truncate">cebastidas@uniguajira.edu.co</p>
              <p className="mt-2 text-xs text-gray-500">
                Sistema de Inventario v1.0.0
              </p>
              <p className="text-xs text-gray-500">
                © {currentYear} Ferretería Bastidas. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <p>
              Hecho con <span className="text-red-500">❤️</span> para Ferretería Bastidas
            </p>
            <div className="flex space-x-3 mt-2 md:mt-0">
              <span>React + Vite</span>
              <span>•</span>
              <span>Node.js + Express</span>
              <span>•</span>
              <span>MySQL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

