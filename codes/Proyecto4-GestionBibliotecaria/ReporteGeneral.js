var CODE_04_RG = `

#include "reportes.h"
#include "ui_reportes.h"

Reportes::Reportes(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Reportes)
{
    this->lEstu= new ListaEstudiante;
    this->lDoc= new ListaDocente;
    this->lAdmin= new ListaAdministrativo;
    this->lLib= new ListaLibro;
    this->lRev = new ListaRevista;
    this->lTes = new ListaTesis;
    ui->setupUi(this);

    ui->cbReportes->setCurrentIndex(0);
    ui->stackedTablas->setCurrentIndex(-1);

    ui->twTGeneral->setColumnWidth(0,250);
    ui->twTGeneral->setColumnWidth(1,100);


    ui->twUsuarioss->setColumnWidth(1, 220 );
    ui->twUsuarioss->setColumnWidth(2, 220 );
    ui->twUsuarioss->setColumnWidth(3, 100 );
    ui->twUsuarioss->setColumnWidth(4, 220 );
    ui->twUsuarioss->setColumnWidth(5, 200 );


    ui->twMaterial->setColumnWidth(1,220);
    ui->twMaterial->setColumnWidth(2,220);
    ui->twMaterial->setColumnWidth(3,150);
    ui->twMaterial->setColumnWidth(4,150);


    ui->twEstados->setColumnWidth(1,250);
    ui->twEstados->setColumnWidth(2,150);
    ui->twEstados->setColumnWidth(3,150);
    ui->twEstados->setColumnWidth(4,150);

    ui->twMultass->setColumnWidth(0,150);
    ui->twMultass->setColumnWidth(1,150);
    ui->twMultass->setColumnWidth(2,150);
    ui->twMultass->setColumnWidth(3,150);
    ui->twMultass->setColumnWidth(4,150);
    ui->twMultass->setColumnWidth(5,150);
    ui->twMultass->setColumnWidth(6,150);
    ui->twMultass->setColumnWidth(7,150);
    ui->twMultass->setColumnWidth(8,150);


    //mostrarReporteGeneral();
    //mostrarListaUsuarios();
    //mostrarListaMateriales();
    //mostrarEstadoMateriales();
    ConfiInterfaz();
}

Reportes::~Reportes()
{
    delete ui;
}
ListaDocente *Reportes::getLDoc() const
{
    return lDoc;
}

void Reportes::setLDoc(ListaDocente *value)
{
    lDoc = value;
}
ListaEstudiante *Reportes::getLEstu() const
{
    return lEstu;
}

void Reportes::setLEstu(ListaEstudiante *value)
{
    lEstu = value;
}
ListaAdministrativo *Reportes::getLAdmin() const
{
    return lAdmin;
}

void Reportes::setLAdmin(ListaAdministrativo *value)
{
    lAdmin = value;
}
ListaLibro *Reportes::getLLib() const
{
    return lLib;
}

void Reportes::setLLib(ListaLibro *value)
{
    lLib = value;
}
ListaRevista *Reportes::getLRev() const
{
    return lRev;
}

void Reportes::setLRev(ListaRevista *value)
{
    lRev = value;
}
ListaTesis *Reportes::getLTes() const
{
    return lTes;
}

void Reportes::setLTes(ListaTesis *value)
{
    lTes = value;
}

void Reportes:: ConfiInterfaz(){

    ui->cbReportes->setStyleSheet(
        "QComboBox {"
        "  background-color: white;"
        "  border: 2px solid #5A5A5A;"
        "  border-radius: 6px;"
        "  padding: 4px 8px;"
        "  font-size: 13px;"
        "  font-family: Segoe UI;"
        "}"
        "QComboBox QAbstractItemView {"
        "  background-color: #f0f0f0;"
        "  selection-background-color: #d0d0ff;"
        "  border: 1px solid gray;"
        "}"
    );

    ui->lblReporte->setStyleSheet("color: #1a237e; font-size: 20px; font-weight: bold; font-family: Segoe UI;");
    ui->lblBiblioteca->setStyleSheet("color: #333333; font-size: 14px; font-weight: bold;");
    ui->lblNombreUni->setStyleSheet("color: #555555; font-size: 12px;");
    ui->lblSeleccion->setStyleSheet("font-size: 13px; font-family: Segoe UI;");

    this->setStyleSheet("QDialog { background-color: #f5f6fa; }");

    ui->twTGeneral->setStyleSheet("QTableWidget {"
                                  " background-color: white;"
                                  " alternate-background-color: #f5f5f5;"
                                  " gridline-color: #cccccc;"
                                  " font: 12px 'Segoe UI';"
                                  " border: 1px solid #dcdcdc;"
                                  "}"
                                  "QHeaderView::section {"
                                  " background-color: #4682B4;"
                                  " color: white;"
                                  " font-weight: bold;"
                                  " font-size: 13px;"
                                  " padding: 6px;"
                                  " border: 1px solid #ccc;"
                                  "}"
                                  "QTableWidget::item:selected {"
                                  " background-color: #CDE4FF;"
                                  " color: black;"
                                  "}");

}



void Reportes::on_cbReportes_currentIndexChanged(int index)
{
    if (index == 0) {
           ui->stackedTablas->setCurrentIndex(-1); // No mostrar ninguna tabla
           ui->twTGeneral->clearContents();     // Borra los datos
           ui->twTGeneral->setRowCount(0);      // Cero filas
           ui->twTGeneral->setColumnCount(0);   //  borra también columnas
           ui->twTGeneral->setHorizontalHeaderLabels(QStringList()); // Borra los títulos
           return;
       }

       ui->stackedTablas->setCurrentIndex(index-1);
       switch (index) {
         case 1: mostrarReporteGeneral(); break;
         case 2: mostrarUsuariosConMulta(); break;
         case 3: mostrarListaUsuarios(); break;
         case 4: mostrarListaMateriales(); break;
         case 5: mostrarEstadoMateriales(); break;
       default: break;
       }

}
ListaMultas *Reportes::getLMul() const
{
    return lMul;
}

void Reportes::setLMul(ListaMultas *value)
{
    lMul = value;
}


void Reportes::insertarEnTabla(QString descripcion, int valor) {
    int fila = ui->twTGeneral->rowCount();
    ui->twTGeneral->insertRow(fila);
    ui->twTGeneral->setItem(fila, 0, new QTableWidgetItem(descripcion));
    ui->twTGeneral->setItem(fila, 1, new QTableWidgetItem(QString::number(valor)));
}

void Reportes :: mostrarReporteGeneral(){
    this->lEstu->recuperarEstudiantes();
    this->lDoc->recuperarDocentes();
    this->lLib->recuperarLibros();
    this->lRev->recuperarRevista();
    this->lTes->recuperarTesis();
    int totalUsuarios = 0, estudiantes = 0, docentes = 0, administrativos = 0;
        int totalMat = 0, libros = 0, revistas = 0, tesis = 0, disponibles = 0, reservados = 0;

        // Contar estudiantes
        NodoEstudiante* nE = this->lEstu->getCab();
        while (nE) {
            Estudiante* es = nE->getInfo();
            estudiantes++;
            totalUsuarios++;
            nE = nE->getSgte();
        }

        // Contar docentes
        NodoDocente* nD = this->lDoc->getCab();
        while (nD) {
            Docente* doc = nD->getInfo();
            docentes++;
            totalUsuarios++;
            nD = nD->getSgte();
        }

        // Contar administrativos
        NodoAdministrativo* nA = this->lAdmin->getCab();
        while (nA) {
            Administrativo* admin = nA->getInfo();
            administrativos++;
            totalUsuarios++;
            nA = nA->getSgte();
        }

        // Contar libros
        NodoLibro* nl = this->lLib->getCab();
        while (nl) {
            Libro* l = nl->getInfo();
            libros++;
            totalMat++;
            if (l->getEstado() == "Disponible") disponibles++;
            else reservados++;
            nl = nl->getSgte();
        }

        // Contar revistas
        NodoRevista* nr = this->lRev->getCab();
        while (nr) {
            Revista* r = nr->getInfo();
            revistas++;
            totalMat++;
            if (r->getEstado() == "Disponible") disponibles++;
            else reservados++;
            nr = nr->getSgte();
        }

        // Contar tesis
        NodoTesis* nt = this->lTes->getCab();
        while (nt) {
            Tesis* t = nt->getInfo();
            tesis++;
            totalMat++;
            if (t->getEstado() == "Disponible") disponibles++;
            else reservados++;
            nt = nt->getSgte();
        }

        // Mostrar en la tabla
        ui->twTGeneral->setRowCount(0);
            ui->twTGeneral->setColumnCount(2);
            QStringList headers;
            headers << "Descripción" << "Valor";
            ui->twTGeneral->setHorizontalHeaderLabels(headers);

            // Insertar en tabla
            insertarEnTabla("Total de usuarios", totalUsuarios);
            insertarEnTabla("Estudiantes", estudiantes);
            insertarEnTabla("Docentes", docentes);
            insertarEnTabla("Administrativos", administrativos);
            insertarEnTabla("Total de materiales", totalMat);
            insertarEnTabla("Libros", libros);
            insertarEnTabla("Revistas", revistas);
            insertarEnTabla("Tesis", tesis);
            insertarEnTabla("Disponibles", disponibles);
            insertarEnTabla("Reservados", reservados);
        }


void Reportes::mostrarUsuariosConMulta() {
    ui->twMultass->clear();
    ui->twMultass->setColumnCount(9);
    QStringList headers ;
    headers << "Código Usuario" << "Codigo Multa"<< "Usuario" << "Codigo Material"<< "Fecha limite"
            << "Fecha Devolucion" << "Dias retrasos" <<"Monto (S/.)" << "Fecha generada";
    ui->twMultass->setHorizontalHeaderLabels(headers);

    int fila = 0;
    NodoMulta* auxMult = lMul->getCab();
    while (auxMult != NULL) {
        Multa* mult = auxMult->getInfo();
        Usuarios *usser = mult->getUsuario();
        int codigoMaterial=  mult->getDevolucion()->getPrest()->getMaterial()->getCab()->getInfo()->getCodigoM();
        Devolucion *dev = mult->getDevolucion();
        Prestamo *pres= mult->getDevolucion()->getPrest();
        ui->twMultass->insertRow(fila);

        QString codigo = QString::number(mult->getCodigoMulta());
        QString nombre = QString::fromStdString(mult->getUsuario()->getNombre());
        QString fecha = QString::fromStdString(mult->getFechaGenerada());
        QString dias = QString::number(mult->getDiasRetraso());
        QString monto = QString::number(mult->getMonto(), 'f', 2);
        QString codigoU = QString::number(usser->getCodigoU());
        QString codigoM = QString::number(mult->getDevolucion()->getPrest()->getMaterial()->getCab()->getInfo()->getCodigoM());
        QString fechaLimite = QString::fromStdString(pres->getFechaLimite());
        QString fechaDevolucion = QString::fromStdString(dev->getFechaDevolucion());

        ui->twMultass->setItem(fila, 0, new QTableWidgetItem(codigo));
        ui->twMultass->setItem(fila, 1, new QTableWidgetItem(nombre));
        ui->twMultass->setItem(fila, 2, new QTableWidgetItem(fecha));
        ui->twMultass->setItem(fila, 3, new QTableWidgetItem(dias));
        ui->twMultass->setItem(fila, 4, new QTableWidgetItem(monto));
        ui->twMultass->setItem(fila, 5, new QTableWidgetItem(codigoU));
        ui->twMultass->setItem(fila, 6, new QTableWidgetItem(codigoM));
        ui->twMultass->setItem(fila, 7, new QTableWidgetItem(fechaLimite));
        ui->twMultass->setItem(fila, 8, new QTableWidgetItem(fechaDevolucion));
        fila++;

        auxMult = auxMult->getSgte();
    }

    ui->twMultass->resizeColumnsToContents();
}






void Reportes:: mostrarListaUsuarios(){
        ui->twUsuarioss->clearContents();
        ui->twUsuarioss->setRowCount(0);
        ui->twUsuarioss->setColumnCount(6);
        QStringList headers;
        headers << "Codigo" << "Nombres" << "Apellidos" << "DNI" << "Correo" << "Tipo Usuario";
        ui->twUsuarioss->setHorizontalHeaderLabels(headers);

        int fila = 0;

           // Estudiantes
           NodoEstudiante *nE = this->lEstu->getCab();
           while (nE != NULL) {
               Estudiante *es = nE->getInfo();
               ui->twUsuarioss->insertRow(fila);
               ui->twUsuarioss->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(es->getCodigo())));
               ui->twUsuarioss->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(es->getNombre())));
               ui->twUsuarioss->setItem(fila, 2, new QTableWidgetItem(QString::fromStdString(es->getApellido())));
               ui->twUsuarioss->setItem(fila, 3, new QTableWidgetItem(QString::fromStdString(es->getDni())));
               ui->twUsuarioss->setItem(fila, 4, new QTableWidgetItem(QString::fromStdString(es->getCorreo())));
               ui->twUsuarioss->setItem(fila, 5, new QTableWidgetItem("Estudiante"));
               fila++;
               nE = nE->getSgte();
           }

           // Docentes
           NodoDocente *nD = this->lDoc->getCab();
           while (nD != NULL) {
               Docente *doc = nD->getInfo();
               ui->twUsuarioss->insertRow(fila);
               ui->twUsuarioss->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(doc->getCodigo())));
               ui->twUsuarioss->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(doc->getNombre())));
               ui->twUsuarioss->setItem(fila, 2, new QTableWidgetItem(QString::fromStdString(doc->getApellido())));
               ui->twUsuarioss->setItem(fila, 3, new QTableWidgetItem(QString::fromStdString(doc->getDni())));
               ui->twUsuarioss->setItem(fila, 4, new QTableWidgetItem(QString::fromStdString(doc->getCorreo())));
               ui->twUsuarioss->setItem(fila, 5, new QTableWidgetItem("Docente"));
               fila++;
               nD = nD->getSgte();
           }

           // Administrativos
           NodoAdministrativo *nA = this->lAdmin->getCab();
           while (nA != NULL) {
               Administrativo *admin = nA->getInfo();
               ui->twUsuarioss->insertRow(fila);
               ui->twUsuarioss->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(admin->getCodigo())));
               ui->twUsuarioss->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(admin->getNombre())));
               ui->twUsuarioss->setItem(fila, 2, new QTableWidgetItem(QString::fromStdString(admin->getApellido())));
               ui->twUsuarioss->setItem(fila, 3, new QTableWidgetItem(QString::fromStdString(admin->getDni())));
               ui->twUsuarioss->setItem(fila, 4, new QTableWidgetItem(QString::fromStdString(admin->getCorreo())));
               ui->twUsuarioss->setItem(fila, 5, new QTableWidgetItem("Administrativo"));
               fila++;
               nA = nA->getSgte();
           }

}


void Reportes:: mostrarListaMateriales(){

    ui->twMaterial->clearContents();
    ui->twMaterial->setRowCount(0);
    ui->twMaterial->setColumnCount(5);
    QStringList headers;
    headers << "Codigo" << "Titulo" << "Autor(es)" << "Anio de Publicacion" << "Tipo Material" ;
    ui->twMaterial->setHorizontalHeaderLabels(headers);

    int fila = 0;

       // Libros
       NodoLibro *nL = this->lLib->getCab();
       while (nL != NULL) {
           Libro *lib = nL->getInfo();
           ui->twMaterial->insertRow(fila);
           ui->twMaterial->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(lib->getCodigo())));
           ui->twMaterial->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(lib->getTitulo())));
           ui->twMaterial->setItem(fila, 2, new QTableWidgetItem(QString::fromStdString(lib->getAutor())));
           ui->twMaterial->setItem(fila, 3, new QTableWidgetItem(QString::number(lib->getAnioPublicacion())));
           ui->twMaterial->setItem(fila, 4, new QTableWidgetItem("Libro"));
           fila++;
           nL = nL->getSgte();
       }

       // Revistas
       NodoRevista *nR = this->lRev->getCab();
       while (nR != NULL) {
           Revista *rev = nR->getInfo();
           ui->twMaterial->insertRow(fila);
           ui->twMaterial->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(rev->getCodigo())));
           ui->twMaterial->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(rev->getTitulo())));
           ui->twMaterial->setItem(fila, 2, new QTableWidgetItem(QString::fromStdString(rev->getAutor())));
           ui->twMaterial->setItem(fila, 3, new QTableWidgetItem(QString::number(rev->getAnioPublicacion())));
           ui->twMaterial->setItem(fila, 4, new QTableWidgetItem("Revista"));
           fila++;
           nR = nR->getSgte();
       }

       // Tesis
       NodoTesis *nT = this->lTes->getCab();
       while (nT != NULL) {
           Tesis *tes = nT->getInfo();
           ui->twMaterial->insertRow(fila);
           ui->twMaterial->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(tes->getCodigo())));
           ui->twMaterial->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(tes->getTitulo())));
           ui->twMaterial->setItem(fila, 2, new QTableWidgetItem(QString::fromStdString(tes->getAutor())));
           ui->twMaterial->setItem(fila, 3, new QTableWidgetItem(QString::number(tes->getAnioPublicacion())));
           ui->twMaterial->setItem(fila, 4, new QTableWidgetItem("Tesis"));
           fila++;
           nT = nT->getSgte();
       }
}


void Reportes :: mostrarEstadoMateriales(){
       ui->twEstados->setRowCount(0);
       ui->twEstados->setColumnCount(4);
       QStringList headers;
       headers << "Código" << "Título" << "Tipo" << "Estado";
       ui->twEstados->setHorizontalHeaderLabels(headers);

       int fila = 0;

       // Libros
       NodoLibro* nl = lLib->getCab();
       while (nl) {
           Libro* l = nl->getInfo();
           ui->twEstados->insertRow(fila);
           ui->twEstados->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(l->getCodigo())));
           ui->twEstados->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(l->getTitulo())));
           ui->twEstados->setItem(fila, 2, new QTableWidgetItem("Libro"));
           ui->twEstados->setItem(fila, 3, new QTableWidgetItem(QString::fromStdString(l->getEstado())));
           fila++;
           nl = nl->getSgte();
       }

       // Revistas
       NodoRevista* nr = lRev->getCab();
       while (nr) {
           Revista* r = nr->getInfo();
           ui->twEstados->insertRow(fila);
           ui->twEstados->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(r->getCodigo())));
           ui->twEstados->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(r->getTitulo())));
           ui->twEstados->setItem(fila, 2, new QTableWidgetItem("Revista"));
           ui->twEstados->setItem(fila, 3, new QTableWidgetItem(QString::fromStdString(r->getEstado())));
           fila++;
           nr = nr->getSgte();
       }

       // Tesis
       NodoTesis* nt = lTes->getCab();
       while (nt) {
           Tesis* t = nt->getInfo();
           ui->twEstados->insertRow(fila);
           ui->twEstados->setItem(fila, 0, new QTableWidgetItem(QString::fromStdString(t->getCodigo())));
           ui->twEstados->setItem(fila, 1, new QTableWidgetItem(QString::fromStdString(t->getTitulo())));
           ui->twEstados->setItem(fila, 2, new QTableWidgetItem("Tesis"));
           ui->twEstados->setItem(fila, 3, new QTableWidgetItem(QString::fromStdString(t->getEstado())));
           fila++;
           nt = nt->getSgte();
       }
}

`;