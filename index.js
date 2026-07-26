const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL (XAMPP usa por defecto usuario 'root' y sin contraseña)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_ventas'
});

db.connect(err => {
    if (err) console.error('Error conectando a MySQL:', err);
    else console.log('✅ Conectado a MySQL con éxito');
});

// --- CLIENTES ---
app.get('/clientes', (req, res) => { db.query('SELECT * FROM clientes', (e, r) => res.json(r)); });
app.post('/clientes', (req, res) => {
    const { nombre, email, telefono } = req.body;
    db.query('INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)', [nombre, email, telefono], (e, r) => res.json({ id: r?.insertId, nombre, email, telefono }));
});
app.put('/clientes/:id', (req, res) => {
    const { nombre, email, telefono } = req.body;
    db.query('UPDATE clientes SET nombre=?, email=?, telefono=? WHERE id=?', [nombre, email, telefono, req.params.id], () => res.json({ message: 'OK' }));
});
app.delete('/clientes/:id', (req, res) => { db.query('DELETE FROM clientes WHERE id=?', [req.params.id], () => res.json({ message: 'OK' })); });

// --- PRODUCTOS ---
app.get('/productos', (req, res) => { db.query('SELECT * FROM productos', (e, r) => res.json(r)); });
app.post('/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', [nombre, precio, stock], (e, r) => res.json({ id: r?.insertId, nombre, precio, stock }));
});
app.put('/productos/:id', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query('UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?', [nombre, precio, stock, req.params.id], () => res.json({ message: 'OK' }));
});
app.delete('/productos/:id', (req, res) => { db.query('DELETE FROM productos WHERE id=?', [req.params.id], () => res.json({ message: 'OK' })); });

// --- FACTURAS ---
app.get('/facturas', (req, res) => { db.query('SELECT * FROM facturas', (e, r) => res.json(r)); });
app.post('/facturas', (req, res) => {
    const { cliente_id, total } = req.body;
    db.query('INSERT INTO facturas (cliente_id, total) VALUES (?, ?)', [cliente_id, total], (e, r) => res.json({ id: r?.insertId, cliente_id, total }));
});
app.delete('/facturas/:id', (req, res) => { db.query('DELETE FROM facturas WHERE id=?', [req.params.id], () => res.json({ message: 'OK' })); });

// --- DETALLES ---
app.get('/detalles/:factura_id', (req, res) => { db.query('SELECT * FROM detalle_factura WHERE factura_id=?', [req.params.factura_id], (e, r) => res.json(r)); });
app.post('/detalles', (req, res) => {
    const { factura_id, producto_id, cantidad, precio_unitario } = req.body;
    db.query('INSERT INTO detalle_factura (factura_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [factura_id, producto_id, cantidad, precio_unitario], (e, r) => res.json({ id: r?.insertId }));
});
app.delete('/detalles/:id', (req, res) => { db.query('DELETE FROM detalle_factura WHERE id=?', [req.params.id], () => res.json({ message: 'OK' })); });

// Iniciar servidor
app.listen(3000, '0.0.0.0', () => { console.log('🚀 Servidor corriendo en el puerto 3000'); });