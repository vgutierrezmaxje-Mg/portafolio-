var CODE_01_BDB = `
CREATE DATABASE FarmaciaBD1;

/*CREACION DE TABLAS AUXILIARES*/

CREATE TABLE EstadoEmpleado (
    idEstadoEmpleado INT PRIMARY KEY,
    descripcion VARCHAR(20)
);

CREATE TABLE TipoMovimiento (
    idTipoMovimiento INT PRIMARY KEY,
    descripcion VARCHAR(30)
);

CREATE TABLE Tipo_Pago (
    idTipoPago INT PRIMARY KEY,
    descripcion VARCHAR(50)
);

CREATE TABLE Categorias (
    idCategorias INT PRIMARY KEY,
    nombreCategoria VARCHAR(50),
    descripcion VARCHAR(100)
);

/*CREACION TABLAS PRINCIPALES*/

/*CREACION TABLA CLIENTES*/
CREATE TABLE Clientes (
    idCliente INT PRIMARY KEY,
    nombre VARCHAR(50),
    apellidos VARCHAR(50),
    DNI CHAR(8) CHECK (DNI LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'), /*exactamente 8 dígitos*/
    direccion VARCHAR(100),
    correoElectronico VARCHAR(100),
    telefono VARCHAR(15),
    fecha_Nacimiento DATE,
    CHECK (correoElectronico LIKE '%@%.%') /*validación simple de correo*/
);

/* agregar check nuevo para clientes*/
ALTER TABLE Clientes
ADD CONSTRAINT chk_nombre_no_vacio CHECK (nombre <> '');

ALTER TABLE Clientes
ADD CONSTRAINT chk_apellidos_no_vacio CHECK (apellidos <> '');

ALTER TABLE Clientes
ADD CONSTRAINT chk_telefono_Clientes_numerico CHECK (
  telefono LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]');

/*Modificacion de columnas*/
ALTER TABLE Clientes
ALTER COLUMN nombre VARCHAR(50) NOT NULL;

ALTER TABLE Clientes
ALTER COLUMN apellidos VARCHAR(50) NOT NULL;

/*CREACION TABLA EMPLEADOS*/

CREATE TABLE Empleados (
    idEmpleado INT PRIMARY KEY,
    idEstadoEmpleado INT DEFAULT 1, /*Activo por defecto*/
    nombre VARCHAR(50),
    apellidos VARCHAR(70),
    DNI CHAR(8) CHECK (DNI LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'), /*exactamente 8 dígitos*/
    cargo VARCHAR(30),
    telefono VARCHAR(15),
    direccion VARCHAR(100),
    correoElectronico VARCHAR(100) CHECK (correoElectronico LIKE '%@%.%'),
    fecha_Nacimiento DATE,
    FOREIGN KEY (idEstadoEmpleado) REFERENCES EstadoEmpleado(idEstadoEmpleado)
);

/*Agregar check para empleados*/

ALTER TABLE Empleados
ADD CONSTRAINT chk_nombre_empleado_no_vacio CHECK (nombre <> '');

ALTER TABLE Empleados
ADD CONSTRAINT chk_apellidos_empleado_no_vacio CHECK (apellidos <> '');

ALTER TABLE Empleados
ADD CONSTRAINT chek_cargo_empleado_no_vacio CHECK (cargo <> '');

ALTER TABLE Empleados
ADD CONSTRAINT telefono_empleado_dentro_rango CHECK (LEN(telefono) = 9);

ALTER TABLE Empleados
ADD CONSTRAINT chk_direccion_empleado_no_vacio CHECK (direccion <> '');

ALTER TABLE Empleados
ADD CONSTRAINT chk_estado_empleado_dentro_rango CHECK (idEstadoEmpleado BETWEEN 1 AND 5);

ALTER TABLE Empleados
ADD CONSTRAINT chk_telefono_empleado_numerico CHECK (
  telefono LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
);

/*Modificacion de columnas*/

ALTER TABLE Empleados
ALTER COLUMN nombre VARCHAR(50) NOT NULL;

ALTER TABLE Empleados
ALTER COLUMN apellidos VARCHAR(70) NOT NULL;

ALTER TABLE Empleados
ALTER COLUMN DNI CHAR(8) NOT NULL;

/*CREACIÓN TABLA PROVEEDORES*/
CREATE TABLE Proveedores (
    idProveedor INT PRIMARY KEY,
    RUC CHAR(11),
    razonSocialProveedor VARCHAR(100),
    contacto VARCHAR(100),
    cargoProveedor VARCHAR(50),
    telefono VARCHAR(15),
    direccion VARCHAR(100),
    correoProveedor VARCHAR(100)
);

/*Agregar check Proveedores*/
ALTER TABLE Proveedores
ADD CONSTRAINT chk_razon_social_no_vacio CHECK (razonSocialProveedor <> '');

ALTER TABLE Proveedores
ADD CONSTRAINT chk_contacto_no_vacio CHECK (contacto <> '');

ALTER TABLE Proveedores
ADD CONSTRAINT chk_cargoProveedor_no_vacio CHECK (cargoProveedor <> '');

ALTER TABLE Proveedores
ADD CONSTRAINT chk_direccion_no_vacio CHECK (direccion <> '');

ALTER TABLE Proveedores
ADD CONSTRAINT chk_correo_no_vacio CHECK (correoProveedor LIKE '%@%.%');

ALTER TABLE Proveedores
ADD CONSTRAINT chk_telefono_Proveedores_numerico CHECK ( telefono LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]');

ALTER TABLE Proveedores
ADD CONSTRAINT chk_RUC_Proveedores_numerico CHECK ( RUC LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]');

/*Modificacion de columnas*/

ALTER TABLE Proveedores
ALTER COLUMN RUC CHAR(11) NOT NULL;

ALTER TABLE Proveedores
ALTER COLUMN razonSocialProveedor VARCHAR(100) NOT NULL;

/*CREACION DE TABLA PRODUCTOS*/
CREATE TABLE Productos (
    idProducto INT PRIMARY KEY,
    idProveedor INT,
    idCategoria INT,
    nombreProducto VARCHAR(100),
    nombreGenerico VARCHAR(100),
    fabricante VARCHAR(100),
    concentracion VARCHAR(50),
    formaFarmaceutica VARCHAR(50),
    cantidadPorUnidad INT,
    precioVenta DECIMAL(10,2) CHECK (precioVenta > 0),
    requiereReceta BIT DEFAULT 0,
    nivelReorden INT CHECK (nivelReorden >= 0),
    suspension INT DEFAULT 0,
    FOREIGN KEY (idProveedor) REFERENCES Proveedores(idProveedor),
    FOREIGN KEY (idCategoria) REFERENCES Categorias(idCategorias)
);

/*Agregar check Producto*/

ALTER TABLE Productos
ADD CONSTRAINT chk_id_categoria_dentro_rango CHECK (idCategoria BETWEEN 1 AND 5);

ALTER TABLE Productos
ADD CONSTRAINT chk_nombre_Producto_no_vacio CHECK (nombreProducto <> '');

ALTER TABLE Productos
ADD CONSTRAINT chk_nombre_Generico_no_vacio CHECK (nombreGenerico <> '');

ALTER TABLE Productos
ADD CONSTRAINT chk_fabricante_no_vacio CHECK (fabricante <> ''); 

ALTER TABLE Productos
ADD CONSTRAINT chk_concentracion_no_vacio CHECK (concentracion <> '');

ALTER TABLE Productos
ADD CONSTRAINT chk_formaFarmaceutica_no_vacio CHECK (formaFarmaceutica <> '');

/*Modificacion de columnas*/

ALTER TABLE Productos
ALTER COLUMN fabricante VARCHAR(100) NOT NULL;


/*CREACION TABLA LOTE PRODUCTO*/
CREATE TABLE LoteProducto (
    idLoteProducto INT PRIMARY KEY,
    idProducto INT FOREIGN KEY REFERENCES Productos(idProducto),
    cantidad INT CHECK (cantidad >= 0),
    fechaIngreso DATE,
    fechaVencimiento DATE,
	CHECK (fechaVencimiento > fechaIngreso)
);

/*Modificacion de columnas*/ 
ALTER TABLE LoteProducto
ALTER COLUMN fechaIngreso DATE NOT NULL;

/*CREACION TABLA MOVIMIENTO INVENTARIO */
CREATE TABLE MovimientoInventario (
    idMovimiento INT PRIMARY KEY,
    idProducto INT FOREIGN KEY REFERENCES Productos(idProducto),
    idTipoMovimiento INT FOREIGN KEY REFERENCES TipoMovimiento(idTipoMovimiento),
    cantidad INT CHECK (cantidad > 0),
    fechaMovimiento DATE DEFAULT GETDATE(),
    numeroDocumentoOrigen VARCHAR(50)
);
/*Modificacion de columnas*/
ALTER TABLE MovimientoInventario
ADD idEmpleado INT;

/*Agregar Restricciones*/ 

ALTER TABLE MovimientoInventario
ADD CONSTRAINT FK_MovimientoInventario_Empleado
FOREIGN KEY (idEmpleado) REFERENCES Empleados(idEmpleado);

/*CREACION TABLA RECETAS MEDICAS*/
 CREATE TABLE RecetasMedicas (
    idReceta INT PRIMARY KEY,
    fechaEmision DATE DEFAULT GETDATE(),
    nombrePaciente VARCHAR(100),
    DNI CHAR(8) CHECK (DNI LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    nombreMedico VARCHAR(100),
    observacion VARCHAR (225)
);

/*Agregar check Receta Medica*/

ALTER TABLE RecetasMedicas
ADD CONSTRAINT chk_Recetas_Medicas_no_vacio CHECK (nombrePaciente <> '');

ALTER TABLE RecetasMedicas
ADD CONSTRAINT chk_nombre_medico_no_vacio CHECK (nombreMedico <> '');

ALTER TABLE RecetasMedicas
ADD CONSTRAINT chk_obervacion_no_vacio CHECK (observacion <> '');

/*CREACION DE TABLA VENTA*/
CREATE TABLE Ventas (
    idVenta INT PRIMARY KEY,
    idCliente INT,
    idEmpleado INT,
    idTipoPago INT,
    idReceta INT NULL, 
    fechaHoraVenta DATETIME DEFAULT GETDATE(),
    igv DECIMAL(10,2) CHECK (igv >= 0),
    montoTotal DECIMAL(10,2) CHECK (montoTotal >= 0),
    FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente),
    FOREIGN KEY (idEmpleado) REFERENCES Empleados(idEmpleado),
    FOREIGN KEY (idTipoPago) REFERENCES Tipo_Pago(idTipoPago),
    FOREIGN KEY (idReceta) REFERENCES RecetasMedicas(idReceta)
);
/*Agregar check ventas */

ALTER TABLE Ventas
ADD CONSTRAINT chk_id_Tipo_Pago_Dentro_Rango CHECK (idTipoPago BETWEEN 1 AND 5);

/*CREACION TABLA DETALLE VENTA*/
CREATE TABLE DetalleVenta (
    idDetalleVenta INT PRIMARY KEY,
    idVenta INT,
    idLoteProducto INT,
    cantidad INT CHECK (cantidad > 0),
    precioUnitario DECIMAL(10,2) CHECK (precioUnitario >= 0),

	/*calculo para tener el subtotal*/
    subTotal AS (cantidad * precioUnitario) PERSISTED, -- Atributo derivado calculado

    FOREIGN KEY (idVenta) REFERENCES Ventas(idVenta),
    FOREIGN KEY (idLoteProducto) REFERENCES LoteProducto(idLoteProducto)
);



/*INGRESAR DATOS A LAS TABLAS AUXILIARES*/

INSERT INTO EstadoEmpleado (idEstadoEmpleado, descripcion) VALUES
(1, 'Activo'),
(2, 'Inactivo'),
(3, 'Vacaciones'),
(4, 'Licencia'),
(5, 'Despedido');

INSERT INTO TipoMovimiento (idTipoMovimiento, descripcion) VALUES
(1, 'Ingreso por compra'),
(2, 'Ingreso por devolución'),
(3, 'Salida por venta'),
(4, 'Salida por vencimiento'),
(5, 'Ajuste de inventario');

INSERT INTO Tipo_Pago (idTipoPago, descripcion) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta de crédito'),
(3, 'Tarjeta de débito'),
(4, 'Transferencia'),
(5, 'Yape/Plin');

INSERT INTO Categorias (idCategorias, nombreCategoria, descripcion) VALUES
(1, 'Analgésicos', 'Medicamentos para aliviar el dolor'),
(2, 'Antibióticos', 'Medicamentos para tratar infecciones'),
(3, 'Antiinflamatorios', 'Reducen la inflamación'),
(4, 'Antigripales', 'Tratamiento para síntomas de la gripe'),
(5, 'Vitaminas', 'Suplementos nutricionales');

/*INGRESAR DATOS EN LAS TABLAS PRINCIPALES*/

/*TABLA CLIENTES*/

INSERT INTO Clientes (idCliente, nombre, apellidos, DNI, direccion, correoElectronico, telefono, fecha_Nacimiento) VALUES
(1, 'Carlos', 'Ramírez Torres', '74839201', 'Av. Perú 123', 'carlos.ramirez@gmail.com', '987654321', '1990-06-15'),
(2, 'Ana', 'García López', '73849123', 'Jr. Los Álamos 456', 'ana.garcia@yahoo.com', '912345678', '1988-11-03'),
(3, 'Luis', 'Mendoza Ruiz', '75892341', 'Calle Lima 789', 'luis.mendoza@outlook.com', '956789012', '1992-03-22'),
(4, 'Sofía', 'Martínez Vega', '76981234', 'Av. Grau 234', 'sofia.martinez@gmail.com', '934567890', '1995-08-12'),
(5, 'Javier', 'Silva Paredes', '77890123', 'Jr. Ayacucho 345', 'javier.silva@hotmail.com', '987123456', '1985-01-19'),
(6, 'Lucía', 'Quispe Huamán', '78901234', 'Pasaje Olmos 123', 'lucia.quispe@gmail.com', '923456789', '1994-04-28'),
(7, 'Andrés', 'Pérez Gómez', '79812345', 'Av. El Sol 456', 'andres.perez@hotmail.com', '965432198', '1987-07-30'),
(8, 'Daniela', 'Cruz Ríos', '80123456', 'Calle La Mar 678', 'daniela.cruz@outlook.com', '976543219', '1996-12-07'),
(9, 'Mario', 'Campos León', '81234567', 'Jr. Junín 234', 'mario.campos@gmail.com', '987612345', '1993-09-14'),
(10, 'Paula', 'Aguilar Núñez', '82345678', 'Av. Salaverry 789', 'paula.aguilar@yahoo.com', '921234567', '1991-02-11');

INSERT INTO Clientes (idCliente, nombre, apellidos, DNI, direccion, correoElectronico, telefono, fecha_Nacimiento) VALUES
(11, 'Tatiana', 'Moreno Salas', '83124567', 'Av. Grau 123', 'tatiana.moreno@gmail.com', '987111222', '1990-05-12'),
(12, 'Ricardo', 'Vallejo Rivas', '84235678', 'Jr. Huascar 456', 'ricardo.vallejo@hotmail.com', '912345123', '1985-08-20'),
(13, 'Paola', 'Díaz Ramírez', '85346789', 'Pasaje Lima 789', 'paola.diaz@gmail.com', '923456456', '1992-02-10'),
(14, 'Jorge', 'Huamán Castillo', '86457890', 'Av. Túpac Amaru 321', 'jorge.huaman@gmail.com', '934567789', '1988-03-03'),
(15, 'Daniel', 'Gómez Lázaro', '87568901', 'Calle Cusco 456', 'daniel.gomez@yahoo.com', '945678912', '1993-10-18');
/*TABLA EMPLEADOS*/

INSERT INTO Empleados (idEmpleado, nombre, apellidos, DNI, cargo, telefono, direccion, correoElectronico, fecha_Nacimiento) VALUES
(1, 'Miguel', 'Vásquez Soto', '70123456', 'Farmacéutico', '999111222', 'Av. Bolívar 321', 'miguel.vasquez@farmacia.com', '1980-05-21'),
(2, 'Karen', 'Zapata Rojas', '71234567', 'Técnico', '988123456', 'Calle Bolognesi 654', 'karen.zapata@farmacia.com', '1989-09-15'),
(3, 'Eduardo', 'Salas Peña', '72345678', 'Administrador', '977321654', 'Jr. Sucre 987', 'eduardo.salas@farmacia.com', '1975-03-10'),
(4, 'Mariela', 'López Cisneros', '73456789', 'Cajera', '912345678', 'Av. San Martín 456', 'mariela.lopez@farmacia.com', '1993-10-05'),
(5, 'Julio', 'Reyes Palacios', '74567890', 'Almacenero', '934567890', 'Calle Piura 321', 'julio.reyes@farmacia.com', '1987-12-22');

INSERT INTO Empleados (idEmpleado, idEstadoEmpleado, nombre, apellidos, DNI, cargo, telefono, direccion, correoElectronico, fecha_Nacimiento) VALUES
(6, 2, 'Diana', 'Morales Aguirre', '75678901', 'Farmacéutica', '956789012', 'Av. Arequipa 123', 'diana.morales@farmacia.com', '1986-06-30'),
(7, 3, 'Óscar', 'Navarro Ruiz', '76789012', 'Técnico', '943216789', 'Jr. Ancash 456', 'oscar.navarro@farmacia.com', '1990-01-10'),
(8, 4, 'Lorena', 'Fernández Chira', '77890123', 'Cajera', '987123654', 'Calle Amazonas 789', 'lorena.fernandez@farmacia.com', '1994-04-02'),
(9, 1, 'Henry', 'Ortiz Sosa', '78901234', 'Almacenero', '923456789', 'Av. Colonial 987', 'henry.ortiz@farmacia.com', '1988-07-18'),
(10, 5, 'Verónica', 'Salinas Meza', '79012345', 'Farmacéutica', '965432189', 'Jr. Loreto 321', 'veronica.salinas@farmacia.com', '1992-11-29');

INSERT INTO Empleados (idEmpleado, idEstadoEmpleado, nombre, apellidos, DNI, cargo, telefono, direccion, correoElectronico, fecha_Nacimiento) VALUES
(11, 1, 'Estefanía', 'Paredes Silva', '80123457', 'Técnico', '987654111', 'Av. Bolívar 456', 'estefania.paredes@botica.com', '1991-06-24'),
(12, 1, 'Renato', 'López Granda', '81234568', 'Farmacéutico', '998877665', 'Jr. Ayacucho 789', 'renato.lopez@botica.com', '1987-04-12'),
(13, 1, 'Valeria', 'Cruz Mendoza', '82345679', 'Cajera', '933221100', 'Calle Moquegua 234', 'valeria.cruz@botica.com', '1995-09-14');

/*TABLA PROVEEDORES*/

INSERT INTO Proveedores (idProveedor, RUC, razonSocialProveedor, contacto, cargoProveedor, telefono, direccion, correoProveedor) VALUES
(1, '20481234567', 'Laboratorios Medix S.A.', 'Carlos Torres', 'Gerente Comercial', '987654321', 'Av. México 456', 'contacto@medix.com'),
(2, '20591234568', 'Química Universal S.A.', 'Ana Ríos', 'Jefa de Ventas', '976543219', 'Calle Venezuela 123', 'ventas@quimicauniversal.com'),
(3, '20671234569', 'Distribuidora PharmaNet S.R.L.', 'Luis Gómez', 'Supervisor de cuentas', '965432198', 'Jr. Cajamarca 321', 'lgomez@pharmanet.com'),
(4, '20781234570', 'Laboratorios Genéricos Andinos', 'María López', 'Asistente Comercial', '912345678', 'Av. La Marina 654', 'maria.lopez@andinos.com'),
(5, '20891234571', 'Insumos Médicos Perú', 'Fernando Vega', 'Gerente General', '943216789', 'Calle Cusco 789', 'f.vega@insumed.pe'),
(6, '20901234572', 'FarmaDistribución S.A.C.', 'Patricia Salazar', 'Ejecutiva de Cuentas', '934567890', 'Av. Brasil 111', 'psalazar@farmadistribucion.pe'),
(7, '21011234573', 'Laboratorios VitaFarma', 'José Paredes', 'Representante Técnico', '956789012', 'Jr. Moquegua 567', 'jparedes@vitafarma.com'),
(8, '21121234574', 'Medimport S.A.', 'Sandra Gómez', 'Coordinadora de Ventas', '987123654', 'Calle Tacna 456', 's.gomez@medimport.com'),
(9, '21231234575', 'BioSalud Distribuciones', 'César Castro', 'Agente de ventas', '923456789', 'Av. Aviación 789', 'cesar.castro@biosalud.com'),
(10, '21341234576', 'Química Sanidad S.A.C.', 'Martha Ruiz', 'Encargada Comercial', '965432198', 'Jr. Huánuco 321', 'mruiz@sanidad.pe');


/*TABLA PRODUCTOS*/

INSERT INTO Productos (
    idProducto, idProveedor, idCategoria, nombreProducto, nombreGenerico,
    fabricante, concentracion, formaFarmaceutica, cantidadPorUnidad,
    precioVenta, requiereReceta, nivelReorden, suspension
) VALUES
(1, 1, 1, 'Paracetamol 500mg', 'Paracetamol', 'Medix', '500 mg', 'Tableta', 10, 2.50, 0, 20, 0),
(2, 2, 2, 'Amoxicilina 500mg', 'Amoxicillin', 'Química Universal', '500 mg', 'Cápsula', 20, 5.00, 1, 15, 0),
(3, 3, 3, 'Ibuprofeno 400mg', 'Ibuprofen', 'PharmaNet', '400 mg', 'Tableta', 12, 3.50, 0, 25, 0),
(4, 4, 4, 'Tabcin Noche', 'Paracetamol + Fenilefrina', 'Andinos', 'Dosis combinada', 'Tableta', 16, 6.90, 0, 10, 0),
(5, 5, 5, 'Vitamina C 1000mg', 'Ácido ascórbico', 'Insumos Médicos Perú', '1000 mg', 'Tableta efervescente', 10, 4.20, 0, 30, 0),
(6, 1, 2, 'Ciprofloxacino 500mg', 'Ciprofloxacin', 'Medix', '500 mg', 'Cápsula', 14, 8.00, 1, 10, 0),
(7, 2, 1, 'Naproxeno 250mg', 'Naproxen', 'Química Universal', '250 mg', 'Tableta', 12, 3.00, 0, 20, 0),
(8, 3, 3, 'Diclofenaco 75mg', 'Diclofenac', 'PharmaNet', '75 mg', 'Inyectable', 1, 5.80, 1, 8, 0),
(9, 4, 5, 'Multivitamínico ABC', 'Complejo multivitamínico', 'Andinos', 'Mixto', 'Cápsula blanda', 30, 10.50, 0, 25, 0),
(10, 5, 4, 'Antigripal Forte', 'Paracetamol + Loratadina', 'Insumos Médicos Perú', 'Dosis combinada', 'Jarabe', 120, 7.90, 0, 12, 0);

/*LOTE PRODUCTO*/

INSERT INTO LoteProducto (
    idLoteProducto, idProducto, cantidad, fechaIngreso, fechaVencimiento
) VALUES
(1, 1, 100, '2024-06-01', '2026-06-01'),
(2, 2, 80, '2024-06-10', '2025-06-10'),
(3, 3, 120, '2024-05-20', '2025-11-20'),
(4, 4, 60, '2024-07-01', '2026-01-01'),
(5, 5, 200, '2024-06-15', '2025-12-15'),
(6, 6, 90, '2024-04-01', '2025-04-01'),
(7, 7, 75, '2024-05-05', '2025-10-05'),
(8, 8, 40, '2024-06-20', '2025-08-20'),
(9, 9, 150, '2024-07-05', '2026-01-05'),
(10, 10, 110, '2024-06-25', '2025-12-25');

INSERT INTO LoteProducto (idLoteProducto, idProducto, cantidad, fechaIngreso, fechaVencimiento)
VALUES 
(11, 1, 25, '2024-05-20', '2025-12-31'),
(12, 2, 18, '2024-06-01', '2025-11-30'),
(13, 3, 12, '2024-06-10', '2025-09-15'),
(14, 4, 30, '2024-07-01', '2026-01-15'),
(15, 5, 50, '2024-07-05', '2026-02-01');

/*MOVIMIENTO DE INVENTARIO */

INSERT INTO MovimientoInventario (
    idMovimiento, idProducto, idTipoMovimiento, cantidad, fechaMovimiento, numeroDocumentoOrigen
) VALUES
(1, 1, 1, 50, '2024-06-01', 'FAC001'),
(2, 2, 1, 30, '2024-06-02', 'FAC002'),
(3, 3, 2, 20, '2024-06-03', 'DEV001'),
(4, 4, 3, 10, '2024-06-04', 'VEN001'),
(5, 5, 4, 5, '2024-06-05', 'VEN002'),
(6, 6, 5, 15, '2024-06-06', 'AJU001'),
(7, 7, 1, 60, '2024-06-07', 'FAC003'),
(8, 8, 3, 8, '2024-06-08', 'VEN003'),
(9, 9, 2, 12, '2024-06-09', 'DEV002'),
(10, 10, 4, 3, '2024-06-10', 'VEN004');

INSERT INTO MovimientoInventario (idMovimiento, idProducto, idTipoMovimiento, cantidad, fechaMovimiento, numeroDocumentoOrigen, idEmpleado)
VALUES (16, 1, 3, 10, '2024-07-14', 'VEN100', 11);

/*VINCULAR EMPLEADO CON MOVIMIENTO DE INVENTARIO*/

UPDATE MovimientoInventario SET id = 1 WHERE idMovimiento = 1;
UPDATE MovimientoInventario SET idEmpleado = 1 WHERE idMovimiento = 2;
UPDATE MovimientoInventario SET idEmpleado = 1 WHERE idMovimiento = 3;

UPDATE MovimientoInventario SET idEmpleado = 2 WHERE idMovimiento = 4;
UPDATE MovimientoInventario SET idEmpleado = 2 WHERE idMovimiento = 5;
UPDATE MovimientoInventario SET idEmpleado = 2 WHERE idMovimiento = 6;

UPDATE MovimientoInventario SET idEmpleado = 3 WHERE idMovimiento = 7;
UPDATE MovimientoInventario SET idEmpleado = 3 WHERE idMovimiento = 8;
UPDATE MovimientoInventario SET idEmpleado = 3 WHERE idMovimiento = 9;
UPDATE MovimientoInventario SET idEmpleado = 3 WHERE idMovimiento = 10;


/*RECETA MEDICA */
INSERT INTO RecetasMedicas (
    idReceta, nombrePaciente, DNI, nombreMedico, observacion
) VALUES
(1, 'Carlos Paredes', '75213467', 'Dr. Juan Salazar', 'Tomar cada 8 horas por 7 días'),
(2, 'Lucía Mendoza', '84930215', 'Dra. María Castillo', 'Aplicar tópico una vez al día'),
(3, 'Pedro Torres', '73829106', 'Dr. Jorge Ramos', 'No consumir alcohol durante el tratamiento'),
(4, 'Andrea Díaz', '71023984', 'Dra. Carmen Ruiz', 'Control dentro de 5 días'),
(5, 'Luis García', '79811234', 'Dr. José Pérez', 'Dosis ajustada a peso del paciente'),
(6, 'Marta Herrera', '71236589', 'Dr. Alfredo Núñez', 'Requiere reevaluación en 1 semana'),
(7, 'Javier Rojas', '74586921', 'Dra. Laura Quintana', 'Tratamiento por 10 días'),
(8, 'Sofía Vilchez', '76458290', 'Dr. Francisco Poma', 'Requiere descanso de 2 días'),
(9, 'Esteban Flores', '73014562', 'Dr. Hugo Tello', 'Combinar con dieta blanda'),
(10, 'Natalia Ramírez', '72136985', 'Dra. Milagros Gutiérrez', 'Evitar exposición solar directa');

/*VENTAS*/

INSERT INTO Ventas (
    idVenta, idCliente, idEmpleado, idTipoPago, idReceta, igv, montoTotal
) VALUES
(1, 1, 1, 1, 1, 12.60, 82.60),
(2, 2, 2, 2, NULL, 7.20, 47.20),
(3, 3, 3, 3, 2, 10.80, 70.80),
(4, 4, 4, 1, 3, 5.00, 35.00),
(5, 5, 5, 4, NULL, 9.00, 59.00),
(6, 6, 6, 2, 4, 14.40, 94.40),
(7, 7, 7, 3, 5, 6.30, 41.30),
(8, 8, 8, 5, NULL, 8.10, 53.10),
(9, 9, 9, 1, 6, 11.70, 76.70),
(10, 10, 10, 2, 7, 13.50, 88.50);

INSERT INTO Ventas (idVenta, idCliente, idEmpleado, idTipoPago, fechaHoraVenta, igv, montoTotal)
VALUES 
(11, 11, 11, 1, '2024-06-05 10:00:00', 10.00, 60.00),
(12, 12, 12, 2, '2024-06-08 15:30:00', 8.00, 48.00),
(13, 13, 13, 3, '2024-07-01 09:15:00', 9.50, 59.50),
(14, 14, 11, 5, '2024-07-04 18:45:00', 7.20, 42.20),
(15, 15, 12, 1, '2024-07-10 13:10:00', 12.00, 72.00);

/*DETALLE VENTA*/

INSERT INTO DetalleVenta (
    idDetalleVenta, idVenta, idLoteProducto, cantidad, precioUnitario
) VALUES
(1, 1, 1, 2, 35.00),
(2, 2, 2, 1, 40.00),
(3, 3, 3, 2, 30.00),
(4, 4, 4, 1, 25.00),
(5, 5, 5, 3, 15.00),
(6, 6, 6, 2, 40.00),
(7, 7, 7, 1, 35.00),
(8, 8, 8, 2, 20.00),
(9, 9, 9, 1, 65.00),
(10, 10, 10, 2, 35.00);

INSERT INTO DetalleVenta (idDetalleVenta, idVenta, idLoteProducto, cantidad, precioUnitario)
VALUES 
(11, 11, 11, 2, 25.00),
(12, 12, 12, 1, 40.00),
(13, 13, 13, 3, 15.00),
(14, 14, 14, 2, 18.00),
(15, 15, 15, 2, 30.00);

`;