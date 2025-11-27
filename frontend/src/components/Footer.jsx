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
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700 fixed bottom-0 left-0 right-0 z-40 shadow-lg">
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
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <PhoneIcon className="h-4 w-4 mr-2" />
              <a href="tel:+573042189080" className="hover:text-blue-400 transition-colors">
                +57 304 218 9080
              </a>
            </div>
            <div className="flex items-center text-sm">
              <a
                href="https://wa.me/573042189080?text=Hola,%20necesito%20soporte%20con%20el%20sistema%20de%20inventario"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
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

