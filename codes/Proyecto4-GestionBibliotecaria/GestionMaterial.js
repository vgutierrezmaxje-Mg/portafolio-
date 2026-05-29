var CODE_04_GM = `

#include "listalibro.h"
#include "sstream"
#include "fstream"
#include <cstdlib>

const char limite = '%';
const string archivoLibros = "..\\Libros.txt";

int ListaLibro::getNLib() const
{
    return nLib;
}

void ListaLibro::setNLib(int value)
{
    nLib = value;
}

NodoLibro *ListaLibro::getCab() const
{
    return cab;
}

void ListaLibro::setCab(NodoLibro *value)
{
    cab = value;
}
ListaLibro::ListaLibro()
{
    this->cab = NULL;
    this->nLib = 0;
}

ListaLibro::~ListaLibro()
{

}

void ListaLibro::insertarLibro( Libro *lb ){
    NodoLibro *aux = new NodoLibro ();
    NodoLibro *temp = new NodoLibro ();
    temp->setInfo( lb );
    temp->setSgte(NULL);
    temp->setAnt(NULL);
    if ( this->cab == NULL ){
        this->cab = temp;
    }
    else{
        aux = this->cab;
        while( aux->getSgte() != NULL ){
            aux = aux->getSgte();
        }
        aux->setSgte(temp);
        temp->setAnt(aux);
    }
    this->nLib++;
}

void ListaLibro::guardarLibro(Libro *lib) {
    ofstream archivoL;
    archivoL.open(archivoLibros.c_str(),
            std::ios_base::out | std::ios_base::app);
    if (archivoL.is_open()){
        archivoL<< lib->getCodigo()          << limite
                << lib->getTitulo()          << limite
                << lib->getAutor()           << limite
                << lib->getAnioPublicacion() << limite
                << lib->getEditorial()       << limite
                << lib->getNPaginas()        << limite
                << lib->getGenero()          << limite
                << lib->getLugarPublic()     << limite
                << lib->getEstado()          << limite
                << lib->getTipoMaterial()    << endl;
    }
    archivoL.close();
}

void ListaLibro::recuperarLibros(){
    this->vaciarListaLib();
    string linia, codigo, titulo, autor, anoPuB, editorial, numPag, genero,
           lugPub, estado, tipoMat; 
    int maxCodigo = 0;
    ifstream archivo(archivoLibros.c_str(), ios_base::in);
    while(getline(archivo, linia)){
        Libro *lb = new Libro();
        stringstream entrada(linia);
        getline(entrada, codigo, limite);
        lb->setCodigo(codigo);
        if(codigo.size()>1){
            int num = atoi(codigo.substr(1).c_str());
            if(num>maxCodigo)
               maxCodigo = num;
        }
        getline(entrada, titulo, limite);
        lb->setTitulo(titulo);
        getline(entrada, autor, limite);
        lb->setAutor(autor);
        getline(entrada, anoPuB, limite);
        lb->setAnioPublicacion(atoi(anoPuB.c_str()));
        getline(entrada, editorial, limite);
        lb->setEditorial(editorial);
        getline(entrada, numPag, limite);
        lb->setNPaginas(atoi(numPag.c_str()));
        getline(entrada, genero, limite);
        lb->setGenero(genero);
        getline(entrada, lugPub, limite);
        lb->setLugarPublic(lugPub);
        getline(entrada, estado, limite);
        lb->setEstado(estado);
        getline(entrada, tipoMat, limite);
        lb->setTipoMaterial(tipoMat);
        this->insertarLibro(lb);
    }
    archivo.close();
}

void ListaLibro::vaciarListaLib() {
    NodoLibro *aux = this->cab;
    while (aux != NULL) {
        NodoLibro *temp = aux;
        aux = aux->getSgte();
        delete temp->getInfo();
        delete temp;
    }
    this->cab = NULL;
}

Libro *ListaLibro::buscarPorCodigo(const string &codigo){
    NodoLibro* aux = this->cab;
    while (aux != NULL) {
        if (aux->getInfo()->getCodigo() == codigo)
            return aux->getInfo();
        aux = aux->getSgte();
    }
    return NULL;
}

`;