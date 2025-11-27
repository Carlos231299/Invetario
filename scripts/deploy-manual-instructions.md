# Instrucciones de Despliegue Manual

Si SSH no funciona, puedes desplegar manualmente desde la consola de AWS:

## Opción 1: AWS Systems Manager Session Manager

1. En la consola de AWS, ve a **Systems Manager → Session Manager**
2. Haz clic en **"Iniciar sesión"**
3. Selecciona la instancia: **i-0751510be895709cb**
4. Se abrirá una terminal en el navegador
5. Ejecuta estos comandos:

```bash
# Clonar repositorio
sudo rm -rf /var/www/inventario-ferreteria-bastidas
sudo mkdir -p /var/www/inventario-ferreteria-bastidas
sudo chown ubuntu:ubuntu /var/www/inventario-ferreteria-bastidas
cd /var/www/inventario-ferreteria-bastidas
git clone https://github.com/Carlos231299/Invetario.git .

# Configurar backend
cd backend
npm install --production
cp .env.example .env
sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com|' .env

# Configurar base de datos
sudo mysql -e "CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;"
sudo mysql inventario_ferreteria_bastidas < src/database/schema.sql

# Configurar PM2
pm2 delete inventario-backend || true
pm2 start server.js --name inventario-backend
pm2 save

# Configurar frontend
cd ../frontend
npm install
VITE_API_URL=http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com/api npm run build

# Desplegar frontend
sudo rm -rf /var/www/html/inventario
sudo mkdir -p /var/www/html/inventario
sudo cp -r dist/* /var/www/html/inventario/
sudo chown -R www-data:www-data /var/www/html/inventario

# Configurar Nginx
sudo tee /etc/nginx/sites-available/inventario > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html/inventario;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location /api { 
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/inventario /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## Opción 2: User Data Script

Puedes agregar un script de User Data a la instancia que ejecute el despliegue automáticamente al iniciar.

