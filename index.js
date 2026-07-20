const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const DB_FILE = './database.json';

// Catálogo de películas y series
const CATALOGO = {
    estrenos: [
        "SCREAM 7 CAM ($20)", "CUMBRES BORRASCOSAS CAM", "CLIKA CAM", "LA CELDA DE LOS MILAGROS HD",
        "ALERTA EXTINCIÓN CAM", "AYUDA CAM", "TERROR EN SILENT HILL CAM", "UN HOMBRE POR SEMANA CAM",
        "EL TEMPLO DE LOS HUESOS CAM", "TOM Y JERRY CAM", "PRIMATE CAM", "LA EMPLEADA CAM",
        "ANACONDA 2025 CAM", "STRANGERS THINGS TEM.5 ($45)", "BOB ESPONJA EN BUSCA DE LOS PANTALONES CUADRADOS CAM",
        "AVATAR FUEGO Y CENIZA HD", "NOCHE DE PAZ NOCHE DE HORROR CAM", "SOY FRANKELDA",
        "WELCOME TO DERRY (8 Capítulos) ($45)", "MIRREYES VS GODINEZ ESPECIAL NAVIDAD", "FIVE NIGHTS AT FREDDYS 2 CAM",
        "ZOOTOPIA 2 HD", "WICKED 2 CAM", "LOS ILUSIONISTAS 3 CAM", "SHADOW EDGE HD", "THE DOGS HD",
        "JUJUTSU KAISEN SUB CAM HD", "FRANKENSTEIN HD", "CHAINSAW MAN", "DEPREDADOR TIERRAS SALVAJES",
        "EL TELÉFONO NEGRO 2 HD", "MIRREYES VS GODINEZ LAS VEGAS HD", "CULPA NUESTRA HD", "SERIE MONSTRUO",
        "TRON ARES CAM", "UNA BATALLA TRAS OTRA CAM", "MASCOTAS AL RESCATE CAM", "DESASTRE EN FAMILIA CAM",
        "FIXED", "EL CONJURO 4 HD", "HENRY DANGER 2025", "ULTIMO RODEO HD", "HAZ QUE REGRESE", "ALARUM",
        "OSIRIS", "AMORES MATERIALISTAS HD", "HURRY UP TOMORROW HD", "EL LIBRO DE ENOC HD", "OTRO VIERNES DE LOCOS HD",
        "Y DONDE ESTA EL POLICIA HD", "LA HORA DE LA DESAPARICION HD", "LOS TIPOS MALOS 2 HD", "HAPPY GILMORE 2 HD",
        "Los 4 fantásticos 2025 HD", "PECADORES HD", "EL MONO HD", "Araña asesina HD", "Se lo que hicieron el verano pasado",
        "Mamá reinventada HD", "Pitufos HD", "Demon Slayer (subtitulada)", "Superman HD", "Jurassic World Renace HD",
        "La vieja guardia 2 HD", "Zombies 4 HD", "F1 HD", "Elio HD", "Criatura Voraz HD", "Drop amenaza anónima HD",
        "Until Dawn noche de terror HD", "Megan 2.0 HD", "K-pop Demon Hunters HD", "28 años después HD",
        "Cómo entrenar a tu dragón HD", "Harta HD", "Peter pan pesadilla en nunca jamás HD", "Destino final Lazos de sangre HD",
        "Karate kid leyendas HD", "Thunderbolts HD", "Looney Tunes: El día que la tierra explotó HD",
        "Una película de Minecraft HD", "Rescate implacable HD", "Lilo & Stitch HD", "El cielo si existe",
        "Mesa de regalos HD", "Las aventuras de DogMan HD", "Flow HD", "Palmer", "Contraataque HD",
        "Bridget Jones Loca por él HD", "Implacable HD", "Memorias de un caracol HD", "Que huevos Sofía",
        "Código traje rojo HD", "Midway: batalla en el Pacífico", "Romper el círculo HD", "Bailarina 2025 HD",
        "Gladiador II HD", "Apocalypto", "El gánster, el policía y el diablo"
    ],
    ninos: [
        "Narnia 1 y 2", "Zootopia", "BLANCA NIEVES LIVE ACTION", "Barbie", "MI VILLANO FAVORITO", "INTENSAMENTE",
        "AMIGOS IMAGINARIOS", "GARFIELD FUERA DE CASA", "KUNG FU PANDA 4", "MEGAMENTE 2", "POLLITOS EN FUGA 2",
        "PATOS", "KUNG FU PANDA", "EL GATO CON BOTAS: ÚLTIMO DESEO", "TOY STORY 4", "EL PÁJARO LOCO SE VA DE CAMPAMENTO",
        "CORALINE", "MI AMIGO ES UN TRITON", "LAS CRONICAS DE SPIDERWICK", "MI AMIGO EL PINGUINO", "LA FOQUITA",
        "EL CADAVER DE LA NOVIA", "EL LORAX", "MONSTER INC", "TROLLS 3", "MARIO BROS", "EL ZORRO Y EL SABUESO",
        "CUENTOS DE NAVIDAD DE MICKEY", "LA PRINCESITA", "ROBOT SALVAJE", "CADETE KELLY", "UNA CHIHUHUA EN BEVERLY HILLS",
        "JEFE EN PAÑALES 2", "ALICIA EN EL PAIS DE LAS MARAVILLAS LIVE ACTION", "LUCK", "TROLLS 2"
    ],
    variado: [
        "BUSQUEDA IMPLACABLE 2", "SINIESTRO 1 Y 2", "MEMORIAS DE UN ASESINO", "WEREWOLVES", "EL PRINCIPITO",
        "CUANDO TE ENCUENTRE", "CULPA MIA", "PEQUEÑO SOLDADO", "NOTORIUS BIG", "BRUJULA DORADA", "8 APELLIDOS CATALANES",
        "8 APELLIDOS VASCOS", "LA MULA", "SENTENCIA PREVIA", "SOLO LOS VALIENTES", "MI AMIGA LA SIRENA",
        "ENTREVISTA CON EL VAMPIRO", "LA OTRA CARA DE LA LUNA", "LA NOVIA DE CHUKY", "EL VUELO", "ARTEMIS HOWL",
        "LEGEND", "HOMBRE AL AGUA", "COSAS IMPOSIBLES", "ATRAPADOS EN CHERNOBYL", "DEPREDADOR ASESINO DE ASESINOS",
        "VÉRTIGO", "LONGLEGS", "LA DAMA DE NEGRO 2", "JOHN WICK 4", "CONSTANTINE", "COMO SER SOLTERA",
        "NOTAS PERFECTAS 1", "EL BUFON", "RUDO Y CURSI", "TRANSFORMERS EL LADO OSCURO DE LA LUNA", "LOGAN",
        "RAPIDOS Y FURIOSOS 1, 2 Y 5", "EL ROBO PERFECTO", "MISION RESCATE", "EL DIABLO VISTE A LA MODA",
        "CORAZONES JOVENES", "LA PURGA EL INICIO", "APOCALIPSIS DE SAN JUAN", "DEPREDADOR: LA PRESA", "BATALLA NAVAL",
        "CADENA DE FAVORES", "REZAR COMER Y AMAR", "007 SIN TIEMPO PARA MORIR", "007 SKYFALL", "007 CASINO ROYALE",
        "EL ARO RESURRECCIÓN", "ASI EN LA TIERRA COMO EN EL INFIERNO", "EXHUMA LA TUMBA DEL DIABLO",
        "SAGA COMPLETA DE LOS 4 FANTÁSTICOS", "MAREMOTO", "GODZILLA VS KONG", "GODZILLA Y KONG NUEVO IMPERIO",
        "PASAJEROS", "MI GALLO", "EL ENTE", "ABISMO SECRETO", "300", "AMIGOS INTOCABLES", "RENDIRSE JAMAS 3",
        "UNION Y LUCHA", "MUJER MARAVILLA 1984", "LA MALDICION DE LA LLORONA", "EL RITUAL", "QUE CULPA TIENE EL NIÑO",
        "LA SUSTANCIA", "EL HOBBIT LA BATALLA DE LOS 5 EJERCITOS", "SOY LEYENDA", "EL MESERO", "UN VIAJE AL CORAZON",
        "INVENCIBLE UN NIÑO FUERA DE SERIE", "EL TELEFONO NEGRO", "APOCALIPSIS Z", "EL LEGADO DEL DIABLO",
        "EL ÚLTIMO CONJURO", "MAD MAX (FURIOSA)", "BAD BOYS 3", "EL PLANETA DE LOS SIMIOS", "TAROT DE LA MUERTE",
        "HACHIKO 2", "RICKY BOBBY LOCO POR LA VELOCIDAD", "CHICA XXL 2006", "ATLAS", "ABIGAIL", "PROFESION PELIGRO",
        "INMACULADA", "GUERRA CIVIL", "EL ROOMIE", "LA PRIMERA PROFECIA", "ARTHUR THE KING", "IMAGINARIO JUGUETE DIABOLICO",
        "GHOSTBUSTERS APOCALIPSIS FANTASMA", "WINNIE POOH MIEL Y SANGRE 2", "ROAD HOUSE 2024", "CON TODOS MENOS CONTIGO",
        "JACK EN LA CAJA MALDITA", "FERRARI", "ATRAPADOS EN LO PROFUNDO", "DEMON SLAYER V", "EL ASTRONAUTA",
        "LIFT UN ROBO DE PRIMERA CLASE", "NO LO ABRAS", "DOGMAN", "MADAME WEB", "LA SOCIEDAD DE LA NIEVE",
        "AGUAS SINIESTRAS", "BEEKEEPER", "AQUAMAN 2", "CAZAFANTASMAS", "DEPREDADOR", "REBEL MOON", "DUNA PARTE 2",
        "SANGRE POR SANGRE", "SPIDERMAN SIN REGRESO A CASA", "VENOM 1 y 2", "ORION Y LA OSCURIDAD", "LEO", "RED",
        "ESTE CUERPO NO ES MIO", "RESCATE IMPOSIBLE", "NEED FOR SPEED", "EL RESPLANDOR", "EL EXORCISTA",
        "GUERRA DE LAS GALAXIAS IV Y V", "LA NARANJA MECANICA", "ALICIA EN EL PAIS DE LAS PESADILLAS",
        "LOS 3 MOSQUETEROS 2", "LA DAMA DE NEGRO", "RADICAL", "SI, SEÑOR", "TORNADOS", "DESPUES DE LA VIDA",
        "EL AMARRE", "ROMPIENDO EL CIRCULO", "CANDIDATO HONESTO", "BEETLEJUICE 1 Y 2", "HARRY POTTER 1, 2, 3, 8",
        "HASTA EL ÚLTIMO HOMBRE", "SHOOTER", "LA CASA DE CERA", "FIVE NIGHTS AT FREDDYS", "DOCTOR STRANGE",
        "EL GIGANTE DE HIERRO", "LA PROFECIA 1,2,3", "FLAMING HOT", "REQUIEM", "HECHIZO DE AMOR", "EXHUMA",
        "MUSICA, AMIGOS Y FIESTA", "TOC TOC: UNA COMEDIA OBSESIVAMENTE DIVERTIDA", "SWEENEY TODD", "SIN ESCAPE",
        "EL SECRETO DE ADALINE", "UN LUGAR EN EL SILENCIO 2", "TRANSFORMERS 1", "LA HEREDERA MILLONARIA DIVORCIADA",
        "ANTICRISTO", "GARRAS", "CON GANAS DE TRIUNFAR", "LA NOCHE DEL DIABLO", "SIN LUGAR PARA LOS DEBILES",
        "ANTICRISTO: EL EXORCISMO DE LARA", "7 DESEOS", "EL CONGRESO", "DE NOCHE CON EL DIABLO", "IRREVERSIBLE",
        "RAPIDOS Y FURIOSOS 9 Y 10", "NO HABLES CON EXTRAÑOS", "YO ANTES DE TI", "EL JOKER", "TALK TO ME",
        "LA DELGADA LINEA AMARILLA", "QUISIERA SER MILLONARIO", "EN BUSCA DEL REY SOL", "ARRASTRAME AL INFIERNO",
        "EL INFIERNO", "RUEGA POR NOSOTROS", "IT", "LA REUNION DEL DIABLO", "EFECTOS SECUNDARIOS", "HIJOS DE PERRA",
        "ARTHUR", "LA VIDA ES BELLA", "NADA QUE VER", "LA FORJA", "QUERIDO INTRUSO", "YO ROBOT", "SOSPECHAS MORTALES",
        "CARRERAS CLANDESTINAS", "LOS SUPLENTES", "EMMA", "A TRAVES DE MI VENTANA", "A TRAVES DEL MAR",
        "A TRAVES DE TU MIRADA", "ME VUELVES LOCA", "EL ESPACIO ENTRE NOSOTROS", "UN GUARDABOSQUES", "EL GENIO DEL AMOR",
        "ADELE Y EL MISTERIO DE LA MOMIA", "GREYHOUND", "SEÑALES DE AMOR", "DIARIO DE UNA PASION", "MAXXXINE",
        "QUISIERA SER GRANDE", "SMILE 2", "TERRIFIER 3", "Cienpiés humano", "Kraven: el cazador", "Sonidos de libertad",
        "Camino hacia el terror 3 y 6", "El origen de los guardianes", "El expreso polar", "Gigantes de acero",
        "7 dias", "El juego del calamar 2", "El jardin secreto", "El viaje de Chihiro", "El castillo ambulante",
        "Milagros del cielo", "Mary and Max", "Cartas a Van Gogh", "Krampus", "Solo leveling", "Bernando y bianca",
        "Robin Hood", "Jack el cazagigantes", "El conde de montecristo", "Parano-IA", "El hoyo 2", "Dias perfectos",
        "Amor", "El gran simón", "El silencio", "El sargento de Hierro", "Simplemente irresistible",
        "Una aventura extraordinaria", "Thundercats", "Nacho libre", "Infinite", "La cruda verdad",
        "Parpadea dos veces", "Los 33", "Sing street este es tu momento", "El cuervo", "Maria, me muero",
        "El hijo", "El maquinista", "Red tails", "Jack y Jill", "Quieres ser mi hijo", "La misma luna",
        "Camino hacia el terror 2", "Detras de la pizarra", "La herencia de sr deeds", "12 años de esclavitud",
        "Dracula muerto pero feliz", "Lady Oscar", "Los rugrats", "Pura suerte", "Cruella", "No mires",
        "La ballena", "Extraordinario", "Heroico", "Sherk 1 2 3 4", "Horton y el mundo de los quien", "Anabelle 3",
        "Superman regresa", "Mi familia", "Morbius", "Focus maestros de la estafa", "Somos Oro", "Casi el paraiso",
        "Un dia sin mexicanos", "Hereje", "Moana", "One direction", "Wicked", "Mi nombre es Khan", "Project silence",
        "Iron man", "Iron man 2", "Iron man 3", "Capitán América: El primer vengador", "Capitán América: Civil war",
        "El gran Alberto", "Alien: El octavo pasajero", "Aliens: El regreso", "Alien 3", "Alien: Resurrección",
        "Alien: Covenant", "Alien: Romulus", "Un desastre de pelicula", "Viral", "La idea de ti", "Sex and the city",
        "Sex and the city 2", "Spartacus: Temporada 1", "Matrix", "3MSC", "Cien años de soledad", "Ciudad de Dios",
        "Poltergeist", "Poltergeist 2", "Poltergeist 3", "Poltergeist 2015", "La profecía 2g", "La profecía 4",
        "Popeyes Revenge", "Critters: Extrañas criaturas", "Una vida mejor", "Una historia del Bronx", "Ruido",
        "Death race: La carrera de la muerte", "La fortaleza del Vicio", "Del crepúsculo al amanecer",
        "El viaje más largo", "Gigolo por accidente en Europa", "Los tres chiflados", "Better Man: La historia de Robbie Williams",
        "Salyut-7: Héroes en el espacio", "Devils stay", "Distrito 13: Parte 2", "La red social", "Golden Boy",
        "La vida de Jesús", "Johnny cogio su fusil", "La pasión de Cristo", "Cuentos inmorales", "9 orgasmos",
        "Space Jam", "Tierra de los muertos", "La horda", "El baño del diablo g", "El exorcista del papa",
        "Cria siniestra", "En busca de la felicidad", "El fundador (Hambre de poder)", "Lo imposible",
        "Más allá de los sueños", "Pantaleón y las visitadoras", "La cara oculta", "Alienoid: Parte uno",
        "Alienoid: Parte dos", "Vampire Academy", "Crossroad", "The Drowning", "Terminator 3", "Odio el amor",
        "Caballo de guerra", "Sin señas particulares", "Todas menos tú", "Dragón ball Super: Broly",
        "El expreso del miedo", "Winnie Pooh y el pequeño efelante", "Volando alto"
    ]
};

