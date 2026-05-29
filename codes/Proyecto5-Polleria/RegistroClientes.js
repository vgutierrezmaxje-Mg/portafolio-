var CODE_5_RC = `

package Polleria;

import java.util.ArrayList;
import javax.swing.JOptionPane;
import javax.swing.table.DefaultTableModel;

public class RegistroDePersonas extends javax.swing.JFrame {

    DefaultTableModel modelo = new DefaultTableModel();
    ArrayList<Personas> listaPersonas = new ArrayList<Personas>();

    public RegistroDePersonas() {
        initComponents();
        this.setTitle("REGISTRO DE PERSONAS");
        this.setSize(820, 500);
        this.setLocationRelativeTo(null);

        modelo.addColumn("NOMBRE");
        modelo.addColumn("APELLIDOS");
        modelo.addColumn("DNI");
        refrescarTbala();
    }

    @SuppressWarnings("unchecked")

       private void btMenuActionPerformed(java.awt.event.ActionEvent evt) {                                       
        this.setVisible(false);
        MenuDeLaPolleria m = new MenuDeLaPolleria();
        m.setVisible(true);
    }                                      

    private void btBorrarActionPerformed(java.awt.event.ActionEvent evt) {                                         
        int fila = tbRegistro.getSelectedRow();
        if (tbRegistro.getSelectedRow() >= 0) {
            modelo.removeRow(fila);

        } else {
            JOptionPane.showMessageDialog(null, "Seleccione una fila");
        }

    }                                        

    private void btAgregrarActionPerformed(java.awt.event.ActionEvent evt) {                                           
        try {

            Personas personas = new Personas();
            personas.setNombre(txNombrePersonas.getText());
            personas.setApellidos(txApellidosPersonas.getText());
            personas.setDni(txDNI.getText());
            listaPersonas.add(personas);
            refrescarTbala();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "ERROR ALA AGREGAR CLIENTE");

        }
        txNombrePersonas.setText("");
        txApellidosPersonas.setText("");
        txDNI.setText("");
    }                                          

    private void txDNIActionPerformed(java.awt.event.ActionEvent evt) {                                      
        // TODO add your handling code here:
    }                                     

    public void refrescarTbala() {
        while (modelo.getRowCount() > 0) {
            modelo.removeRow(0);

        }

        for (Personas personas : listaPersonas) {

            Object p[] = new Object[3];
            p[0] = personas.getNombre();
            p[1] = personas.getApellido();
            p[2] = personas.getDni();
            modelo.addRow(p);

        }
        tbRegistro.setModel(modelo);

    }

    public static void main(String args[]) {
        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new RegistroDePersonas().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify                     
    private javax.swing.JButton btAgregrar;
    private javax.swing.JButton btBorrar;
    private javax.swing.JButton btMenu;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLapellido;
    private javax.swing.JLabel jLdni;
    private javax.swing.JLabel jLnombre;
    private javax.swing.JMenu jMenu1;
    private javax.swing.JMenu jMenu2;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JLabel lblImagen;
    private javax.swing.JTable tbRegistro;
    private javax.swing.JTextField txApellidosPersonas;
    private javax.swing.JTextField txDNI;
    private javax.swing.JTextField txNombrePersonas;
    // End of variables declaration                   
}
`;