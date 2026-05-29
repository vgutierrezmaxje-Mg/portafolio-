var CODE_04_CP = `

#include "newprestamo.h"
#include "ui_newprestamo.h"
#include <QTimer>
#include <QTime>
#include <QString>
#include <QMessageBox>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include "verprestamos.h"
#include "newestudiante.h"
#include "verreserva.h"

const char limite = '%';

newPrestamo::newPrestamo(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::newPrestamo)
{
    this->lLib = new ListaLibro();
    this->lrev = new ListaRevista;
    this->ltes = new ListaTesis();
    this->lestud = new ListaEstudiante();
    this->ldoc = new ListaDocente();
    this->lPres = new ListaPrestamos();
    this->usuarioSelec = NULL;
    this->lReser = new ListaReservas();

    ui->setupUi(this);

    Prestamo *pTemp = new Prestamo();
    ui->lbNresivo->setText(QString::fromStdString(pTemp->getCodigo()));
    delete pTemp;
    Prestamo::setCodigoP(Prestamo::getCodigoP() - 1);


    this->lLib->recuperarLibros();
    this->lrev->recuperarRevista();
    this->ltes->recuperarTesis();
    this->lestud->recuperarEstudiantes();
    this->ldoc->recuperarDocentes();

    //reloj tiempo real
    QTimer *timer = new QTimer(this);
    connect(timer, &QTimer::timeout, this, &newPrestamo::actualizarReloj);
    timer->start(1000);
    actualizarReloj();
    //fecha actual
    ui->dEdevolucion->setDate(QDate::currentDate());
    ui->dElimite->setDate(QDate::currentDate().addDays(7));
    //configuracion de interzas

    configurarTablaUsuarios();
    configurarTablaMateriales();

    cargarMateriales();
    cargarUsuarios();

    configuraciondeTablaDetallePrestamo();
    configuraciondeInterfaz();

    connect(ui->tWlistaUsuarios, &QTableWidget::cellClicked,
            this, &newPrestamo::mostrarDatosUsuarioSeleccionado);

    connect(ui->pBnuevoprestamo, SIGNAL(clicked()), this, SLOT(on_pBnuevoprestamo_clicked()));

    connect(ui->txtBuscarUsuarioDNI, &QLineEdit::textChanged,
            this, &newPrestamo::buscarUsuarioPorDni);

    connect(ui->txtBuscarMaterialAutor, &QLineEdit::textChanged,
            this, &newPrestamo::buscarMaterialPorAutor);
}

newPrestamo::~newPrestamo()
{
    delete ui;
}

ListaLibro *newPrestamo::getLLib() const
{
    return lLib;
}

void newPrestamo::setLLib(ListaLibro *value)
{
    lLib = value;
}
ListaRevista *newPrestamo::getLrev() const
{
    return lrev;
}

void newPrestamo::setLrev(ListaRevista *value)
{
    lrev = value;
}
ListaTesis *newPrestamo::getLtes() const
{
    return ltes;
}

void newPrestamo::setLtes(ListaTesis *value)
{
    ltes = value;
}
ListaEstudiante *newPrestamo::getLestud() const
{
    return lestud;
}

void newPrestamo::setLestud(ListaEstudiante *value)
{
    lestud = value;
}
ListaDocente *newPrestamo::getLdoc() const
{
    return ldoc;
}

void newPrestamo::setLdoc(ListaDocente *value)
{
    ldoc = value;
}

ListaPrestamos *newPrestamo::getLPres() const
{
    return lPres;
}

void newPrestamo::setLPres(ListaPrestamos *value)
{
    lPres = value;
}

Usuarios *newPrestamo::getUsuarioSelec() const
{
    return usuarioSelec;
}

void newPrestamo::setUsuarioSelec(Usuarios *value)
{
    usuarioSelec = value;
}

ListaReservas *newPrestamo::getLReser() const
{
    return lReser;
}

void newPrestamo::setLReser(ListaReservas *value)
{
    lReser = value;
}

void newPrestamo::actualizarReloj() {
    QTime horaActual = QTime::currentTime();
    QString horaTexto = horaActual.toString("hh:mm:ss");
    ui->labelReloj->setText(horaTexto);
}

void newPrestamo::configuraciondeTablaDetallePrestamo(){
    ui->tWdetallePrestamo->setColumnCount(6);
    QStringList headersLibros;
    headersLibros << "Código" << "Título" << "Autor" << "Año de Publicación" << "Tipo de Material" << "Cantidad";
    ui->tWdetallePrestamo->setHorizontalHeaderLabels(headersLibros);

    QHeaderView* headerLibros = ui->tWdetallePrestamo->horizontalHeader();
    headerLibros->setDefaultAlignment(Qt::AlignHCenter | Qt::AlignVCenter);
    headerLibros->setStyleSheet(
        "QHeaderView::section {"
        "background-color: #f9f9f9;"
        "color: black;"
        "font-weight: 500;"
        "font-size: 8pt;"
        "padding: 5px;"
        "border: 1px solid lightgray;"
        "}"
    );
    headerLibros->setSectionResizeMode(QHeaderView::ResizeToContents);
}

void newPrestamo::configuraciondeInterfaz(){
    ui->dEdevolucion->setStyleSheet("QDateEdit {"
                                    "  background-color: white;"
                                    "  border: 2px solid #C0C0C0;"
                                    "  border-radius: 6px;"
                                    "  padding: 4px;"
                                    "  font-size: 13px;"
                                    "}");
    ui->dElimite->setStyleSheet("QDateEdit {"
                                "  background-color: white;"
                                "  border: 2px solid #C0C0C0;"
                                "  border-radius: 6px;"
                                "  padding: 4px;"
                                "  font-size: 13px;"
                                "}");

    ui->label->setStyleSheet("QLabel {"
                             "border: 2px solid #ffd700;"  // Amarillo fuerte (dorado)
                             "border-radius: 8px;"         // Bordes redondeados (opcional)
                             "padding: 6px;"               // Espaciado interno
                             "color: black;"               // Color del texto
                             "}");
    ui->labelReloj->setAlignment(Qt::AlignCenter);
    ui->labelReloj->setStyleSheet(
        "QLabel {"
        " color: black;"
        " border-radius: 10px;"                // Bordes redondeados
        " padding: 10px;"                      // Espaciado interno
        " font-size: 24px;"                    // Tamaño de fuente
        " font-weight: bold;"                  // Negrita
        " font-family: 'Segoe UI', sans-serif;"
        "}"
    );

    ui->gPseleccionPrestamos->setStyleSheet(
        "QGroupBox {"
        " background-color: #FDF2F2;"        // Rojo muy claro de fondo
        " border: 2px solid #E53935;"        // Borde rojo fuerte
        " border-radius: 10px;"
        " padding: 10px;"
        " margin-top: 20px;"
        "}"

        "QGroupBox::title {"
        " subcontrol-origin: margin;"
        " subcontrol-position: top left;"
        " padding: 0 10px;"
        " background-color: #FDF2F2;"
        " color: #E53935;"
        " font-weight: bold;"
        " font-size: 14px;"
        "}"
    );

    ui->gbDatosUsuario->setStyleSheet(
        "QGroupBox {"
        " background-color: #F9F9F9;"        // Fondo claro elegante
        " border: 2px solid #007ACC;"        // Borde azul (estilo Visual Studio)
        " border-radius: 10px;"              // Bordes redondeados
        " padding: 10px;"
        " margin-top: 20px;"                 // Espacio superior
        "}"

        "QGroupBox::title {"
        " subcontrol-origin: margin;"
        " subcontrol-position: top left;"   // Título en la esquina superior izquierda
        " padding: 0 10px;"
        " background-color: #F9F9F9;"       // Fondo del título igual al fondo general
        " color: #007ACC;"                  // Color del texto del título
        " font-weight: bold;"
        " font-size: 14px;"
        "}"
    );

    ui->gbDetalleprestamo->setStyleSheet(
        "QGroupBox {"
        " background-color: #F1FAF1;"
        " border: 2px solid #43A047;"        // Verde medio
        " border-radius: 10px;"
        " padding: 10px;"
        " margin-top: 20px;"
        "}"

        "QGroupBox::title {"
        " subcontrol-origin: margin;"
        " subcontrol-position: top left;"
        " padding: 0 10px;"
        " background-color: #F1FAF1;"
        " color: #2E7D32;"                   // Verde oscuro para el título
        " font-weight: bold;"
        " font-size: 14px;"
        "}"
    );

    ui->gBopcionyresultado->setStyleSheet(
        "QGroupBox {"
        " background-color: #F8F4FD;"        // Lila muy claro
        " border: 2px solid #8E24AA;"        // Morado intenso
        " border-radius: 10px;"
        " padding: 10px;"
        " margin-top: 20px;"
        "}"

        "QGroupBox::title {"
        " subcontrol-origin: margin;"
        " subcontrol-position: top left;"
        " padding: 0 10px;"
        " background-color: #F8F4FD;"
        " color: #6A1B9A;"                   // Morado más oscuro
        " font-weight: bold;"
        " font-size: 14px;"
        "}"
    );

    ui->pBagregarlibro->setStyleSheet(
                "QPushButton {"
                   " background-color: transparent;"       // Sin fondo fuerte
                   " color: #2E2E2E;"                      // Letra negra o gris oscuro
                   " border: 2px solid #800080;"           // Morado suave
                   " font-weight: normal;"
                   "border-radius: 10px;"
                   "}"
                   "QPushButton:hover {"
                   " background-color: #E6E6FA;"           // Ligero fondo al pasar el mouse
                   "}"
                   "QPushButton:pressed {"
                   " background-color: #E6E6FA;"
                   "}"
    );
    ui->pBnuevoprestamo->setStyleSheet(
                "QPushButton {"
                   " background-color: transparent;"       // Sin fondo fuerte
                   " color: #2E2E2E;"                      // Letra negra o gris oscuro
                   " border: 2px solid #800080;"           // Morado suave
                   " font-weight: normal;"
                   "border-radius: 10px;"
                   "}"
                   "QPushButton:hover {"
                   " background-color: #E6E6FA;"           // Ligero fondo al pasar el mouse
                   "}"
                   "QPushButton:pressed {"
                   " background-color: #E6E6FA;"
                   "}"
    );
    ui->pBquitarLibro->setStyleSheet(
                "QPushButton {"
                   " background-color: transparent;"       // Sin fondo fuerte
                   " color: #2E2E2E;"                      // Letra negra o gris oscuro
                   " border: 2px solid #800080;"           // Morado suave
                   " font-weight: normal;"
                   "border-radius: 10px;"
                   "}"
                   "QPushButton:hover {"
                   " background-color: #E6E6FA;"           // Ligero fondo al pasar el mouse
                   "}"
                   "QPushButton:pressed {"
                   " background-color: #E6E6FA;"
                   "}"
    );
    ui->pbverprestamo->setStyleSheet(
                "QPushButton {"
                   " background-color: transparent;"       // Sin fondo fuerte
                   " color: #2E2E2E;"                      // Letra negra o gris oscuro
                   " border: 2px solid #800080;"           // Morado suave
                   " font-weight: normal;"
                   "border-radius: 10px;"
                   "}"
                   "QPushButton:hover {"
                   " background-color: #E6E6FA;"           // Ligero fondo al pasar el mouse
                   "}"
                   "QPushButton:pressed {"
                   " background-color: #E6E6FA;"
                   "}"
    );
    ui->pBguardasprestamo->setStyleSheet(
                "QPushButton {"
                   " background-color: transparent;"       // Sin fondo fuerte
                   " color: #2E2E2E;"                      // Letra negra o gris oscuro
                   " border: 2px solid #800080;"           // Morado suave
                   " font-weight: normal;"
                   "border-radius: 10px;"
                   "}"
                   "QPushButton:hover {"
                   " background-color: #E6E6FA;"           // Ligero fondo al pasar el mouse
                   "}"
                   "QPushButton:pressed {"
                   " background-color: #E6E6FA;"
                   "}"
    );
    ui->pBagregarusuario->setStyleSheet(
                "QPushButton {"
                   " background-color: transparent;"       // Sin fondo fuerte
                   " color: #2E2E2E;"                      // Letra negra o gris oscuro
                   " border: 2px solid #800080;"           // Morado suave
                   " font-weight: normal;"
                   "border-radius: 10px;"
                   "}"
                   "QPushButton:hover {"
                   " background-color: #E6E6FA;"           // Ligero fondo al pasar el mouse
                   "}"
                   "QPushButton:pressed {"
                   " background-color: #E6E6FA;"
                   "}"
    );

    ui->lbNresivo->setStyleSheet("border: 2px solid black; border-radius: 5px; padding: 4px;");
    ui->lbDniUsuario->setStyleSheet("border: 2px solid #5FA8D3; border-radius: 5px; padding: 4px;");
    ui->lbcpodigoUsuairo->setStyleSheet("border: 2px solid #5FA8D3; border-radius: 5px; padding: 4px;");
    ui->lbNombreApellido->setStyleSheet("border: 2px solid #5FA8D3; border-radius: 5px; padding: 4px;");
    ui->lbTipousuario->setStyleSheet("border: 2px solid #5FA8D3; border-radius: 5px; padding: 4px;");
    ui->lbCantidadTotal->setStyleSheet("border: 2px solid #A390BD; border-radius: 5px; padding: 4px;");
}

void newPrestamo::configurarTablaUsuarios(){
    ui->tWlistaUsuarios->setColumnCount(4);
    QStringList headers;
    headers << "DNI" << "Código" << "Apellidos y Nombres" << "Tipo de Usuario";
    ui->tWlistaUsuarios->setHorizontalHeaderLabels(headers);

    QHeaderView *header = ui->tWlistaUsuarios->horizontalHeader();
    header->setSectionResizeMode(QHeaderView::ResizeToContents);
    header->setStyleSheet(
        "QHeaderView::section {"
        "background-color: #f9f9f9;"
        "color: black;"
        "font-weight: 500;"
        "font-size: 8pt;"
        "padding: 5px;"
        "border: 1px solid lightgray;"
        "}"
    );
    header->setSectionResizeMode(QHeaderView::ResizeToContents);
}

void newPrestamo::cargarUsuarios(){
    ui->tWlistaUsuarios->setRowCount(0);
    // Estudiante
    NodoEstudiante *auxE= this->lestud->getCab();
    while (auxE != NULL) {
        Usuarios *user = auxE->getInfo();
        agregarFilaUsuarios(user);
        auxE = auxE->getSgte();
    }

    // Docente
    NodoDocente* auxD = this->ldoc->getCab();
    while (auxD != NULL) {
        Usuarios *user = auxD->getInfo();
        agregarFilaUsuarios(user);
        auxD = auxD->getSgte();
    }
}

// Función auxiliar de usuarios
void newPrestamo::agregarFilaUsuarios(Usuarios *user){
    int row = ui->tWlistaUsuarios->rowCount();
    ui->tWlistaUsuarios->insertRow(row);
    ui->tWlistaUsuarios->setItem(row, 0, new QTableWidgetItem(QString::fromStdString(user->getDni())));
    ui->tWlistaUsuarios->setItem(row, 1, new QTableWidgetItem(QString::fromStdString(user->getCodigo())));
    QString nombreCompleto = QString::fromStdString(user->getNombre() + ", " + user->getApellido());
    ui->tWlistaUsuarios->setItem(row, 2, new QTableWidgetItem(nombreCompleto));
    ui->tWlistaUsuarios->setItem(row, 3, new QTableWidgetItem(QString::fromStdString(user->getTipoUsuario())));
}

void newPrestamo::configurarTablaMateriales() {
    ui->twListaMateriales->setColumnCount(6);
    QStringList headers;
    headers << "Código" << "Título" << "Autor" << "Año de Publicación" << "Estado" << "Tipo de Material";
    ui->twListaMateriales->setHorizontalHeaderLabels(headers);

    QHeaderView* header = ui->twListaMateriales->horizontalHeader();
    header->setSectionResizeMode(QHeaderView::ResizeToContents);
    header->setStyleSheet(
        "QHeaderView::section {"
        "background-color: #f9f9f9;"
        "color: black;"
        "font-weight: 500;"
        "font-size: 8pt;"
        "padding: 5px;"
        "border: 1px solid lightgray;"
        "}"
    );
    header->setSectionResizeMode(QHeaderView::ResizeToContents);
}

void newPrestamo::cargarMateriales() {
    ui->twListaMateriales->setRowCount(0);
    NodoLibro* auxL = this->lLib->getCab();
    while (auxL != NULL) {
        MatBibliografico* mat = auxL->getInfo();
        agregarFilaMaterial(mat);
        auxL = auxL->getSgte();
    }
    NodoRevista* auxR = this->lrev->getCab();
    while (auxR != NULL) {
        MatBibliografico* mat = auxR->getInfo();
        agregarFilaMaterial(mat);
        auxR = auxR->getSgte();
    }
    NodoTesis* auxT = this->ltes->getCab();
    while (auxT != NULL) {
        MatBibliografico * mat = auxT->getInfo();
        agregarFilaMaterial(mat);
        auxT = auxT->getSgte();
    }
}

void newPrestamo::agregarFilaMaterial(MatBibliografico *mat){
    int row = ui->twListaMateriales->rowCount();
    ui->twListaMateriales->insertRow(row);
    ui->twListaMateriales->setItem(row, 0, new QTableWidgetItem(QString::fromStdString(mat->getCodigo())));
    ui->twListaMateriales->setItem(row, 1, new QTableWidgetItem(QString::fromStdString(mat->getTitulo())));
    ui->twListaMateriales->setItem(row, 2, new QTableWidgetItem(QString::fromStdString(mat->getAutor())));
    ui->twListaMateriales->setItem(row, 3, new QTableWidgetItem(QString::number(mat->getAnioPublicacion())));
    ui->twListaMateriales->setItem(row, 4, new QTableWidgetItem(QString::fromStdString(mat->getEstado())));
    ui->twListaMateriales->setItem(row, 5, new QTableWidgetItem(QString::fromStdString(mat->getTipoMaterial())));
}

void newPrestamo::mostrarDatosUsuarioSeleccionado(int row, int column)
{
    Q_UNUSED(column); // No nos importa qué columna se clicó

    QString dni       = ui->tWlistaUsuarios->item(row, 0)->text();
    QString codigo    = ui->tWlistaUsuarios->item(row, 1)->text();
    QString nombres   = ui->tWlistaUsuarios->item(row, 2)->text(); // Apellidos y Nombres
    QString tipo      = ui->tWlistaUsuarios->item(row, 3)->text();

    ui->lbDniUsuario->setText(dni);
    ui->lbcpodigoUsuairo->setText(codigo);
    ui->lbNombreApellido->setText(nombres);
    ui->lbTipousuario->setText(tipo);

    Usuarios* usuario = NULL;
    // Buscar el puntero del objeto original
    if((usuario = lestud->buscarPorCodigo(codigo.toStdString())) == NULL)
        usuario = ldoc->buscarPorCodigo(codigo.toStdString());
    if(usuario != NULL)
    this->usuarioSelec = usuario;
}

void newPrestamo::on_pBagregarlibro_clicked()
{
    // verifica que hay una fila seleccionada
    int filaSeleccionada = ui->twListaMateriales->currentRow();
    if(filaSeleccionada < 0){
        QMessageBox::warning(this, "Advertencia", "Selecciona un material para agregar.");
        return;
    }
    // Obtener los datos de la fila seleccionada
    QString codigo = ui->twListaMateriales->item(filaSeleccionada, 0)->text();
    QString titulo = ui->twListaMateriales->item(filaSeleccionada, 1)->text();
    QString autor = ui->twListaMateriales->item(filaSeleccionada, 2)->text();
    QString anio = ui->twListaMateriales->item(filaSeleccionada, 3)->text();
    QString tipo = ui->twListaMateriales->item(filaSeleccionada, 4)->text();

    // Verifica que no se repita el mismo material
    int filasDetalle = ui->tWdetallePrestamo->rowCount();
    for(int i = 0; i < filasDetalle; ++i){
        if(ui->tWdetallePrestamo->item(i, 0)->text() == codigo){
            QMessageBox::warning(this, "Advertencia", "Este material ya fue agregado.");
            return;
        }
    }
    // Insertar nueva fila en detalle de préstamo
    int nuevaFila = ui->tWdetallePrestamo->rowCount();
    ui->tWdetallePrestamo->insertRow(nuevaFila);

    ui->tWdetallePrestamo->setItem(nuevaFila, 0, new QTableWidgetItem(codigo));
    ui->tWdetallePrestamo->setItem(nuevaFila, 1, new QTableWidgetItem(titulo));
    ui->tWdetallePrestamo->setItem(nuevaFila, 2, new QTableWidgetItem(autor));
    ui->tWdetallePrestamo->setItem(nuevaFila, 3, new QTableWidgetItem(anio));
    ui->tWdetallePrestamo->setItem(nuevaFila, 4, new QTableWidgetItem(tipo));
    ui->tWdetallePrestamo->setItem(nuevaFila, 5, new QTableWidgetItem("1"));

    // Actualiza contador visual
    int totalLibros = ui->tWdetallePrestamo->rowCount();
    ui->lbCantidadTotal->setText(QString::number(totalLibros));

}

void newPrestamo::on_pBquitarLibro_clicked()
{
    int filaSeleccionada = ui->tWdetallePrestamo->currentRow();
    if(filaSeleccionada < 0){
        QMessageBox::information(this, "Quitar libro", "Selecciona una fila para eliminar.");
        return;
    }
    ui->tWdetallePrestamo->removeRow(filaSeleccionada);
    // Actualizar contador de libros
    int totalLibros = ui->tWdetallePrestamo->rowCount();
    ui->lbCantidadTotal->setText(QString::number(totalLibros));
}

void newPrestamo::on_pBguardasprestamo_clicked()
{
    if(this->usuarioSelec == NULL){
        QMessageBox::warning(this, "Error", "Debe seleccionar un usuario.");
        return;
    }
    int totalFilas = ui->tWdetallePrestamo->rowCount();
    if(totalFilas == 0){
        QMessageBox::warning(this, "Error", "Debe agregar al menos un material.");
        return;
    }
    actualizarCodigoGlobal();
    Prestamo *nuevoPrestamo = new Prestamo();
    nuevoPrestamo->setUsser(this->usuarioSelec);
    nuevoPrestamo->setFechaPrestamo(ui->dEdevolucion->date().toString("yyyy-MM-dd").toStdString());
    nuevoPrestamo->setFechaLimite(ui->dElimite->date().toString("yyyy-MM-dd").toStdString());
    nuevoPrestamo->setEstado('V');

    ListaMaterialesPrestados *lista = new ListaMaterialesPrestados();
    for (int i = 0; i < totalFilas; i++) {
        if(ui->tWdetallePrestamo->item(i, 0) == NULL)
            break;
        QString codQ = ui->tWdetallePrestamo->item(i, 0)->text();
        string cod = codQ.toStdString();

        MatBibliografico *mat = NULL;
        mat = lLib->buscarPorCodigo(cod);
        if (mat == NULL)
            mat = lrev->buscarPorCodigo(cod);
        if (mat == NULL)
            mat = ltes->buscarPorCodigo(cod);

        if (mat != NULL) {
            mat->setEstado("Prestado");
            lista->insertarMaterialesPres(mat);
        } else {
            QMessageBox::warning(this, "Error", "No se encontró el material con código: " + codQ);
            delete lista;
            return;
        }
    }
    nuevoPrestamo->setMaterial(lista);
    this->lPres->insertarPrestamo(nuevoPrestamo);
    this->lPres->guardarPrestamos(nuevoPrestamo);
    nuevoPrestamo->getMaterial()->guardarEnArchivo(nuevoPrestamo->getCodigo());
    QMessageBox::information(this, "Exito", "Préstamo registrado correctamente.");

}

void newPrestamo::on_pBnuevoprestamo_clicked()
{
    Prestamo *pTemp = new Prestamo();
    ui->lbNresivo->setText(QString::fromStdString(pTemp->getCodigo()));
    delete pTemp;
    Prestamo::setCodigoP(Prestamo::getCodigoP() - 1);

    int totalFilas = ui->tWdetallePrestamo->rowCount();
    quitarUsuarioSeleccionado();
    quitarMaterialSeleccionado(totalFilas);

    limpiarInterfazPrestamo();
}

void newPrestamo::quitarUsuarioSeleccionado(){
    if(this->usuarioSelec == NULL){
        return;
    }
    QString codUsuario = QString::fromStdString(usuarioSelec->getCodigo());
    int filasUsu = ui->tWlistaUsuarios->rowCount();
    for (int i = 0; i < filasUsu; ++i) {
        if (ui->tWlistaUsuarios->item(i, 1)->text() == codUsuario) {
            ui->tWlistaUsuarios->removeRow(i);
            break;
        }
    }
}

void newPrestamo::quitarMaterialSeleccionado(int totalFilas){
    for (int i = 0; i < totalFilas; ++i) {
        QString cod = ui->tWdetallePrestamo->item(i, 0)->text();
        int filas = ui->twListaMateriales->rowCount();
        for (int j = 0; j < filas; ++j) {
            if (ui->twListaMateriales->item(j, 0)->text() == cod) {
                ui->twListaMateriales->removeRow(j);
                break; // importante: una vez eliminado, salir
            }
        }
    }
}

void newPrestamo::limpiarInterfazPrestamo()
{
    ui->lbDniUsuario->clear();
    ui->lbcpodigoUsuairo->clear();
    ui->lbNombreApellido->clear();
    ui->lbTipousuario->clear();

    ui->tWdetallePrestamo->setRowCount(0);

    ui->lbCantidadTotal->setText("0");

    this->usuarioSelec = NULL;

    ui->dEdevolucion->setDate(QDate::currentDate());
    ui->dElimite->setDate(QDate::currentDate().addDays(7));
}

void newPrestamo::on_pbverprestamo_clicked()
{
    verPrestamos *ventana = new verPrestamos(this);
        ventana->setLPres(this->lPres);
        ventana->setLEstu(this->lestud);
        ventana->setLDoc(this->ldoc);
        ventana->setLLib(this->lLib);
        ventana->setLRev(this->lrev);
        ventana->setLTes(this->ltes);
        ventana->iniciarListado();
        ventana->exec();
}

void newPrestamo::on_pBcerrar_clicked()
{
    this->close();
}

void newPrestamo::on_pBagregarusuario_clicked()
{
    newEstudiante *ne = new newEstudiante();
    ne->setModal(true);
    ne->show();
}

void newPrestamo::on_pbCancelarPrestamo_clicked()
{
    limpiarInterfazPrestamo();
}

void newPrestamo::buscarUsuarioPorDni(const QString &dniBuscado) {
    ui->tWlistaUsuarios->setRowCount(0); // Limpiar tabla
    NodoEstudiante* auxE = this->lestud->getCab();
    while (auxE != NULL) {
        Usuarios *user = auxE->getInfo();
        if (QString::fromStdString(user->getDni()).startsWith(dniBuscado)) {
            agregarFilaUsuarios(user);
        }
        auxE = auxE->getSgte();
    }
    NodoDocente* auxD = this->ldoc->getCab();
    while (auxD != NULL) {
        Usuarios *user = auxD->getInfo();
        if (QString::fromStdString(user->getDni()).startsWith(dniBuscado)) {
            agregarFilaUsuarios(user);
        }
        auxD = auxD->getSgte();
    }
}

void newPrestamo::buscarMaterialPorAutor(const QString &autorBuscado){
    ui->twListaMateriales->setRowCount(0);
    NodoLibro* auxL = lLib->getCab();
    while (auxL != NULL) {
        MatBibliografico* mat = auxL->getInfo();
        if (QString::fromStdString(mat->getAutor()).contains(autorBuscado, Qt::CaseInsensitive)) {
            agregarFilaMaterial(mat);
        }
        auxL = auxL->getSgte();
    }
    NodoRevista* auxR = lrev->getCab();
    while (auxR != NULL) {
        MatBibliografico* mat = auxR->getInfo();
        if (QString::fromStdString(mat->getAutor()).contains(autorBuscado, Qt::CaseInsensitive)) {
            agregarFilaMaterial(mat);
        }
        auxR = auxR->getSgte();
    }
    NodoTesis* auxT = ltes->getCab();
    while (auxT != NULL) {
        MatBibliografico* mat = auxT->getInfo();
        if (QString::fromStdString(mat->getAutor()).contains(autorBuscado, Qt::CaseInsensitive)) {
            agregarFilaMaterial(mat);
        }
        auxT = auxT->getSgte();
    }
}

void newPrestamo::on_pbconsultarReservas_clicked()
{
    verReserva *ventana = new verReserva(this);
    ventana->setLreser(this->lReser);
    ventana->setVentanPres(this);
    ventana->iniciarListado();
    ventana->exec();
}

void newPrestamo::actualizarCodigoGlobal(){
    string archivos[] = { "..\\Prestamos.txt"};
    int maxCodigo = 0;
    for(int i = 0; i < 1; ++i){
        ifstream archivo(archivos[i].c_str());
        string linea, codigo;
        while(getline(archivo, linea)){
            stringstream ss(linea);
            getline(ss, codigo, limite);  // extrae solo el codigo
            if(codigo.size() > 1){
                int num = atoi(codigo.substr(1).c_str());
                if (num > maxCodigo) {
                    maxCodigo = num;
                }
            }
        }
        archivo.close();
    }
    Prestamo::setCodigoP(maxCodigo + 1);
}

`;