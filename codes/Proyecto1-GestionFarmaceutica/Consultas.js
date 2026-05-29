var CODE_01_CS = `
/*CONSULTA 01

Mostrar el nombre del cliente, el ID de la venta, la fecha y hora de la venta,
la cantidad vendida, el precio unitario aplicado, el subtotal calculado,
y el nombre comercial del producto.
Filtra por un cliente específico y un ID de venta concreto.*/

SELECT 
    C.nombre + ' ' + C.apellidos AS nombreCliente,
    V.idVenta,
    V.fechaHoraVenta,
    DV.cantidad,
    DV.precioUnitario,
    DV.subTotal,
    P.nombreProducto,
	E.nombre + ' ' + E.apellidos AS nombreEmpleado

FROM Ventas V
INNER JOIN Clientes C ON V.idCliente = C.idCliente
INNER JOIN DetalleVenta DV ON V.idVenta = DV.idVenta
INNER JOIN LoteProducto LP ON DV.idLoteProducto = LP.idLoteProducto
INNER JOIN Productos P ON LP.idProducto = P.idProducto
INNER JOIN Empleados E ON V.idEmpleado = E.idEmpleado
WHERE C.idCliente = 1 AND V.idVenta = 1;  -- Puedes cambiar estos valores


/*CONSULTA 02*/
/*Productos con precio mayor a 5.00: nombre del producto, fecha de ingreso y proveedor.*/
SELECT p.nombreProducto, lp.fechaIngreso, pr.razonSocialProveedor, precioVenta AS PRECIO

FROM Productos p
INNER JOIN LoteProducto lp ON p.idProducto = lp.idProducto
INNER JOIN Proveedores pr ON p.idProveedor = pr.idProveedor
WHERE p.precioVenta > 5.00;

/* CONSULTA 03
Empleado que realizó la venta de mayor monto.*/

SELECT e.nombre + ' '+ e.apellidos AS EMPLEADO , e.cargo , v.montoTotal
FROM Empleados e
INNER JOIN Ventas v ON e.idEmpleado = v.idEmpleado
WHERE v.montoTotal = (
    SELECT MAX(montoTotal) FROM Ventas
);

/*CONSULTA 04
Ventas con tipo de pago 'Efectivo': idVenta, cliente, fecha.*/

SELECT v.idVenta, c.nombre, v.fechaHoraVenta,tp.descripcion AS TIPO_PAGO
FROM Ventas v
INNER JOIN Clientes c ON v.idCliente = c.idCliente
INNER JOIN Tipo_Pago tp ON v.idTipoPago = tp.idTipoPago
WHERE tp.descripcion = 'Efectivo';


/*CONSULTA 05
Obtener el nombre comercial del producto, el ID de la venta, la fecha y hora de la venta,
y el nombre del cliente que realizó la compra.*/

SELECT 
    p.nombreProducto AS nombreComercial,
    v.idVenta,
    v.fechaHoraVenta,
    c.nombre AS nombreCliente
FROM DetalleVenta dv
INNER JOIN LoteProducto lp ON dv.idLoteProducto = lp.idLoteProducto
INNER JOIN Productos p ON lp.idProducto = p.idProducto
INNER JOIN Ventas v ON dv.idVenta = v.idVenta
INNER JOIN Clientes c ON v.idCliente = c.idCliente;

/*CONSULTA 06
Obtener todos los productos que vencen en los próximos 6 meses*/

SELECT 
    p.nombreProducto,
    lp.idLoteProducto,
    lp.fechaVencimiento
FROM LoteProducto lp
INNER JOIN Productos p ON lp.idProducto = p.idProducto
WHERE lp.fechaVencimiento BETWEEN GETDATE() AND DATEADD(MONTH, 6, GETDATE());

/*CONSULTA 07
Listar empleados por cargo y luego por apellido*/

SELECT 
    E.nombre,
    E.apellidos,
    E.cargo
FROM Empleados E
ORDER BY cargo ASC, apellidos ASC;

/*CONSULTA 08
Productos con stock actual por debajo del stock mínimo (nivel de reorden)*/

SELECT 
    p.nombreProducto,
    lp.cantidad AS stockActual,
    p.nivelReorden
FROM Productos p
INNER JOIN LoteProducto lp ON p.idProducto = lp.idProducto
WHERE lp.cantidad < p.nivelReorden;

/*SUB CONSULTAS*/

/*CONSULTA 09
Mostrar los productos cuyo precio es mayor al precio promedio de todos los productos.*/

SELECT P.nombreProducto, P.precioVenta
FROM Productos P
WHERE precioVenta > (
    SELECT AVG(precioVenta)
    FROM Productos
);

/*CONSULTA 10
Mostrar los productos que han sido vendidos, pero que requieren receta médica.*/
SELECT P.nombreProducto 
FROM Productos P
WHERE requiereReceta = 1 AND idProducto IN (
    SELECT DISTINCT lp.idProducto
    FROM DetalleVenta dv
    INNER JOIN LoteProducto lp ON dv.idLoteProducto = lp.idLoteProducto
);

/*CONSULTA 11
Mostrar los productos que pertenecen a la categoría menos vendida.*/

SELECT P.nombreProducto, P.nombreGenerico
FROM Productos P
WHERE idCategoria = (
    SELECT TOP 1 p.idCategoria
    FROM DetalleVenta dv
    INNER JOIN LoteProducto lp ON dv.idLoteProducto = lp.idLoteProducto
    INNER JOIN Productos p ON lp.idProducto = p.idProducto
    GROUP BY p.idCategoria
    ORDER BY COUNT(*) ASC
);

/*PROCEDIMIENTOS ALMACENADOS*/

/*SELECCION DE OPCIONES*/

CREATE PROCEDURE sp_reporte_clientes
    @opcion INT
AS
BEGIN
    IF @opcion = 1
    BEGIN
        -- 1. Lista de todos los clientes registrados
        SELECT c.idCliente, c.nombre, c.apellidos, c.DNI, c.correoElectronico, c.telefono
        FROM Clientes c;
    END
    ELSE IF @opcion = 2
    BEGIN
        -- 2. Clientes sin correo electrónico registrado
        SELECT c.idCliente, c.nombre, c.apellidos, c.DNI, c.telefono, c.correoElectronico 
        FROM Clientes c
        WHERE correoElectronico IS NULL;
    END
    ELSE IF @opcion = 3
    BEGIN
        -- 3. Clientes que no tienen teléfono registrado
        SELECT c.idCliente, c.nombre, c.apellidos, c.DNI, c.correoElectronico , c.telefono
        FROM Clientes c
        WHERE telefono IS NULL;
    END
END;

/*EJECUTADOR*/

EXEC sp_reporte_clientes 1;  -- Ver todos los clientes
EXEC sp_reporte_clientes 2;  -- Ver clientes sin correo
EXEC sp_reporte_clientes 3;  -- Ver clientes sin teléfono

/*SI QUIERES ELIMINAR EL PROCEDIMIENTO ALMACENADO*/

DROP PROCEDURE sp_reporte_clientes;

/*MOSTRAR VENTAS POR RANGO DE FECHAS*/

CREATE PROCEDURE sp_ventas_por_rango
    @fechaInicio DATE,
    @fechaFin DATE
AS
BEGIN
    SELECT 
        v.idVenta,
        c.nombre + ' ' + c.apellidos AS cliente,
        e.nombre + ' ' + e.apellidos AS empleado,
        v.fechaHoraVenta,
        v.montoTotal
    FROM Ventas v
    INNER JOIN Clientes c ON v.idCliente = c.idCliente
    INNER JOIN Empleados e ON v.idEmpleado = e.idEmpleado
    WHERE v.fechaHoraVenta BETWEEN @fechaInicio AND @fechaFin;
END;
/*EJECUTADOR*/
EXEC sp_ventas_por_rango '2021-01-01', '2024-06-30';


/*MOSTRAR PRODUCTOS QUE VENCEN DENTRO DE LOS PROXIMOS X DIAS */

CREATE PROCEDURE sp_productos_por_vencer
    @dias INT
AS
BEGIN
    SELECT 
        p.nombreProducto,
        lp.idLoteProducto,
        lp.cantidad,
        lp.fechaVencimiento
    FROM LoteProducto lp
    INNER JOIN Productos p ON lp.idProducto = p.idProducto
    WHERE lp.fechaVencimiento BETWEEN GETDATE() AND DATEADD(DAY, @dias, GETDATE())
    ORDER BY lp.fechaVencimiento ASC;
END;
/*EJECUTADOR*/
EXEC sp_productos_por_vencer @dias = 60;

/*REPORTE DE TOTAL DE VENTAS POR DIA*/

CREATE PROCEDURE sp_total_ventas_por_dia
AS
BEGIN
    SELECT 
        CAST(fechaHoraVenta AS DATE) AS Fecha,
        COUNT(idVenta) AS VentasTotales,
        SUM(montoTotal) AS MontoTotal
    FROM Ventas
    GROUP BY CAST(fechaHoraVenta AS DATE)
    ORDER BY Fecha;
END;

/*EJECUTADOR*/

EXEC sp_total_ventas_por_dia;

/*TRIGGER*/

CREATE TABLE AuditoriaMovInventario (
    idAuditoria INT IDENTITY(1,1) PRIMARY KEY,
    idMovimiento INT,
    idEmpleado INT,
    tipoMovimiento VARCHAR(50),
    nombreProducto VARCHAR(100),
    cantidad INT,
    fechaMovimiento DATETIME,
    usuario VARCHAR(100),
    hostName VARCHAR(100),
    fechaRegistro DATETIME DEFAULT GETDATE()
);

CREATE TRIGGER trg_auditoria_mov_inventario
ON MovimientoInventario
AFTER INSERT
AS
BEGIN
    INSERT INTO AuditoriaMovInventario (
        idMovimiento,
        idEmpleado,
        tipoMovimiento,
        nombreProducto,
        cantidad,
        fechaMovimiento,
        usuario,
        hostName
    )
    SELECT 
        i.idMovimiento,
        i.idEmpleado,
        tm.descripcion,
        p.nombreProducto,
        i.cantidad,
        i.fechaMovimiento,
        SYSTEM_USER,
        HOST_NAME()
    FROM inserted i
    INNER JOIN TipoMovimiento tm ON i.idTipoMovimiento = tm.idTipoMovimiento
    INNER JOIN Productos p ON i.idProducto = p.idProducto;
END;

SELECT * FROM AuditoriaMovInventario;

select * from Empleados

/*FUNCIONES*/

/*Devolver el 18% de un monto total*/

CREATE FUNCTION fn_calcular_igv (
    @monto DECIMAL(10,2)
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    RETURN @monto * 0.18;
END;

SELECT dbo.fn_calcular_igv(150.00);

/*FUNCION PARA CALCULAR LA EDAD DE UN CLIENTE*/

CREATE FUNCTION fn_calcular_edad_cliente (
    @fechaNacimiento DATE
)
RETURNS INT
AS
BEGIN
    RETURN DATEDIFF(YEAR, @fechaNacimiento, GETDATE())
           - CASE 
               WHEN MONTH(@fechaNacimiento) > MONTH(GETDATE()) 
                    OR (MONTH(@fechaNacimiento) = MONTH(GETDATE()) AND DAY(@fechaNacimiento) > DAY(GETDATE()))
               THEN 1 ELSE 0
             END;
END;

SELECT nombre, fecha_Nacimiento, dbo.fn_calcular_edad_cliente(fecha_Nacimiento) AS Edad
FROM Clientes;

`;