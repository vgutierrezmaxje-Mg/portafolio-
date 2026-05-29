var CODE_03_ANZ= `

// Pines 
const int PIN_SENAL     = A0;  // Entrada de señal analógica
const int PIN_LED_CLIP  = 8;   // LED de advertencia de clipping

// Configuración de muestreo
const int    N_MUESTRAS    = 128;   // Tamaño del buffer de captura
const int    FREC_MUESTREO = 1000;  // Hz — 1 muestra cada 1 ms
const int    NIVEL_MEDIO   = 512;   // Punto medio ADC (2.5 V ref)
const int    UMBRAL_CLIP   = 990;   // Saturación del ADC

// Buffer de muestras
int    muestras[N_MUESTRAS];
int    indice       = 0;
bool   bufferLleno  = false;

// Variables de análisis 
unsigned long tiempoAnterior = 0;
int           crucesPos      = 0;   // Cruces ascendentes por cero
unsigned long tPrimerCruce   = 0;
unsigned long tUltimoCruce   = 0;

void setup() {
    Serial.begin(115200);
    pinMode(PIN_LED_CLIP, OUTPUT);
    digitalWrite(PIN_LED_CLIP, LOW);

    // Aumentar velocidad ADC (prescaler 16 → ~77 kHz)
    ADCSRA = (ADCSRA & ~0x07) | 0x04;

    Serial.println("=== Analizador de Señales Analógicas v1.0 ===");
    Serial.println("Formato: Muestra\tValor_ADC\tVoltaje_V");
}

void loop() {
    unsigned long ahora = micros();

    // Muestreo a frecuencia fija
    if (ahora - tiempoAnterior >= (1000000UL / FREC_MUESTREO)) {
        tiempoAnterior = ahora;

        int valor = analogRead(PIN_SENAL);
        muestras[indice] = valor;

        // Detección de clipping
        if (valor >= UMBRAL_CLIP || valor <= 10) {
            digitalWrite(PIN_LED_CLIP, HIGH);
        } else {
            digitalWrite(PIN_LED_CLIP, LOW);
        }

        // Enviar al Serial Plotter
        float voltaje = valor * (5.0 / 1023.0);
        Serial.print(indice);
        Serial.print("\t");
        Serial.print(valor);
        Serial.print("\t");
        Serial.println(voltaje, 3);

        indice++;

        if (indice >= N_MUESTRAS) {
            indice      = 0;
            bufferLleno = true;
            analizarBuffer();
        }
    }
}

// Análisis del buffer capturado
void analizarBuffer() {
    int    valorMax  = 0;
    int    valorMin  = 1023;
    long   suma      = 0;
    int    cruces    = 0;
    int    anterior  = muestras[0];

    for (int i = 0; i < N_MUESTRAS; i++) {
        int v = muestras[i];

        if (v > valorMax) valorMax = v;
        if (v < valorMin) valorMin = v;
        suma += v;

        // Cruce ascendente por el nivel medio
        if (anterior < NIVEL_MEDIO && v >= NIVEL_MEDIO) {
            cruces++;
        }
        anterior = v;
    }

    float promedio   = suma / (float)N_MUESTRAS;
    float amplitud_V = (valorMax - valorMin) * (5.0 / 1023.0);
    float duracion_s = N_MUESTRAS / (float)FREC_MUESTREO;
    float frecuencia = (cruces > 0) ? (cruces / duracion_s) : 0.0;

    Serial.println("--- ANÁLISIS DE BUFFER ---");
    Serial.print("Amplitud pico a pico : ");
    Serial.print(amplitud_V, 3);
    Serial.println(" V");

    Serial.print("Promedio ADC         : ");
    Serial.println(promedio, 1);

    Serial.print("Frecuencia estimada  : ");
    Serial.print(frecuencia, 2);
    Serial.println(" Hz");

    Serial.print("Cruces por cero (+)  : ");
    Serial.println(cruces);
    Serial.println("--------------------------");
}


`;