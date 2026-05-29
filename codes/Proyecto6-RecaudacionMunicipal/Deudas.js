var CODE_6_DD = `

package InterfacesGraficas;

import Clases.Contribuyente;
import Clases.ContribuyenteDAO;
import Clases.Sesion;
import ConsultaObligac.ObligacionConsultaDTO;
import DAO.AuditoriaDAO;
import DAO.ObligacionDAO;
import RegistrarPago.PagoCabeceraDTO;
import RegistrarPago.PagoDetalleDTO;
import RegistrarPago.PagoObligacionTableModel;
import RegistrarPago.PagoService;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JOptionPane;

public class RegistrarPagoo extends javax.swing.JFrame {
    private Integer idContribuyenteSeleccionado = null;

    public RegistrarPagoo() {
        initComponents();
        this.setLocationRelativeTo(null);
        tblObligaciones.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                int column = tblObligaciones.columnAtPoint(evt.getPoint());
                if (column == 5) {
                    actualizarTotalAPagar();
                }
            }
        });
    }
    
    private void actualizarTotalAPagar() {
        double suma = 0;
        PagoObligacionTableModel model = (PagoObligacionTableModel) tblObligaciones.getModel();

        for (int i = 0; i < model.getRowCount(); i++) {
            if (model.estaSeleccionado(i)) {
                suma += model.getFila(i).getMonto_actual();
            }
        }
        txtTotalPagar.setText(String.format("%.2f", suma));
        calcularVuelto();
    }
    
    private void calcularVuelto() {
        try {
            String totalStr = txtTotalPagar.getText().replace(",", ".");
            double total = 0;

            if (!totalStr.isEmpty()) {
                total = Double.parseDouble(totalStr);
            }
            String recibidoStr = txtMontoRecibido.getText().replace(",", ".");
            double recibido = 0;

            if (!recibidoStr.isEmpty()) {
                recibido = Double.parseDouble(recibidoStr);
            }
            if (recibido >= total && total > 0) {
                double vuelto = recibido - total;
                txtVuelto.setText(String.format("%.2f", vuelto));
                txtVuelto.setForeground(new java.awt.Color(0, 150, 0));
            } else {
                txtVuelto.setText("0.00");
                txtVuelto.setForeground(java.awt.Color.RED); 
            }
        } catch (NumberFormatException e) {
            txtVuelto.setText("0.00");
            txtVuelto.setForeground(java.awt.Color.RED);
        }
    }
    
    private void limpiarFormularioPago() {
        txtContribuyente.setText("");
        txtReferencia.setText("");
        txtObservacion.setText("");
        txtMontoRecibido.setText("");
        txtTotalPagar.setText("0.00");
        txtVuelto.setText("0.00");
        txtVuelto.setForeground(java.awt.Color.BLACK);
        cmbMetodoPago.setSelectedIndex(0);
      
        if (cmbMetodoPago.getItemCount() > 0) {
            cmbMetodoPago.setSelectedIndex(0);
        }
        tblObligaciones.setModel(new javax.swing.table.DefaultTableModel());
        this.idContribuyenteSeleccionado = null;

    }
    private void recargarTablaPago() {
        btnBuscarContribuyenteActionPerformed(null);
    }
    private void generarReferenciaAutomatica() {
        String metodo = cmbMetodoPago.getSelectedItem().toString();
        java.time.LocalDate fecha = java.time.LocalDate.now();
        String fechaStr = fecha.toString().replace("-", "");
        String prefijo = metodo.substring(0, Math.min(metodo.length(), 4)).toUpperCase();
        String ref = prefijo + "-" + fechaStr + "-" + idContribuyenteSeleccionado;
        txtReferencia.setText(ref);
    }

    @SuppressWarnings("unchecked")

    private void btnBuscarContribuyenteActionPerformed(java.awt.event.ActionEvent evt) {                                                       
        int index = cmbCriterio.getSelectedIndex();
        int idTipoDoc = 0;
        switch (index) {
            case 1 ->
                idTipoDoc = 1; 
            case 2 ->
                idTipoDoc = 2;
            case 3 ->
                idTipoDoc = 3; 
            default -> {
                JOptionPane.showMessageDialog(this, "Seleccione tipo de documento");
                return;
            }
        }
        String numero = txtContribuyente.getText().trim();
        if (numero.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Ingrese numero de documento");
            return;
        }
        ContribuyenteDAO contribuyenteDAO = new ContribuyenteDAO();
        Contribuyente c = contribuyenteDAO.buscar(idTipoDoc, numero);
        if (c == null) {
            JOptionPane.showMessageDialog(this, "Contribuyente no encontrado");
            return;
        }
        ObligacionDAO obligacionDAO = new ObligacionDAO();
        List<ObligacionConsultaDTO> lista = obligacionDAO
                .consultarObligacionesParaPago(c.getId_contribuyente());
        if (lista.isEmpty()) {
            JOptionPane.showMessageDialog(this, "El contribuyente no tiene deudas pendientes");
        }
        PagoObligacionTableModel model = new PagoObligacionTableModel(lista);
        tblObligaciones.setModel(model);
        txtTotalPagar.setText("0.00");
        txtVuelto.setText("0.00");
        txtMontoRecibido.setText("");

        this.idContribuyenteSeleccionado = c.getId_contribuyente();
    }                                                      

    private void cmbMetodoPagoActionPerformed(java.awt.event.ActionEvent evt) {                                              
        if (idContribuyenteSeleccionado != null && idContribuyenteSeleccionado > 0) {
            generarReferenciaAutomatica();
        }
    }                                             

    private void btnSalirActionPerformed(java.awt.event.ActionEvent evt) {                                         
        dispose();
    }                                        

    private void txtMontoRecibidoActionPerformed(java.awt.event.ActionEvent evt) {                                                 
        calcularVuelto();
    }                                                

    private void btnRegistrarPagoActionPerformed(java.awt.event.ActionEvent evt) {                                                 
        if (!(tblObligaciones.getModel() instanceof PagoObligacionTableModel)) {
            JOptionPane.showMessageDialog(this, "No hay obligaciones cargadas");
            return;
        }
        PagoObligacionTableModel model
                = (PagoObligacionTableModel) tblObligaciones.getModel();
        List<ObligacionConsultaDTO> seleccionadas = model.getSeleccionadas();
        if (seleccionadas.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Seleccione al menos una obligacion");
            return;
        }
        PagoCabeceraDTO cabecera = new PagoCabeceraDTO();
        cabecera.setId_Contribuyente(idContribuyenteSeleccionado);
        int idEjecutor = Sesion.usuarioLogueado.getIdUsuario();
        cabecera.setIdU_suario(idEjecutor);
        cabecera.setId_Metodo(cmbMetodoPago.getSelectedIndex() + 1);
        cabecera.setReferencia(txtReferencia.getText().trim());
        cabecera.setObservacion(txtObservacion.getText().trim());
        double total = 0;
        List<PagoDetalleDTO> detalles = new ArrayList<>();
        for (ObligacionConsultaDTO o : seleccionadas) {
            if (o.getEstado().equalsIgnoreCase("Pagado")) {
                JOptionPane.showMessageDialog(this,
                        "La obligacion " + o.getId_obligacion() + " ya esta pagada");
                return;
            }
            PagoDetalleDTO det = new PagoDetalleDTO();
            det.setId_Obligacion(o.getId_obligacion());
            det.setMonto_aplicado(o.getMonto_actual());
            total += o.getMonto_actual();
            detalles.add(det);
        }
        cabecera.setMonto_total(total);
        int op = JOptionPane.showConfirmDialog(
                this,
                "Monto total a pagar: S/ " + total + "\n¿Confirmar pago?",
                "Confirmacion",
                JOptionPane.YES_NO_OPTION
        );
        if (op != JOptionPane.YES_OPTION) {
            return;
        }
        
        try {
            PagoService service = new PagoService();
            service.registrarPago(cabecera, detalles);
            new AuditoriaDAO().registrar(
                    idEjecutor,
                    "INSERT",
                    "pago_cabecera",
                    idContribuyenteSeleccionado,
                    "Registro de pago por S/ " + total + " - Metodo: " + cmbMetodoPago.getSelectedItem()
            );
            JOptionPane.showMessageDialog(this, "Pago registrado correctamente");
            limpiarFormularioPago();
            recargarTablaPago();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this,
                    "Error al registrar pago:\n" + e.getMessage());
        }
    }                                                

    private void txtMontoRecibidoKeyReleased(java.awt.event.KeyEvent evt) {                                             
        calcularVuelto();
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
            java.util.logging.Logger.getLogger(RegistrarPagoo.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(RegistrarPagoo.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(RegistrarPagoo.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(RegistrarPagoo.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new RegistrarPagoo().setVisible(true);
            }
        });
    }

`;