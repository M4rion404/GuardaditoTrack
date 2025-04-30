import React, { useState } from 'react';
import axios from 'axios';

function RegistroUsuario() {
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    numero_telefono: '',
    monto_inicial: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/usuarios', formData);
      alert('Usuario registrado correctamente');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Error al registrar usuario');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input 
          name="email" 
          type="email" 
          placeholder="Correo" 
          onChange={handleChange} 
          value={formData.email} 
          required
        />
        <input name="contraseña" type="password" placeholder="Contraseña" onChange={handleChange} value={formData.contraseña} required />
        <input name="nombres" type="text" placeholder="Nombres" onChange={handleChange} value={formData.nombres} required />
        <input name="apellido_paterno" type="text" placeholder="Apellido Paterno" onChange={handleChange} value={formData.apellido_paterno} required />
        <input name="apellido_materno" type="text" placeholder="Apellido Materno" onChange={handleChange} value={formData.apellido_materno} required />
        <input name="numero_telefono" type="text" placeholder="Teléfono" onChange={handleChange} value={formData.numero_telefono} required />
        <input name="monto_inicial" type="text" placeholder="Monto Inicial" onChange={handleChange} value={formData.monto_inicial} required />
        <button type="submit" style={{ background: '#4CAF50', color: 'white', padding: '10px', width: '100%' }}>Registrar</button>
      </form>
    </div>
  );
}

export default RegistroUsuario;
