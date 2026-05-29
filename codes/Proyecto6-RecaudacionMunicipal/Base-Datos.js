var CODE_6_BD = `
CREATE DATABASE RecaudacionMunicipal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE RecaudacionMunicipal;

CREATE TABLE documento_tipo (
  id_doc_tipo INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE contribuyente (
  id_contribuyente INT AUTO_INCREMENT PRIMARY KEY,
  id_doc_tipo INT NOT NULL,
  doc_numero VARCHAR(20) NOT NULL,
  tipo ENUM('Natural','Juridico') NOT NULL,
  nombres VARCHAR(100),
  apellidos VARCHAR(100),
  razon_social VARCHAR(150),
  fecha_nacimiento DATE,
  direccion_principal VARCHAR(200),
  telefono VARCHAR(30),
  correo VARCHAR(100),
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY ux_contribuyente_doc (id_doc_tipo, doc_numero),
  CONSTRAINT fk_contrib_doc_tipo FOREIGN KEY (id_doc_tipo) REFERENCES documento_tipo(id_doc_tipo)
) ENGINE=InnoDB;

CREATE TABLE direccion (
  id_direccion INT AUTO_INCREMENT PRIMARY KEY,
  id_contribuyente INT NOT NULL,
  tipo_direccion ENUM('Fiscal','Real','Notificacion') DEFAULT 'Fiscal',
  direccion_linea VARCHAR(250),
  distrito VARCHAR(100),
  provincia VARCHAR(100),
  departamento VARCHAR(100),
  codigo_postal VARCHAR(20),
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente)
) ENGINE=InnoDB;

CREATE TABLE contribuyente_contacto (
  id_contacto INT AUTO_INCREMENT PRIMARY KEY,
  id_contribuyente INT NOT NULL,
  tipo_contacto ENUM('Telefono','Movil','Correo','Otro') NOT NULL,
  valor VARCHAR(150) NOT NULL,
  comentario VARCHAR(200),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente)
) ENGINE=InnoDB;

CREATE TABLE zona (
  id_zona INT AUTO_INCREMENT PRIMARY KEY,
  codigo_zona VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE propiedad_catastral (
  id_predio INT AUTO_INCREMENT PRIMARY KEY,
  codigo_catastral VARCHAR(60) UNIQUE,
  id_contribuyente INT NOT NULL,
  direccion VARCHAR(250),
  distrito VARCHAR(100),
  area_m2 DECIMAL(12,2),
  uso ENUM('Residencial','Comercial','Industrial','Agricola','Otro') DEFAULT 'Residencial',
  valor_ventas DECIMAL(12,2) DEFAULT 0,
  id_zona INT,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente),
  FOREIGN KEY (id_zona) REFERENCES zona(id_zona)
) ENGINE=InnoDB;

CREATE TABLE tributo (
  id_tributo INT AUTO_INCREMENT PRIMARY KEY,
  codigo_tributo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  categoria ENUM('Predial','Arbitrio','Licencia','Multa','Otro') NOT NULL,
  aplicable_predio BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE tasa_tributo (
  id_tasa INT AUTO_INCREMENT PRIMARY KEY,
  id_tributo INT NOT NULL,
  id_zona INT NULL,
  anio INT NOT NULL,
  mes INT DEFAULT 0,
  valor_base DECIMAL(12,4) NOT NULL,
  descripcion VARCHAR(255),
  vigencia_inicio DATE,
  vigencia_fin DATE,
  UNIQUE KEY ux_tasa_tributo (id_tributo, id_zona, anio, mes),
  FOREIGN KEY (id_tributo) REFERENCES tributo(id_tributo),
  FOREIGN KEY (id_zona) REFERENCES zona(id_zona)
) ENGINE=InnoDB;

CREATE TABLE obligacion (
  id_obligacion INT AUTO_INCREMENT PRIMARY KEY,
  id_contribuyente INT NOT NULL,
  id_tributo INT NOT NULL,
  id_predio INT NULL,
  anio INT,
  mes INT DEFAULT 0,
  periodo_inicio DATE,
  periodo_fin DATE,
  referencia VARCHAR(100),
  monto_original DECIMAL(12,2) NOT NULL,
  monto_actual DECIMAL(12,2) NOT NULL,
  moneda VARCHAR(10) DEFAULT 'PEN',
  estado ENUM('Pendiente','Parcial','Pagado','Vencido','Anulado') DEFAULT 'Pendiente',
  fecha_generada DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_vencimiento DATE,
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente),
  FOREIGN KEY (id_tributo) REFERENCES tributo(id_tributo),
  FOREIGN KEY (id_predio) REFERENCES propiedad_catastral(id_predio)
) ENGINE=InnoDB;

CREATE TABLE exoneracion (
  id_exoneracion INT AUTO_INCREMENT PRIMARY KEY,
  id_obligacion INT NOT NULL,
  tipo ENUM('Total','Parcial','Porcentaje') NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  motivo VARCHAR(255),
  aplicado_por INT NULL,
  fecha_aplicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_obligacion) REFERENCES obligacion(id_obligacion)
) ENGINE=InnoDB;

CREATE TABLE metodo_pago (
  id_metodo INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) UNIQUE,
  descripcion VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  nombres VARCHAR(100),
  apellidos VARCHAR(100),
  email VARCHAR(100),
  rol ENUM('Administrador','Cajero','Supervisor') DEFAULT 'Cajero',
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE pago (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_contribuyente INT NOT NULL,
  id_usuario INT,
  fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
  monto_total DECIMAL(12,2) NOT NULL,
  id_metodo INT,
  referencia VARCHAR(100),
  observacion VARCHAR(255),
  anulada BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_metodo) REFERENCES metodo_pago(id_metodo)
) ENGINE=InnoDB;

CREATE TABLE pago_detalle (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pago INT NOT NULL,
  id_obligacion INT NOT NULL,
  monto_aplicado DECIMAL(12,2) NOT NULL,
  fecha_aplicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pago) REFERENCES pago(id_pago),
  FOREIGN KEY (id_obligacion) REFERENCES obligacion(id_obligacion)
) ENGINE=InnoDB;

CREATE TABLE comprobante (
  id_comprobante INT AUTO_INCREMENT PRIMARY KEY,
  id_pago INT NOT NULL,
  tipo ENUM('Boleta','Factura','Recibo','Ticket') DEFAULT 'Recibo',
  numero_comprobante VARCHAR(50) NOT NULL UNIQUE,
  fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2),
  estado ENUM('Emitido','Anulado') DEFAULT 'Emitido',
  FOREIGN KEY (id_pago) REFERENCES pago(id_pago)
) ENGINE=InnoDB;

CREATE TABLE licencia_solicitud (
  id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
  id_contribuyente INT NOT NULL,
  tipo_licencia ENUM('Funcionamiento','Construccion','Transporte','Publicidad','Otro') NOT NULL,
  descripcion TEXT,
  fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('Pendiente','Aprobada','Rechazada','Anulada') DEFAULT 'Pendiente',
  monto_estimado DECIMAL(12,2) DEFAULT 0,
  usuario_tramite INT NULL,
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente),
  FOREIGN KEY (usuario_tramite) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE licencia (
  id_licencia INT AUTO_INCREMENT PRIMARY KEY,
  id_solicitud INT,
  id_contribuyente INT NOT NULL,
  numero_licencia VARCHAR(60) UNIQUE,
  tipo_licencia ENUM('Funcionamiento','Construccion','Transporte','Publicidad','Otro') NOT NULL,
  descripcion TEXT,
  fecha_emision DATE,
  fecha_vencimiento DATE,
  monto DECIMAL(12,2) DEFAULT 0,
  estado ENUM('Vigente','Vencida','Anulada') DEFAULT 'Vigente',
  FOREIGN KEY (id_solicitud) REFERENCES licencia_solicitud(id_solicitud),
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente)
) ENGINE=InnoDB;

CREATE TABLE licencia_pago (
  id_pago_licencia INT AUTO_INCREMENT PRIMARY KEY,
  id_licencia INT NOT NULL,
  id_pago INT NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_licencia) REFERENCES licencia(id_licencia),
  FOREIGN KEY (id_pago) REFERENCES pago(id_pago)
) ENGINE=InnoDB;

CREATE TABLE sancion (
  id_sancion INT AUTO_INCREMENT PRIMARY KEY,
  id_contribuyente INT,
  id_predio INT,
  fecha_emision DATE,
  monto DECIMAL(12,2),
  motivo TEXT,
  estado ENUM('Pendiente','Pagada','Anulada') DEFAULT 'Pendiente',
  FOREIGN KEY (id_contribuyente) REFERENCES contribuyente(id_contribuyente),
  FOREIGN KEY (id_predio) REFERENCES propiedad_catastral(id_predio)
) ENGINE=InnoDB;

CREATE TABLE auditoria (
  id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  accion VARCHAR(100),
  entidad VARCHAR(100),
  id_entidad INT NULL,
  detalles TEXT,
  fecha_evento DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE reportes_recaudacion (
  id_reporte INT AUTO_INCREMENT PRIMARY KEY,
  periodo_inicio DATE,
  periodo_fin DATE,
  total_recaudado DECIMAL(14,2),
  cantidad_pagos INT,
  generado_por INT,
  fecha_generado DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generado_por) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE configuracion (
  clave VARCHAR(100) PRIMARY KEY,
  valor TEXT,
  descripcion VARCHAR(255),
  fecha_actualizado DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

`;
