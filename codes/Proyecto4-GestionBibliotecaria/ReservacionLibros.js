var CODE_04_RL = `

#include "newreservas.h"
#include "ui_newreservas.h"
#include <QString>
#include <QMessageBox>
#include <QTimer>
#include <QTime>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include "listarusuarios.h"
#include "verreserva.h"

const char limite = '%';

newReservas::newReservas(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::newReservas)
{
    this->lLib = new ListaLibro();
    this->lrev = new ListaRevista;
    this->ltes = new ListaTesis();
    this->lr = new ListaReservas();
    this->userSelec = NULL;
    this->lestud = new ListaEstudiante();
    this->ldoce = new ListaDocente();

    ui->setupUi(this);

    Reserva *rtemp = new Reserva();
    ui->txtnumReserva->setText(QString::fromStdString(rtemp->getCodigo()));
    delete rtemp;
    Reserva::setCodigoR(Reserva::getCodigoR() - 1 );

    this->lLib->recuperarLibros();
    this->lrev->recuperarRevista();
    this->ltes->recuperarTesis();

    ui->dtfechareserva->setDate(QDate::currentDate());
    ui->dtfechalimiteretiro->setDate(QDate::currentDate().addDays(4));

    configuraciondeTablaMateriales();
    configuraciondeTabla();
    configuracionInterfaz();

    cargarMateriales();

    connect(ui->txtbuscarmateriales, &QLineEdit::textChanged,
            this, &newReservas::buscarMaterialPorAutor);

}

newReservas::~newReservas()
{
    delete ui;
}

ListaLibro *newReservas::getLLib() const
{
    return lLib;
}

void newReservas::setLLib(ListaLibro *value)
{
    lLib = value;
}
ListaRevista *newReservas::getLrev() const
{
    return lrev;
}

void newReservas::setLrev(ListaRevista *value)
{
    lrev = value;
}
ListaTesis *newReservas::getLtes() const
{
    return ltes;
}

void newReservas::setLtes(ListaTesis *value)
{
    ltes = value;
}

ListaReservas *newReservas::getLr() const
{
    return lr;
}

void newReservas::setLr(ListaReservas *value)
{
    lr = value;
}

Usuarios *newReservas::getUserSelec() const
{
    return userSelec;
}

void newReservas::setUserSelec(Usuarios *value)
{
    userSelec = value;
}

Administrativo *newReservas::getAdminLog() const
{
    return adminLog;
}

void newReservas::setAdminLog(Administrativo *value)
{
    adminLog = value;
    QString nombreCompleto = QString::fromStdString(adminLog->getNombre() + " " + adminLog->getApellido());
    ui->txtrecepcionista->setText(nombreCompleto);
}

ListaDocente *newReservas::getLdoce() const
{
    return ldoce;
}

void newReservas::setLdoce(ListaDocente *value)
{
    ldoce = value;
}

ListaEstudiante *newReservas::getLestud() const
{
    return lestud;
}

void newReservas::setLestud(ListaEstudiante *value)
{
    lestud = value;
}

void newReservas::configuracionInterfaz(){
    ui->txtDNI->setStyleSheet("border: 2px solid #32CD32; border-radius: 5px; padding: 4px;");
    ui->txtgenero->setStyleSheet("border: 2px solid #32CD32; border-radius: 5px; padding: 4px;");
    ui->txtcodigo->setStyleSheet("border: 2px solid #32CD32; border-radius: 5px; padding: 4px;");
    ui->txtcorreo->setStyleSheet("border: 2px solid #32CD32; border-radius: 5px; padding: 4px;");
    ui->txtapellidoynombres->setStyleSheet("border: 2px solid #32CD32; border-radius: 5px; padding: 4px;");
    ui->txtescualea->setStyleSheet("border: 2px solid #0000FF; border-radius: 5px; padding: 4px;");
    ui->txtnumReserva->setStyleSheet("border: 2px solid #4c2882; border-radius: 5px; padding: 4px;");
    ui->txtrecepcionista->setStyleSheet("border: 2px solid #00008B; border-radius: 5px; padding: 4px;");
    ui->txtTipodeusuario->setStyleSheet("border: 2px solid #0000FF; border-radius: 5px; padding: 4px;");

    ui->gBdatosMateriales->setStyleSheet(
        "QGroupBox {"
        " background-color: #FFFFC5;"
        " border: 2px solid #FFFF00;"
        " border-radius: 10px;"
        " padding: 10px;"
        " margin-top: 20px;"
        "}"
    );

    ui->label->setStyleSheet("QLabel {"
                             "border: 2px solid #000000;"  // Amarillo fuerte (dorado)
                             "border-radius: 8px;"         // Bordes redondeados (opcional)
                             "padding: 6px;"               // Espaciado interno
                             "}");
}

void newReservas::configuraciondeTablaMateriales(){
    ui->twlistamateriales->setColumnCount(8);
    QStringList materiales;
    materiales << "Código" << "Título" << "Autor" << "Año de Publicación"
               << "Editorial" << "Estado" << "Tipo de Material" << "Cantidad" ;
    ui->twlistamateriales->setHorizontalHeaderLabels(materiales);


    QHeaderView *encabezaMat = ui->twlistamateriales->horizontalHeader();
    encabezaMat->setDefaultAlignment(Qt::AlignHCenter | Qt::AlignVCenter);
    encabezaMat->setStyleSheet(
        "QHeaderView::section {"
        "background-color: #f9f9f9;"
        "color: black;"
        "font-weight: 500;"
        "font-size: 8pt;"
        "padding: 5px;"
        "border: 1px solid lightgray;"
        "}"
    );
    encabezaMat->setSectionResizeMode(QHeaderView::ResizeToContents);
}


void newReservas::cargarMateriales(){
    ui->twlistamateriales->setRowCount(0);
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

void newReservas::agregarFilaMaterial(MatBibliografico *mat){
    int row = ui->twlistamateriales->rowCount();
    ui->twlistamateriales->insertRow(row);
    ui->twlistamateriales->setItem(row, 0, new QTableWidgetItem(QString::fromStdString(mat->getCodigo())));
    ui->twlistamateriales->setItem(row, 1, new QTableWidgetItem(QString::fromStdString(mat->getTitulo())));
    ui->twlistamateriales->setItem(row, 2, new QTableWidgetItem(QString::fromStdString(mat->getAutor())));
    ui->twlistamateriales->setItem(row, 3, new QTableWidgetItem(QString::number(mat->getAnioPublicacion())));
    ui->twlistamateriales->setItem(row, 4, new QTableWidgetItem(QString::fromStdString(mat->getEditorial())));
    ui->twlistamateriales->setItem(row, 5, new QTableWidgetItem(QString::fromStdString(mat->getEstado())));
    ui->twlistamateriales->setItem(row, 6, new QTableWidgetItem(QString::fromStdString(mat->getTipoMaterial())));
    ui->twlistamateriales->setItem(row, 7, new QTableWidgetItem("1"));
}

void newReservas::buscarMaterialPorAutor(const QString &autorBuscado){
    ui->twlistamateriales->setRowCount(0);
    NodoLibro* auxL = this->lLib->getCab();
    while (auxL != NULL) {
        MatBibliografico *mat = auxL->getInfo();
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

void newReservas::configuraciondeTabla(){
    ui->twreservas->setColumnCount(6);
    QStringList materiales;
    materiales << "Código" << "Título" << "Autor" << "Año de Publicación" << "Tipo de Material" << "Cantidad";
    ui->twreservas->setHorizontalHeaderLabels(materiales);

    QHeaderView *encabezaRes = ui->twreservas->horizontalHeader();
    encabezaRes->setDefaultAlignment(Qt::AlignHCenter | Qt::AlignVCenter);
    encabezaRes->setStyleSheet(
        "QHeaderView::section {"
        "background-color: #f9f9f9;"
        "color: black;"
        "font-weight: 500;"
        "font-size: 8pt;"
        "padding: 5px;"
        "border: 1px solid lightgray;"
        "}"
    );
    encabezaRes->setSectionResizeMode(QHeaderView::ResizeToContents);
}

void newReservas::on_pBagregarMaterial_clicked()
{
    int filaSeleccionada = ui->twlistamateriales->currentRow();
    if(filaSeleccionada < 0){
        QMessageBox::warning(this, "Advertencia", "Selecciona un material para agregar.");
        return;
    }
    QString codigo = ui->twlistamateriales->item(filaSeleccionada, 0)->text();
    QString titulo = ui->twlistamateriales->item(filaSeleccionada, 1)->text();
    QString autor = ui->twlistamateriales->item(filaSeleccionada, 2)->text();
    QString anio = ui->twlistamateriales->item(filaSeleccionada, 3)->text();
    QString tipo = ui->twlistamateriales->item(filaSeleccionada, 4)->text();

    int filasDetalle = ui->twreservas->rowCount();
    for(int i = 0; i < filasDetalle; ++i){
        if(ui->twreservas->item(i, 0)->text() == codigo){
            QMessageBox::warning(this, "Advertencia", "Este material ya fue agregado.");
            return;
        }
    }
    int nuevaFila = ui->twreservas->rowCount();
    ui->twreservas->insertRow(nuevaFila);
    ui->twreservas->setItem(nuevaFila, 0, new QTableWidgetItem(codigo));
    ui->twreservas->setItem(nuevaFila, 1, new QTableWidgetItem(titulo));
    ui->twreservas->setItem(nuevaFila, 2, new QTableWidgetItem(autor));
    ui->twreservas->setItem(nuevaFila, 3, new QTableWidgetItem(anio));
    ui->twreservas->setItem(nuevaFila, 4, new QTableWidgetItem(tipo));
    ui->twreservas->setItem(nuevaFila, 5, new QTableWidgetItem("1"));

    int totalLibros = ui->twreservas->rowCount();
    ui->txtcantidadTotal->setText(QString::number(totalLibros));
}

void newReservas::on_pBquitarMaterial_clicked()
{
    int filaSeleccionada = ui->twreservas->currentRow();
    if(filaSeleccionada < 0){
        QMessageBox::information(this, "Quitar libro", "Selecciona una fila para eliminar.");
        return;
    }
    ui->twreservas->removeRow(filaSeleccionada);
    int totalLibros = ui->twreservas->rowCount();
    ui->txtcantidadTotal->setText(QString::number(totalLibros));

}

void newReservas::DatosUsuarioDesdeListado(QString cod, QString nom, QString ape,
                                              QString dni, QString genero, QString correo,
                                              QString tipo, QString escuelaOFacu)
{
    ui->txtcodigo->setText(cod);
    ui->txtapellidoynombres->setText(nom + " " + ape);
    ui->txtDNI->setText(dni);
    ui->txtgenero->setText(genero);
    ui->txtcorreo->setText(correo);
    ui->txtTipodeusuario->setText(tipo);
    ui->txtescualea->setText(escuelaOFacu);
    if (tipo == "Estudiante"){
        userSelec = this->lestud->buscarPorCodigo(cod.toStdString());
    }else if(tipo == "Docente"){
        userSelec = this->ldoce->buscarPorCodigo(cod.toStdString());
     }
}

void newReservas::on_pBbuscarUsuario_clicked()
{
    ListarUsuarios* ventanaUser = new ListarUsuarios(this);
    ventanaUser->setLEstu(this->lestud);
    ventanaUser->setLDoc(this->ldoce);
    ventanaUser->setRes(this);
    ventanaUser->exec();
}


void newReservas::on_pBreservasmaterial_clicked()
{
    if(this->userSelec == NULL){
        QMessageBox::warning(this, "Error", "Debe seleccionar un usuario.");
        return;
    }

    int totalFilas = ui->twreservas->rowCount();
        if (totalFilas == 0) {
            QMessageBox::warning(this, "Advertencia", "Debe agregar al menos un material.");
            return;
    }
    actualizarCodigoGlobal();
    ListaMaterialesReservados *lista = new ListaMaterialesReservados();
    for(int i = 0; i < totalFilas; ++i){
        QString cod = ui->twreservas->item(i, 0)->text();
        MatBibliografico *mat = NULL;
        mat = lLib->buscarPorCodigo(cod.toStdString());
        if(mat == NULL)
            mat = lrev->buscarPorCodigo(cod.toStdString());
        if(mat == NULL)
            mat = ltes->buscarPorCodigo(cod.toStdString());

        if(mat != NULL) {
            lista->insertarMaterialesReser(mat);
            mat->setEstado("Reservado"); // Cambiar estado del material
        }else{
            QMessageBox::warning(this, "Error", "No se encontró el material con código: " + cod);
            delete lista;
            return;
        }
    }
    Reserva *reser = new Reserva();
    reser->setFechaReserva(ui->dtfechareserva->date().toString("yyyy-MM-dd").toStdString());
    reser->setFechaLimiteRetiro(ui->dtfechalimiteretiro->date().toString("yyyy-MM-dd").toStdString());
    reser->setEstado("Reservado");
    reser->setUsuario(this->userSelec);
    reser->setMaterial(lista);
    reser->setRecepcionista(ui->txtrecepcionista->text().toStdString());

    this->lr->insertarReserva(reser);
    this->lr->guardarReservas(reser);
    reser->getMaterial()->guardarEnArchivo(reser->getCodigo());

    QMessageBox::information(this, "Éxito", "Reserva guardada correctamente.");

    limpiarInterfazReserva();

    Reserva *temp = new Reserva();
    ui->txtnumReserva->setText(QString::fromStdString(temp ->getCodigo()));
    delete temp ;
    Reserva::setCodigoR(Reserva::getCodigoR() - 1);

}


/*void newReservas::quitarMaterialSeleccionado(int totalFilas){
    for (int i = 0; i < totalFilas; ++i) {
        QString cod = ui->twlistamateriales->item(i, 0)->text();
        int filas = ui->twlistamateriales->rowCount();
        for (int j = 0; j < filas; ++j) {
            if (ui->twlistamateriales->item(j, 0)->text() == cod) {
                ui->twlistamateriales->removeRow(j);
                break;
            }
        }
    }
}*/

void newReservas::limpiarInterfazReserva()
{
    ui->txtDNI->clear();
    ui->txtcodigo->clear();
    ui->txtapellidoynombres->clear();
    ui->txtcorreo->clear();
    ui->txtescualea->clear();
    ui->txtTipodeusuario->clear();
    ui->txtgenero->clear();

    ui->twreservas->setRowCount(0);
    ui->txtcantidadTotal->setText("0");

    userSelec = NULL;

    ui->dtfechareserva->setDate(QDate::currentDate());
    ui->dtfechalimiteretiro->setDate(QDate::currentDate().addDays(3));
}



void newReservas::on_pushButton_6_clicked()
{
    verReserva *vr = new verReserva();
    vr->setLreser(this->lr);
    vr->iniciarListado();
    vr->setModal(true);
    vr->exec();
}

void newReservas::on_cancelarReserva_clicked()
{
    limpiarInterfazReserva();
}

void newReservas::actualizarCodigoGlobal(){
    string archivos[] = { "..\\Reservas.txt"};
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
    Reserva::setCodigoR(maxCodigo + 1);
}

`;