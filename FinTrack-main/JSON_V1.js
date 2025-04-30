{
	Usuarios: {

		id_usuario: ID,
		email: string,
		contraseña: BCrypt,
		nombres: string,
		apellido_paterno: string,
		apellido_materno: string,
		numero_telefono: string,
		monto_inicial: float,
		notificacion: boolean,
		
		tipo_divisa: [
			{
				"divisa": "MXN",
				"nombre": "Peso Mexicano",
			},
			{
				"divisa": "USD",
				"nombre": "Dolar Americano",
			}
		], //MXN y USD

		Categorias: [
				{			
					Id_Categoria: ID,
					Titulo: "string",
					Descripcion: "string",
				},
				{...}
		],

		Presupuestos: [
			{
				id_presupuesto: ID,
				titulo: "string",
				descripcion: "string",
				monto_limite: float,
				monto_gastado: float,
				categoria_asociada: ID, 
				fecha_creacion: Date,
			},
			{...}
		],

		Transacciones: [
			{
				id_transaccion: ID,
				titulo: "string",
				descripcion: "string"
				accion: "Ingreso/Retiro",
				metodo_pago: string,
				monto: float,
				estado: string, // En proceso, completado, cancelado
				fecha: Date,
			},
			{...} 
		]

		Movimientos:[{
			id_movimiento: ID,
			motivo: string,
			metodo_pago: string,
			accion: "Ingreso/Retiro",
			monto_original: float,
			monto_actualizado: float,
			fecha: Date,
		}, {...}]

	} 
} // Usuarios


					