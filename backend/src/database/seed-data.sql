-- Datos de ejemplo para Inventario Ferretería Bastidas
USE inventario_ferreteria_bastidas;

-- Categorías
INSERT INTO categories (nombre, descripcion) VALUES
('Herramientas Manuales', 'Martillos, destornilladores, alicates, etc.'),
('Herramientas Eléctricas', 'Taladros, sierras, lijadoras, etc.'),
('Materiales de Construcción', 'Cemento, arena, ladrillos, etc.'),
('Pinturas y Accesorios', 'Pinturas, brochas, rodillos, etc.'),
('Fontanería', 'Tuberías, grifos, conexiones, etc.'),
('Electricidad', 'Cables, interruptores, bombillas, etc.'),
('Ferretería General', 'Tornillos, clavos, tuercas, etc.'),
('Jardinería', 'Herramientas de jardín, plantas, etc.')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Proveedores
INSERT INTO suppliers (nombre, contacto, telefono, email, direccion) VALUES
('Ferretería El Constructor S.A.', 'Juan Pérez', '3001234567', 'ventas@constructor.com', 'Calle 50 #30-20, Barranquilla'),
('Distribuidora de Materiales Ltda.', 'María González', '3002345678', 'contacto@distribuidora.com', 'Av. 68 #45-10, Bogotá'),
('Herramientas Pro Colombia', 'Carlos Rodríguez', '3003456789', 'info@herramientaspro.com', 'Carrera 15 #25-30, Medellín'),
('Materiales y Más', 'Ana Martínez', '3004567890', 'ventas@materialesymas.com', 'Calle 100 #50-15, Cali'),
('Suministros Industriales del Norte', 'Luis Fernández', '3005678901', 'pedidos@suministros.com', 'Av. Circunvalar #80-25, Barranquilla'),
('Ferretería La Esquina', 'Pedro Sánchez', '3006789012', 'laesquina@ferreteria.com', 'Calle 72 #10-05, Cartagena')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Productos
INSERT INTO products (codigo, nombre, descripcion, categoria_id, proveedor_id, stock, precio_compra, precio_venta) VALUES
('PROD001', 'Martillo de Acero 500g', 'Martillo de acero forjado con mango de fibra de vidrio', 1, 1, 25, 15000, 25000),
('PROD002', 'Destornillador Phillips #2', 'Destornillador Phillips punta #2, mango ergonómico', 1, 1, 50, 5000, 8500),
('PROD003', 'Taladro Percutor 750W', 'Taladro percutor inalámbrico con batería de litio', 2, 2, 12, 180000, 280000),
('PROD004', 'Sierra Circular 7 1/4"', 'Sierra circular profesional con hoja de carburo', 2, 2, 8, 250000, 380000),
('PROD005', 'Cemento Gris 50kg', 'Cemento Portland tipo I, bolsa de 50kg', 3, 3, 100, 25000, 35000),
('PROD006', 'Arena Fina 1m³', 'Arena de río lavada, metro cúbico', 3, 3, 15, 80000, 120000),
('PROD007', 'Pintura Acrílica Blanca 1gal', 'Pintura acrílica de alta calidad, cubre 40m²', 4, 4, 30, 45000, 65000),
('PROD008', 'Brocha 4" Cerdas Naturales', 'Brocha de cerdas naturales para pintura', 4, 4, 40, 12000, 20000),
('PROD009', 'Tubería PVC 1/2" x 6m', 'Tubería PVC para agua potable, 6 metros', 5, 5, 60, 15000, 25000),
('PROD010', 'Grifo Monomando Cocina', 'Grifo monomando cromado para cocina', 5, 5, 20, 85000, 130000),
('PROD011', 'Cable THHN 12 AWG x 100m', 'Cable eléctrico THHN calibre 12, 100 metros', 6, 6, 25, 120000, 180000),
('PROD012', 'Interruptor Simple 15A', 'Interruptor simple para 15 amperios', 6, 6, 45, 8000, 15000),
('PROD013', 'Tornillos Autorroscantes #8 x 1"', 'Tornillos autorroscantes zincados, caja 100 unidades', 7, 1, 80, 15000, 25000),
('PROD014', 'Clavos Galvanizados 2 1/2"', 'Clavos galvanizados, caja 1kg', 7, 1, 100, 12000, 20000),
('PROD015', 'Pala de Jardín', 'Pala de acero con mango de madera', 8, 2, 15, 35000, 55000),
('PROD016', 'Alicate Universal 8"', 'Alicate universal de acero inoxidable', 1, 1, 35, 18000, 30000),
('PROD017', 'Lijadora Orbital 1/4', 'Lijadora orbital eléctrica con sistema de extracción', 2, 2, 10, 120000, 190000),
('PROD018', 'Ladrillo Común 10x20x40cm', 'Ladrillo común de arcilla cocida', 3, 3, 500, 800, 1200),
('PROD019', 'Rodillo de Espuma 9"', 'Rodillo de espuma para pintura, 9 pulgadas', 4, 4, 25, 15000, 25000),
('PROD020', 'Válvula de Compuerta 1/2"', 'Válvula de compuerta para agua, 1/2 pulgada', 5, 5, 18, 45000, 75000)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Algunas entradas de ejemplo
INSERT INTO entries (producto_id, cantidad, fecha, usuario_id) VALUES
(1, 10, NOW() - INTERVAL 5 DAY, 1),
(2, 20, NOW() - INTERVAL 4 DAY, 1),
(3, 5, NOW() - INTERVAL 3 DAY, 1),
(5, 50, NOW() - INTERVAL 2 DAY, 1),
(7, 15, NOW() - INTERVAL 1 DAY, 1)
ON DUPLICATE KEY UPDATE cantidad=cantidad;

