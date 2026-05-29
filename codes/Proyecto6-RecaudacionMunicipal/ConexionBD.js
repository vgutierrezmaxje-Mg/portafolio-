var CODE_6_CNX = `
package Clases;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {
    
    private String baseDatos;
    private String user;
    private String paswor;
    private Connection con;
    private static Conexion instance;

    private Conexion() {
        this.baseDatos = "jdbc:mysql://localhost:3306/RecaudacionMunicipal";
        this.user = "root";
        this.paswor = "Gutierrezmax01";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.con = DriverManager.getConnection(this.baseDatos, this.user, this.paswor);
            System.out.println("Conexion inicial correcta");
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("Error de Conexion Inicial: " + e.getMessage());
        }
    }
    
    public Connection getCon() {
        try {
            if (this.con == null || this.con.isClosed()) {
                this.con = DriverManager.getConnection(this.baseDatos, this.user, this.paswor);
                System.out.println("--- Nueva conexion establecida automaticamente ---");
            }
        } catch (SQLException e) {
            System.err.println("Error al recuperar la conexion: " + e.getMessage());
        }
        return this.con;
    }

    public static Conexion getInstance() {
        if (instance == null) {
            instance = new Conexion();
        }
        return instance;
    }

    public static Connection getConexion() {
        return getInstance().getCon();
    }
}

`;