# Verificación del Security Group

## Pasos para verificar y corregir:

1. **En la consola de AWS, ve a EC2 → Instancias**
2. **Selecciona la instancia Ubuntu (ec2-54-193-218-76)**
3. **Ve a la pestaña "Seguridad"**
4. **Haz clic en el Security Group (sg-xxxxx)**
5. **En "Reglas de entrada", verifica:**

### Regla SSH requerida:
- **Tipo:** SSH
- **Protocolo:** TCP
- **Puerto:** 22
- **Origen:** 
  - Opción 1 (Recomendado para pruebas): `0.0.0.0/0` (permite desde cualquier IP)
  - Opción 2 (Más seguro): Tu IP pública `38.224.149.8/32`

6. **Si no existe la regla, haz clic en "Editar reglas de entrada" y agrega:**
   - Tipo: SSH
   - Puerto: 22
   - Origen: `0.0.0.0/0` (temporal para pruebas)

7. **Guarda los cambios**

## Verificación adicional:

- Asegúrate de que la instancia esté en estado "En ejecución" (no "Iniciando")
- Espera 2-3 minutos después de iniciar la instancia para que SSH esté listo
- Verifica que la clave PEM sea la correcta para esta instancia

## IP Pública detectada:
Tu IP pública es: **38.224.149.8**

Si quieres ser más específico, agrega esta IP al Security Group en lugar de 0.0.0.0/0

