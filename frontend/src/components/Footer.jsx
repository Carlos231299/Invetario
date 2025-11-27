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
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Información de la Empresa */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-400">Ferretería Bastidas</h3>
            <p className="text-gray-400 text-sm mb-4">
              Sistema de gestión de inventario profesional para control completo de productos, 
              entradas, salidas y movimientos de stock.
            </p>
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>Colombia</span>
            </div>
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              <a href="mailto:cbastidas52@gmail.com" className="hover:text-blue-400 transition-colors">
                cbastidas52@gmail.com
              </a>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <PhoneIcon className="h-4 w-4 mr-2" />
              <span>+57 (300) XXX-XXXX</span>
            </div>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-400">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:cbastidas52@gmail.com?subject=Soporte - Inventario Ferretería Bastidas" 
                  className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                  Contactar Soporte
                </a>
              </li>
              <li>
                <a 
                  href="mailto:cbastidas52@gmail.com?subject=Documentación - Inventario Ferretería Bastidas" 
                  className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Documentación
                </a>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <span className="mr-2">📊</span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Créditos */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-400">Desarrollado por</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p className="font-semibold text-white">Carlos Bastidas</p>
              <p>cebastidas@uniguajira.edu.co</p>
              <p className="mt-4 text-xs text-gray-500">
                Sistema de Inventario v1.0.0
              </p>
              <p className="text-xs text-gray-500">
                © {currentYear} Ferretería Bastidas. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              Hecho con <span className="text-red-500">❤️</span> para Ferretería Bastidas
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
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

