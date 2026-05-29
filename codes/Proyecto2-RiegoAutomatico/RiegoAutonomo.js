var CODE_02_RIEG = `

// ── Pines 
const int PIN_SENSOR_HUMEDAD = A0;   // Sensor capacitivo YL-69
const int PIN_RELE            = 7;   // Relé de la electrobomba
const int PIN_LED_ESTADO      = 13;  // LED indicador integrado

// ── Configuración 
const int  UMBRAL_SECO        = 600; // ADC > 600 → suelo seco
const int  UMBRAL_HUMEDO      = 400; // ADC < 400 → suelo húmedo
const long INTERVALO_MS       = 5000; // Lectura cada 5 segundos
const int  DURACION_RIEGO_MS  = 3000; // Bomba activa 3 segundos

// ── Variables globales 
unsigned long ultimaLectura   = 0;
bool          bombaActiva     = false;

void setup() {
    Serial.begin(9600);
    pinMode(PIN_RELE,       OUTPUT);
    pinMode(PIN_LED_ESTADO, OUTPUT);

    // Estado inicial seguro: bomba apagada
    digitalWrite(PIN_RELE,       HIGH); // Relé NC → HIGH = abierto
    digitalWrite(PIN_LED_ESTADO, LOW);

    Serial.println("=== Sistema de Riego Autónomo v1.0 ===");
    Serial.println("Iniciando monitoreo de humedad...");
}

void loop() {
    unsigned long ahora = millis();

    if (ahora - ultimaLectura >= INTERVALO_MS) {
        ultimaLectura = ahora;

        int valorSensor = leerHumedad();
        int porcentaje  = map(valorSensor, 1023, 0, 0, 100);

        Serial.print("Humedad del suelo: ");
        Serial.print(porcentaje);
        Serial.print("% (ADC=");
        Serial.print(valorSensor);
        Serial.println(")");

        if (valorSensor > UMBRAL_SECO && !bombaActiva) {
            activarBomba();
        } else if (valorSensor < UMBRAL_HUMEDO && bombaActiva) {
            apagarBomba();
        }
    }
}

int leerHumedad() {
    // Promedio de 5 lecturas para reducir ruido
    long suma = 0;
    for (int i = 0; i < 5; i++) {
        suma += analogRead(PIN_SENSOR_HUMEDAD);
        delay(10);
    }
    return suma / 5;
}

void activarBomba() {
    bombaActiva = true;
    digitalWrite(PIN_RELE,       LOW);  // Relé NC → LOW = cerrado
    digitalWrite(PIN_LED_ESTADO, HIGH);
    Serial.println(">> BOMBA ACTIVADA — suelo seco detectado");

    delay(DURACION_RIEGO_MS);

    // Auto-apagado tras duración máxima de riego
    apagarBomba();
}

void apagarBomba() {
    bombaActiva = false;
    digitalWrite(PIN_RELE,       HIGH);
    digitalWrite(PIN_LED_ESTADO, LOW);
    Serial.println(">> BOMBA APAGADA");
}

`;