// Inventario de Cuentas y Streaming
const STREAMING = {
    perfiles: [
        "Netflix Privado — 🟢 $85", "Netflix — 🟢 $65", "Prime s/a — 🟢 $20", "Disney s/a — 🟢 $20",
        "Max s/a — 🟢 $20", "Paramount — 🟢 $30", "Crunchyroll — 🟢 $15", "Universal — 🟢 $35",
        "Apple TV — 🟢 $35", "VIX Premium 1M — 🟢 $15", "VIX Premium 2M — 🟢 $30",
        "VIX Premium 3M — 🟢 $60", "VIX Premium 6M — 🟢 $70", "VIX Premium ANUAL — 🟢 $85"
    ],
    canva: [
        "Canva 1 mes — 🟢 $10", "Canva 2 meses — 🟢 $20", "Canva 3 meses — 🟢 $30", "Canva 1 año — 🟢 $70"
    ],
    musica: [
        "Spotify 1 mes — 🟢 $60", "Deezer 1 mes — 🟢 $30", "YouTube Familiar — 🟢 $65",
        "YouTube 1 mes — 🟢 $45", "YouTube Invitación — 🟢 $20"
    ],
    cuentas: [
        "Netflix Completa — 🟢 $325", "Prime s/a Completa — 🟢 $80", "Disney s/a Completa — 🟢 $105",
        "Max s/a Completa — 🟢 $105", "Paramount Completa — 🟢 $70", "Crunchyroll Completa — 🟢 $70",
        "Universal Completa — 🟢 $105", "Apple TV Completa — 🟢 $95", "VIX Premium Completa 1M — 🟢 $80",
        "VIX Premium Completa 2M — 🟢 $90", "VIX Premium Completa 3M — 🟢 $100",
        "VIX Premium Completa 6M — 🟢 $115", "VIX Premium Completa ANUAL — 🟢 $170"
    ]
};

