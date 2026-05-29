var CODE_05_CP = `
package Polleria;

import java.util.ArrayList;
import javax.swing.DefaultComboBoxModel;
import javax.swing.table.DefaultTableModel;

public class RegistroDeProductos extends javax.swing.JFrame {
    
    String productosPlatos [] = {"----------------------------","Pollo a la Brasa", "Chaufa", "Moustrito", "Salchi Pollo", "Sopa Wantan"};
    double preciosPlatos [] = {0, 20, 13, 15, 12, 9};
    double precioPlato = 0;
    int cantidadPlato = 0;
    
    DefaultTableModel modelo = new DefaultTableModel();
    ArrayList<Productos> listaProdcutosP = new ArrayList<Productos>();

    public RegistroDeProductos() {
        initComponents();
        this.setLocationRelativeTo(null);
        //MOSTRAR LOS PLATOS EN VENTANA
        DefaultComboBoxModel comoModelP = new DefaultComboBoxModel(productosPlatos);
        cboProductosPlatos.setModel(comoModelP);
        
        
        //CODIGO DE LA TABLA
        modelo.addColumn("DESCRIPCION");
        modelo.addColumn("PRECIO $");
        modelo.addColumn("CANTIDAD");
        modelo.addColumn("IMPORTE");
        
        actualizarTabla();

    }
        
    
    @SuppressWarnings("unchecked")

    
    private void cboProductosPlatosActionPerformed(java.awt.event.ActionEvent evt) {                                                   
        //PRODUCTO DE PLATOS
        calcularPrecioPlatos();
    }                                                  

    private void spnCantidadDePlatosStateChanged(javax.swing.event.ChangeEvent evt) {                                                 
        // CANTIDAD DE PLATOS;
        calcularPrecioPlatos();
    }                                                

    private void btnAgregarProductoPlatoActionPerformed(java.awt.event.ActionEvent evt) {                                                        
        // AGREGA LOS PLATOS A LA TABLA
        Productos vProducto = new Productos();
        vProducto.setIdP(cboProductosPlatos.getSelectedIndex());
        vProducto.setDescripcionP(cboProductosPlatos.getSelectedItem().toString());
        vProducto.setPrecioP(precioPlato);
        vProducto.setCantidadP(cantidadPlato);
        vProducto.setImporteP(precioPlato*cantidadPlato);
        if(!buscarVentaP(vProducto)){
            listaProdcutosP.add(vProducto);
        }
        
        
        actualizarTabla();
        borrarProducto();
        
    }                                                       

    private void btnMenuPolleriaActionPerformed(java.awt.event.ActionEvent evt) {                                                
        // REGRRESA AL MENU
        this.setVisible(false);
        MenuDeLaPolleria me = new MenuDeLaPolleria();
        me.setVisible(true);
    }                                               

    public boolean buscarVentaP(Productos nuevoP){  
        for (Productos p : listaProdcutosP) {
            if (p.getIdP() == nuevoP.getIdP()) {
                int nuevaCantidadP = p.getCantidadP()+nuevoP.getCantidadP();
                p.setCantidadP(nuevaCantidadP);
                p.setImporteP(p.getPrecioP()*nuevaCantidadP);
                return true;
            }     
        }
        return false;
    }
    public void borrarProducto(){
        precioPlato = 0;
        cantidadPlato = 1;
        cboProductosPlatos.setSelectedIndex(0);
        spnCantidadDePlatos.setValue(1);
        calcularPrecioPlatos();
       
        
    }
    public void calcularPrecioPlatos(){
        precioPlato = preciosPlatos[cboProductosPlatos.getSelectedIndex()];
        cantidadPlato = Integer.parseInt(spnCantidadDePlatos.getValue().toString());
        lblPrecioDePlatos.setText(aMoneda(precioPlato));
        lblImporteDePlatos.setText(aMoneda(precioPlato*cantidadPlato));
    
    }
 
    public String aMoneda(double precioPlato){
        return "$ "+Math.round(precioPlato*100.0)/100.0+" PN";
    }
 
    public void actualizarTabla(){
        while(modelo.getRowCount()>0){
            modelo.removeRow(0);
            
        }
        for (Productos p : listaProdcutosP) {
            Object x[] = new Object[4];
            x[0]= p.getDescripcionP();
            x[1]= aMoneda(p.getPrecioP());
            x[2]= p.getCantidadP();
            x[3]= aMoneda(p.getImporteP());
            
            modelo.addRow(x);
   
        }
        
        tblTablaProductos.setModel(modelo);
    }
    
    public static void main(String args[]) {
     
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(RegistroDeProductos.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(RegistroDeProductos.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(RegistroDeProductos.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(RegistroDeProductos.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

       
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new RegistroDeProductos().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify                     
    private javax.swing.JButton btnAgregarProductoPlato;
    private javax.swing.JButton btnMenuPolleria;
    private javax.swing.JComboBox<String> cboProductosPlatos;
    private javax.swing.JButton jButton5;
    private javax.swing.JButton jButton6;
    private javax.swing.JButton jButton7;
    private javax.swing.JComboBox<String> jComboBox5;
    private javax.swing.JComboBox<String> jComboBox6;
    private javax.swing.JComboBox<String> jComboBox7;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel11;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel22;
    private javax.swing.JLabel jLabel23;
    private javax.swing.JLabel jLabel24;
    private javax.swing.JLabel jLabel25;
    private javax.swing.JLabel jLabel26;
    private javax.swing.JLabel jLabel27;
    private javax.swing.JLabel jLabel28;
    private javax.swing.JLabel jLabel29;
    private javax.swing.JLabel jLabel30;
    private javax.swing.JLabel jLabel31;
    private javax.swing.JLabel jLabel32;
    private javax.swing.JLabel jLabel33;
    private javax.swing.JLabel jLabel34;
    private javax.swing.JLabel jLabel35;
    private javax.swing.JLabel jLabel36;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JSpinner jSpinner2;
    private javax.swing.JSpinner jSpinner3;
    private javax.swing.JSpinner jSpinner4;
    private javax.swing.JTable jTable1;
    private javax.swing.JLabel lblImporteDePlatos;
    private javax.swing.JLabel lblPrecioDePlatos;
    private javax.swing.JSpinner spnCantidadDePlatos;
    private javax.swing.JTable tblTablaProductos;
    // End of variables declaration                   
}
`;