const leerDB = () => {
    if (!fs.existsSync(DB_FILE)) return { gastos: [], saldos: {} };
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};
const guardarDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const client = new Client({
    authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
    console.log('\n🤖 Pepito necesita que escanees este código QR con tu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n🚀 ¡Pepito está en línea con películas y streaming cargados!\n');
});

client.on('message', async (msg) => {
    const texto = msg.body;
    if (!texto.startsWith('!')) return;

    const contact = await msg.getContact();
    const usuario = contact.pushname || 'Usuario Anónimo';

    const partes = texto.slice(1).trim().split(' ');
    const comando = partes[0].toLowerCase();
    const argumentos = partes.slice(1);

    let db = leerDB();
    let respuestaFinal = "";

    switch (comando) {
        case 'gasto':
            const monto = parseFloat(argumentos[0]);
            const descripcion = argumentos.slice(1).join(' ') || 'Gasto general';

            if (isNaN(monto) || monto <= 0) {
                respuestaFinal = "❌ ¡Oye! Necesito un monto válido. Ejemplo: `!gasto 150 Cuentas`";
                break;
            }

            db.gastos.push({ usuario, monto, descripcion, fecha: new Date() });
            if (!db.saldos[usuario]) db.saldos[usuario] = 0;
            db.saldos[usuario] += monto;
            guardarDB(db);

            respuestaFinal = `✅ *${usuario}* aportó *$${monto}* por: "${descripcion}". ¡Registrado por Pepito!`;
            break;

        case 'cuentas':
        case 'saldo':
            if (Object.keys(db.saldos).length === 0) {
                respuestaFinal = "📉 Por ahora nadie ha registrado gastos.";
                break;
            }
            respuestaFinal = "📊 *Balance Actual de Cuentas:*\n\n";
            for (const [persona, saldo] of Object.entries(db.saldos)) {
                respuestaFinal += `• *${persona}*: $${saldo.toFixed(2)}\n`;
            }
            break;

        case 'lista':
            if (!argumentos[0]) {
                respuestaFinal = "💜📦 *MENÚ DE STOCK ACTUALIZADO* 📦💜\n\n" +
                                 "Usa los siguientes comandos para ver las listas:\n\n" +
                                 "🎬 *Películas y Series:* \n" +
                                 "• `!lista estrenos` | `!lista ninos` | `!lista variado` \n\n" +
                                 "📺 *Cuentas y Streaming:* \n" +
                                 "• `!lista perfiles` -> 1 Dispositivo\n" +
                                 "• `!lista cuentas` -> Cuentas Completas (5 disp.)\n" +
                                 "• `!lista canva` -> Licencias Canva\n" +
                                 "• `!lista musica` -> Spotify, YouTube, Deezer\n\n" +
                                 "🔍 Recuerda que puedes buscar lo que sea con: `!buscar [nombre]`";
                break;
            }

            const cat = argumentos[0].toLowerCase();
            if (CATALOGO[cat]) {
                respuestaFinal = `🎬 *CATÁLOGO - ${cat.toUpperCase()}:*\n\n` + CATALOGO[cat].map(p => `🍿 ${p}`).join('\n');
            } else if (STREAMING[cat]) {
                const iconos = { perfiles: '📺', cuentas: '👥', canva: '🎨', musica: '🎵' };
                const icono = iconos[cat] || '✨';
                respuestaFinal = `${icono} *STOCK - ${cat.toUpperCase()}:*\n\n` + STREAMING[cat].map(s => `${s}`).join('\n');
            } else {
                respuestaFinal = "❌ Categoría no encontrada. Escribe `!lista` para ver el menú principal.";
            }
            break;

        case 'buscar':
            const busqueda = argumentos.join(' ').toLowerCase();
            if (!busqueda) {
                respuestaFinal = "🔍 ¿Qué estás buscando? Ejemplo: `!buscar Netflix` o `!buscar Scream`";
                break;
            }

            let encontradosPelis = [];
            let encontradosStream = [];

            // Buscar en películas
            for (const [catPeli, titulos] of Object.entries(CATALOGO)) {
                titulos.forEach(t => {
                    if (t.toLowerCase().includes(busqueda)) encontradosPelis.push(t);
                });
            }

            // Buscar en streaming
            for (const [catStream, servicios] of Object.entries(STREAMING)) {
                servicios.forEach(s => {
                    if (s.toLowerCase().includes(busqueda)) encontradosStream.push(s);
                });
            }

            if (encontradosPelis.length > 0 || encontradosStream.length > 0) {
                respuestaFinal = `🔍 *Resultados de búsqueda para "${argumentos.join(' ')}":*\n\n`;
                
                if (encontradosStream.length > 0) {
                    respuestaFinal += "📺 *Servicios y Streaming:* \n" + encontradosStream.map(e => `✨ ${e}`).join('\n') + "\n\n";
                }
                if (encontradosPelis.length > 0) {
                    respuestaFinal += "🎬 *Películas disponibles:* \n" + encontradosPelis.map(e => `🍿 ${e}`).join('\n') + "\n\n⚡ _Link de Drive inmediato._";
                }
            } else {
                respuestaFinal = `❌ No encontré resultados exactos para "${argumentos.join(' ')}". Si es una película fuera de la lista, te la puedo conseguir por *$20* en Drive.`;
            }
            break;

        case 'ayuda':
            respuestaFinal = "🤖 *¡Hola, soy Pepito! Tu administrador integral.*\n\n" +
                             "• `!lista` -> Menú de catálogos y stock.\n" +
                             "• `!buscar [nombre]` -> Buscar películas o servicios.\n" +
                             "• `!gasto [monto] [motivo]` -> Registrar cuentas grupales.\n" +
                             "• `!cuentas` -> Ver saldos acumulados.";
            break;
    }

    if (respuestaFinal) {
        msg.reply(respuestaFinal);
    }
});

client.initialize();
