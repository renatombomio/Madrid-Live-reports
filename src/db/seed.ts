/**
 * Development seed — populates the DB with realistic Madrid data.
 * Run with: just seed  (or: pnpm db:seed)
 */
import 'dotenv/config';
import { db } from './index';
import { districts, tags, reports, reportTags, news, newsTags } from './schema';
import { user } from './schema';

const DISTRICTS = [
  { id: 'centro', name: 'Centro', slug: 'centro', description: 'El corazón histórico de Madrid.' },
  { id: 'arganzuela', name: 'Arganzuela', slug: 'arganzuela', description: 'Distrito industrial reconvertido.' },
  { id: 'retiro', name: 'Retiro', slug: 'retiro', description: 'Hogar del parque más famoso de Madrid.' },
  { id: 'salamanca', name: 'Salamanca', slug: 'salamanca', description: 'Barrio de lujo y alta costura.' },
  { id: 'chamartin', name: 'Chamartín', slug: 'chamartin', description: 'Hub empresarial y AZCA.' },
  { id: 'tetuan', name: 'Tetuán', slug: 'tetuan', description: 'Distrito multicultural al norte.' },
  { id: 'chamberi', name: 'Chamberí', slug: 'chamberi', description: 'Barrio residencial castizo.' },
  { id: 'fuencarral', name: 'Fuencarral-El Pardo', slug: 'fuencarral', description: 'El distrito más grande de Madrid.' },
  { id: 'moncloa', name: 'Moncloa-Aravaca', slug: 'moncloa', description: 'Sede de la residencia presidencial.' },
  { id: 'latina', name: 'Latina', slug: 'latina', description: 'Tradicional y popular.' },
  { id: 'carabanchel', name: 'Carabanchel', slug: 'carabanchel', description: 'En plena transformación urbana.' },
  { id: 'usera', name: 'Usera', slug: 'usera', description: 'El barrio chino de Madrid.' },
  { id: 'puente-vallecas', name: 'Puente de Vallecas', slug: 'puente-vallecas', description: 'Vibrante barrio del sur.' },
  { id: 'moratalaz', name: 'Moratalaz', slug: 'moratalaz', description: 'Barrio tranquilo con gran comunidad.' },
  { id: 'ciudad-lineal', name: 'Ciudad Lineal', slug: 'ciudad-lineal', description: 'La ciudad jardín de Arturo Soria.' },
  { id: 'hortaleza', name: 'Hortaleza', slug: 'hortaleza', description: 'Zona residencial al noreste.' },
  { id: 'villaverde', name: 'Villaverde', slug: 'villaverde', description: 'Histórico núcleo industrial del sur.' },
  { id: 'villa-vallecas', name: 'Villa de Vallecas', slug: 'villa-vallecas', description: 'Municipio agregado en 1950.' },
  { id: 'vicalvaro', name: 'Vicálvaro', slug: 'vicalvaro', description: 'El nuevo ECO-barrio de Madrid.' },
  { id: 'san-blas', name: 'San Blas-Canillejas', slug: 'san-blas', description: 'Zona residencial al este.' },
  { id: 'barajas', name: 'Barajas', slug: 'barajas', description: 'Hogar del aeropuerto de Madrid.' },
];

const TAGS = [
  { id: 'metro', name: 'Metro', slug: 'metro' },
  { id: 'ciclismo', name: 'Ciclismo', slug: 'ciclismo' },
  { id: 'sostenibilidad', name: 'Sostenibilidad', slug: 'sostenibilidad' },
  { id: 'patrimonio', name: 'Patrimonio', slug: 'patrimonio' },
  { id: 'economia', name: 'Economía', slug: 'economia' },
  { id: 'vivienda', name: 'Vivienda', slug: 'vivienda' },
  { id: 'turismo', name: 'Turismo', slug: 'turismo' },
  { id: 'seguridad', name: 'Seguridad', slug: 'seguridad' },
  { id: 'cultura', name: 'Cultura', slug: 'cultura' },
  { id: 'medioambiente', name: 'Medio Ambiente', slug: 'medioambiente' },
  { id: 'transporte', name: 'Transporte', slug: 'transporte' },
  { id: 'urbanismo', name: 'Urbanismo', slug: 'urbanismo' },
  { id: 'movilidad', name: 'Movilidad', slug: 'movilidad' },
  { id: 'salud', name: 'Salud', slug: 'salud' },
  { id: 'educacion', name: 'Educación', slug: 'educacion' },
  { id: 'innovacion', name: 'Innovación', slug: 'innovacion' },
  { id: 'deporte', name: 'Deporte', slug: 'deporte' },
];

const AUTHOR_ID = 'seed-admin-01';

const SEED_USER = {
  id: AUTHOR_ID,
  name: 'Redacción Madrid Live',
  email: 'redaccion@madridlive.es',
  emailVerified: true,
  role: 'admin' as const,
};

const PUBLISH_HOURS = [8, 9, 10, 11, 13, 14, 15, 16, 17];

function pub(daysAgo: number, slotIndex = 0): Date {
  const d = new Date('2026-05-25T00:00:00Z');
  d.setDate(d.getDate() - daysAgo);
  d.setUTCHours(PUBLISH_HOURS[slotIndex % PUBLISH_HOURS.length], slotIndex % 60, 0, 0);
  return d;
}

const REPORTS = [
  {
    id: 'rep-001',
    title: 'Madrid Nuevo Norte: el mayor proyecto urbanístico de Europa avanza con retrasos',
    slug: 'madrid-nuevo-norte-avance-retrasos',
    summary: 'La operación de regeneración urbana al norte de la estación de Chamartín suma ya dos décadas de tramitación y sigue sin fecha firme de inicio de obras. El proyecto contempla 10.500 viviendas, una prolongación de la Castellana y un nuevo distrito financiero.',
    content: `La Operación Chamartín, rebautizada como Madrid Nuevo Norte, es el proyecto urbanístico pendiente más grande de España y uno de los más ambiciosos de Europa. Sobre 2,36 millones de metros cuadrados al norte de la estación de Chamartín, el plan prevé la construcción de cuatro nuevos barrios, un parque central de 110 hectáreas y la soterración de las vías de acceso norte a la capital.

Tras décadas de bloqueos judiciales y negociaciones entre el Ayuntamiento, la Comunidad y la gestora DCN —participada por BBVA y Grupo San José—, el plan urbanístico fue aprobado definitivamente en 2021. Sin embargo, la fase de gestión —que incluye la reparcelación de terrenos y la negociación con propietarios de suelo— se ha extendido más de lo previsto, retrasando el inicio efectivo de obras hasta al menos 2027.

El proyecto generará un impacto económico estimado de 14.000 millones de euros y creará alrededor de 350.000 empleos durante la construcción, según los promotores. Los vecinos de Fuencarral y Chamartín, sin embargo, advierten de la presión sobre las infraestructuras existentes y exigen que el 30% de las viviendas tengan protección oficial.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'chamartin',
    authorId: AUTHOR_ID,
    publishedAt: pub(182, 0),
  },
  {
    id: 'rep-002',
    title: 'La remodelación de la Plaza de España: de aparcamiento soterrado a pulmón cívico',
    slug: 'remodelacion-plaza-espana-pulmon-civico',
    summary: 'La transformación de la Plaza de España ha convertido uno de los espacios más transitados de Madrid en una gran explanada peatonal con zonas verdes y estanques. El proyecto, terminado en 2022, sigue generando debate sobre su uso real y su mantenimiento.',
    content: `La Plaza de España pasó de ser un nudo de tráfico con aparcamiento subterráneo a convertirse en el espacio peatonal más grande del centro histórico de Madrid. La remodelación, dirigida por la oficina de MBC+Arquitectos con un presupuesto de 20 millones de euros, eliminó las calzadas perimetrales y enterró el aparcamiento, liberando más de 35.000 metros cuadrados de espacio público.

El diseño incorpora láminas de agua, jardines escalonados que conectan visualmente con el Palacio Real y la zona de la Montaña del Príncipe Pío, y una arboleda de plátanos y chopos que proyecta sombra en los meses de verano. Las fuentes y el mobiliario urbano han recibido elogios de urbanistas europeos que la citan como referencia en humanización del espacio público.

No obstante, la gestión posterior plantea dudas. Los comercios de los bajos del edificio España han denunciado la pérdida de accesibilidad para sus clientes, y algunas asociaciones vecinales señalan que la plaza carece de oferta de ocio y restauración suficiente para activarla como espacio vivido más allá del paso turístico. El Ayuntamiento estudia incorporar una zona de quioscos y actividades culturales estacionales.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'centro',
    authorId: AUTHOR_ID,
    publishedAt: pub(165, 3),
  },
  {
    id: 'rep-003',
    title: 'Extensión de la Línea 11 de Metro: La Fortuna, más cerca del centro',
    slug: 'extension-linea-11-metro-la-fortuna',
    summary: 'La prolongación de la Línea 11 desde Aluche hasta La Fortuna conectará por primera vez uno de los barrios más aislados de Latina con la red de metro. Las obras, en ejecución desde 2024, tienen prevista su finalización para finales de 2026.',
    content: `El barrio de La Fortuna, en el distrito de Latina, lleva décadas reclamando una conexión directa con el metro. La extensión de la Línea 11 desde Aluche —su actual terminal— hasta la nueva estación de La Fortuna cubrirá 1,8 kilómetros de vía soterrada y resolverá uno de los últimos grandes déficits de conectividad del sur urbano de Madrid.

La obra implica la construcción de dos nuevas estaciones: La Peseta y La Fortuna, ambas con acceso adaptado, intercambiadores de autobús integrados y aparcamientos para bicicletas. El presupuesto aprobado es de 312 millones de euros, financiados por la Comunidad de Madrid y el Ministerio de Transportes a partes iguales dentro del convenio de metro firmado en 2020.

Los vecinos de Aluche y La Fortuna han recibido el anuncio con expectativa, aunque la afección a las obras en superficie —especialmente en la avenida de los Poblados— ha generado quejas por el ruido y el corte de calles durante los trabajos. La previsión de inauguración es el cuarto trimestre de 2026, aunque Metro de Madrid no descarta ajustes si los sondeos geotécnicos presentan complicaciones.`,
    status: 'published' as const,
    category: 'transport' as const,
    districtId: 'latina',
    authorId: AUTHOR_ID,
    publishedAt: pub(148, 5),
  },
  {
    id: 'rep-004',
    title: 'BiciMAD: de experimento fallido a red de 10.000 bicicletas eléctricas',
    slug: 'bicimad-expansion-red-electrica',
    summary: 'El sistema de bicicletas públicas eléctricas de Madrid ha experimentado una transformación radical desde su relanzamiento en 2021. Con más de 10.000 unidades y 700 estaciones, BiciMAD se ha convertido en la mayor red de bici pública eléctrica de Europa.',
    content: `El primer BiciMAD, lanzado en 2014 con solo 23 estaciones y tarifas elevadas, fue un fracaso comercial que costó al Ayuntamiento millones en rescate a la empresa concesionaria. La segunda etapa, iniciada en 2021 bajo gestión directa de la EMT, cambió radicalmente el modelo: tarifas asequibles, integración con el abono transporte y expansión progresiva por todos los distritos.

En 2025, la red alcanzó las 712 estaciones y 10.200 bicicletas eléctricas en servicio, con una media de 85.000 viajes diarios en primavera. El perfil del usuario ha evolucionado: los estudiantes y trabajadores jóvenes representan el 60% del uso en días laborables, mientras que los turistas dominan los fines de semana en Centro, Retiro y Salamanca.

El gran reto pendiente es la equidad territorial. Distritos del sur como Villaverde, Vallecas o Usera tienen una cobertura muy inferior a la de los barrios del norte y el centro. La EMT ha anunciado un plan de expansión para 2026 que incluye 80 nuevas estaciones en la periferia sur, con financiación parcial de los fondos europeos Next Generation.`,
    status: 'published' as const,
    category: 'transport' as const,
    districtId: 'centro',
    authorId: AUTHOR_ID,
    publishedAt: pub(130, 1),
  },
  {
    id: 'rep-005',
    title: 'Matadero Madrid cumple quince años como referente cultural europeo',
    slug: 'matadero-madrid-quince-anos-cultura',
    summary: 'El antiguo matadero municipal de Legazpi, reconvertido en centro de creación contemporánea, celebra quince años de programación experimental. Con más de dos millones de visitantes anuales, se ha consolidado como uno de los espacios culturales más influyentes de la ciudad.',
    content: `El Matadero de Madrid, construido entre 1908 y 1928 según proyecto de Luis Bellido, fue durante décadas el mayor matadero municipal de Europa. Su cierre en 1996 y la posterior rehabilitación —iniciada en 2006 y completada en fases hasta 2011— transformaron el conjunto industrial en una apuesta cultural sin precedentes: 165.000 metros cuadrados destinados íntegramente a la creación contemporánea.

El centro acoge hoy a más de 40 espacios diferenciados: estudios de artistas residentes, salas de exposición, teatros experimentales, instalaciones para artes digitales y la sede del festival de artes Escenas do Cambio. La gestión mixta —Ayuntamiento con cesión a colectivos y empresas culturales— ha permitido mantener una programación diversa sin depender de un único criterio editorial.

A quince años de su apertura plena, Matadero enfrenta el reto de la masificación. Los fines de semana de primavera y verano concentran afluencias que superan su capacidad cómoda. La dirección estudia un sistema de reservas para algunas instalaciones y la creación de una red de aforos escalonados que distribuya mejor los flujos a lo largo del día.`,
    status: 'published' as const,
    category: 'culture' as const,
    districtId: 'arganzuela',
    authorId: AUTHOR_ID,
    publishedAt: pub(112, 7),
  },
  {
    id: 'rep-006',
    title: 'Madrid Río: el parque fluvial que devolvió el Manzanares a los madrileños',
    slug: 'madrid-rio-parque-fluvial-manzanares',
    summary: 'A más de una década de su inauguración, Madrid Río se ha convertido en el pulmón verde más visitado de la capital. Un análisis de su impacto ecológico, social y económico en los distritos del entorno revela resultados positivos pero también tensiones.',
    content: `El soterramiento de la M-30 a lo largo del Manzanares, ejecutado entre 2004 y 2007, liberó 32 kilómetros de ribera que hoy conforman el parque lineal Madrid Río. El espacio, diseñado por el estudio Burgos & Garrido con Porras & La Casta y Rubio & Álvarez-Sala, fue galardonado con el Premio Europeo de Espacio Público Urbano en 2012 y se ha convertido en referencia mundial de renaturalización urbana.

El impacto ecológico ha superado las expectativas. La calidad del agua del Manzanares ha mejorado de forma sostenida, con la reaparición de especies como el martín pescador y la nutria en algunos tramos. El parque alberga más de 33.000 árboles plantados desde su inauguración, y las temperaturas medias en sus inmediaciones son entre 3 y 5 grados inferiores a las registradas en zonas similares sin parque.

Arganzuela, Carabanchel y Latina —los distritos que bordean el parque por el sur— han experimentado una revalorización inmobiliaria media del 18% desde 2010, según datos del Colegio Oficial de Registradores. Esa presión ha generado tensiones con vecinos de larga data que denuncian el encarecimiento de los alquileres y los procesos de gentrificación acelerada en barrios como Embajadores y Acacias.`,
    status: 'published' as const,
    category: 'environment' as const,
    districtId: 'arganzuela',
    authorId: AUTHOR_ID,
    publishedAt: pub(95, 2),
  },
  {
    id: 'rep-007',
    title: 'AZCA, el distrito financiero que envejeció: retos y oportunidades de regeneración',
    slug: 'azca-distrito-financiero-regeneracion',
    summary: 'El polígono financiero de AZCA, construido en los años setenta como Manhattan madrileño, acumula edificios obsoletos, espacios públicos hostiles y tasas de desocupación crecientes. Un estudio analiza las vías para su reinvención.',
    content: `AZCA fue proyectada en los años sesenta como el centro financiero y empresarial de la nueva Madrid. El conjunto, que incluye torres emblemáticas como la Torre Picasso, el edificio BBVA de Sainz de Oiza o el Centro Comercial ABC Serrano, llegó a concentrar en los ochenta las sedes de los principales bancos y multinacionales del país. Hoy, sin embargo, presenta síntomas evidentes de obsolescencia.

Las tasas de desocupación de oficinas en AZCA rondan el 22%, muy por encima de la media del mercado prime madrileño (6%). Muchos de sus edificios, construidos según estándares energéticos de los setenta, requieren inversiones millonarias para alcanzar las certificaciones BREEAM o LEED que exigen los grandes inquilinos internacionales. El espacio público —la plataforma elevada que separa AZCA de la Castellana— resulta inhóspito para el peatón y ha sido abandonado como lugar de encuentro.

El Ayuntamiento y la Comunidad estudian un plan de rehabilitación que contemple la rebaja de la plataforma, la conexión peatonal fluida con la Castellana y la diversificación de usos hacia residencial, hoteles y equipamientos. Algunos propietarios ya han iniciado rehabilitaciones integrales: el antiguo edificio Windsor, destruido por un incendio en 2005 y reconstruido como Torre Espacio Residences, podría marcar el camino.`,
    status: 'published' as const,
    category: 'economy' as const,
    districtId: 'chamartin',
    authorId: AUTHOR_ID,
    publishedAt: pub(78, 6),
  },
  {
    id: 'rep-008',
    title: 'Lavapiés: laboratorio de convivencia intercultural en el corazón de Madrid',
    slug: 'lavapies-convivencia-intercultural-madrid',
    summary: 'El barrio de Lavapiés alberga ciudadanos de más de 80 nacionalidades en menos de un kilómetro cuadrado. Un análisis de su tejido social, sus fricciones y los factores que lo han convertido en referente de diversidad urbana en Europa.',
    content: `Lavapiés es el barrio más diverso de Madrid y uno de los más plurales de Europa. Según datos del padrón municipal de 2025, el 43% de sus residentes son nacidos fuera de España, con comunidades bangladesíes, senegalesas, chinas, pakistaníes y latinoamericanas que conviven en una malla de calles estrechas trazadas sobre el antiguo barrio hebreo medieval.

La convivencia no está exenta de tensiones. Los conflictos por ruido en locales de hostelería nocturna, la economía sumergida en torno al top manta y las dificultades de integración escolar en algunos centros públicos generan fricciones periódicas que el Ayuntamiento intenta gestionar con programas de mediación comunitaria. La presión turística —Lavapiés está en pleno centro y es destino de turismo alternativo— añade una capa de tensión extra con los vecinos.

Sin embargo, el barrio ha desarrollado una identidad cultural única que lo distingue dentro de la ciudad. La oferta gastronómica internacional, los espacios de arte emergente como el CA2M o La Tabacalera, y la actividad asociativa intensa —con más de 200 colectivos censados— hacen de Lavapiés un caso de estudio para urbanistas, sociólogos y gestores culturales de todo el mundo. El reto es preservar esa diversidad frente al avance de la gentrificación.`,
    status: 'published' as const,
    category: 'culture' as const,
    districtId: 'centro',
    authorId: AUTHOR_ID,
    publishedAt: pub(54, 4),
  },
  {
    id: 'rep-009',
    title: 'Calidad del aire en Madrid 2025: avances reales y los retos que persisten',
    slug: 'calidad-aire-madrid-2025-avances-retos',
    summary: 'Los niveles de dióxido de nitrógeno en el centro de Madrid han caído un 35% respecto a 2018, según los datos de la red de medición municipal. Pero la contaminación por partículas finas sigue superando los límites recomendados por la OMS en varios puntos de la ciudad.',
    content: `La implementación de Madrid Central en 2018 y su posterior expansión a Madrid 360 en 2022 han producido una mejora estadísticamente significativa en la calidad del aire del área central de la ciudad. Los niveles de NO₂ —el contaminante más vinculado al tráfico diésel— registran en 2025 los valores más bajos desde que existen datos sistemáticos de la red de medición, con medias anuales de 28 µg/m³ en estaciones del centro frente a los 42 µg/m³ de 2018.

Sin embargo, el cuadro completo es más matizado. Las partículas PM2.5, cuya fuente principal en Madrid es la calefacción —especialmente en zonas de vivienda antigua con calderas de gasóleo—, superan aún en varios puntos los 10 µg/m³ recomendados por la OMS en sus guías de 2021. Los distritos con mayor concentración de edificios anteriores a 1980 —Latina, Carabanchel y Puente de Vallecas— muestran los peores registros de PM2.5 en los meses de invierno.

El plan de calefacción sostenible del Ayuntamiento, dotado con 45 millones en ayudas a la rehabilitación energética, avanza a un ritmo inferior al previsto por la complejidad burocrática de las comunidades de propietarios. Los expertos advierten que sin una aceleración del parque de calderas y un avance firme en la electrificación del transporte de mercancías, los objetivos del Plan Aire 2030 serán difíciles de alcanzar.`,
    status: 'published' as const,
    category: 'environment' as const,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: pub(31, 8),
  },
  {
    id: 'rep-010',
    title: 'El mercado de la vivienda en Madrid: análisis de precio y acceso por distritos',
    slug: 'mercado-vivienda-madrid-precio-acceso-distritos',
    summary: 'El precio medio del alquiler en Madrid capital ha superado por primera vez los 1.800 euros mensuales para un piso de dos habitaciones. Un análisis distrito a distrito revela brechas de accesibilidad que se han duplicado en los últimos cinco años.',
    content: `Madrid vive la mayor tensión en su mercado residencial desde la burbuja de 2007. El precio medio del alquiler de un piso de dos habitaciones alcanzó en el primer trimestre de 2026 los 1.847 euros mensuales, un 22% más que en 2022 y un 61% por encima del nivel de 2018. La brecha entre distritos es extrema: Salamanca lidera con 2.450 euros de media, frente a los 1.050 euros de Villaverde o los 1.120 de Vallecas.

El problema de accesibilidad es estructural. Un hogar de renta media en Madrid —unos 33.000 euros anuales según los datos del INE— destina hoy más del 45% de su ingreso bruto al alquiler si vive en el centro. La recomendación de los economistas de vivienda es que ese porcentaje no supere el 30%, lo que significa que solo los hogares por encima de la renta media pueden afrontar sin esfuerzo una vivienda en alquiler en el eje Salamanca-Chamberí-Centro.

La respuesta política combina medidas de corto y largo plazo. El Ayuntamiento ha impulsado la compra de suelo para vivienda pública en los nuevos desarrollos de Vallecas y Vicálvaro, y ha activado el derecho de tanteo en operaciones de grandes tenedores. Sin embargo, los expertos advierten que el ritmo de producción de VPO —unas 2.000 unidades anuales en toda la Comunidad— es muy inferior a la demanda estructural, estimada en al menos 8.000 viviendas asequibles nuevas al año solo en la capital.`,
    status: 'draft' as const,
    category: 'economy' as const,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: null,
  },
  {
    id: 'rep-011',
    title: 'Villaverde industrial: de fábricas cerradas a polígono de innovación',
    slug: 'villaverde-industrial-fabricas-innovacion',
    summary: 'El distrito más industrial de Madrid afronta la reconversión de sus polígonos históricos con proyectos de economía circular y manufactura avanzada. El plan municipal apuesta por retener empleo cualificado en el sur sin expulsar a las actividades logísticas existentes.',
    content: `Villaverde fue durante el siglo XX el motor industrial de Madrid. Las factorías de Boetticher y Navarro, Barreiros, Standard Eléctrica o Osram dieron trabajo a generaciones de familias del sur de la capital. El cierre progresivo de esas plantas desde los años ochenta dejó un paisaje de naves vacías, solares degradados y paro estructural que aún hoy supera en varios puntos la media de la ciudad.

La estrategia de reindustrialización que impulsa el Ayuntamiento desde 2023 apuesta por atraer empresas de manufactura avanzada, impresión 3D industrial y economía circular a los polígonos de Villaverde Alto y Villaverde Bajo. El proyecto estrella es el Hub de Economía Circular del Manzanares, que ocupa la antigua planta de tratamiento de residuos de la Comunidad y alberga ya a doce empresas de reciclaje de materiales críticos con 340 empleos directos.

El reto es compatibilizar la llegada de nuevas actividades con el tejido existente. Los transportistas y almacenistas que ocupan la mayor parte del suelo industrial villaverdense temen la presión especulativa que suele acompañar a los proyectos de innovación. El plan zonal establece una reserva del 40% del suelo reconvertido para usos logísticos de proximidad, aunque su cumplimiento efectivo dependerá de la gestión de los planes parciales que se tramiten en los próximos años.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'villaverde',
    authorId: AUTHOR_ID,
    publishedAt: pub(22, 3),
  },
  {
    id: 'rep-012',
    title: 'Puente de Vallecas: la renta más baja de Madrid y su apuesta por el comercio local',
    slug: 'puente-vallecas-renta-comercio-local',
    summary: 'Con una renta media por hogar un 38% inferior a la media de Madrid, Puente de Vallecas combina alta densidad comercial en sus calles principales con una economía de proximidad que resiste frente a las grandes superficies. Un retrato de su tejido económico y social.',
    content: `Puente de Vallecas tiene la renta media por hogar más baja de los veintiún distritos de Madrid: 26.400 euros anuales frente a los 42.600 de la media capitalina. Sin embargo, el distrito tiene una de las tasas más altas de actividad comercial en planta baja de toda la ciudad: las calles Nicolás Morales, Pedro Laborde y la avenida de la Albufera concentran más de 800 locales activos, con una tasa de vacío inferior al 9%.

El modelo comercial de Vallecas es radicalmente distinto al de los distritos del norte. Los negocios de alimentación, ferretería, confección y servicios de proximidad dominan frente a la restauración de moda o las franquicias de lujo. La asociación de comerciantes ACOVA gestiona un mercado de productores los sábados en la plaza de Vallecas que en 2025 sumó 180.000 visitantes, convirtiéndose en el mercado de barrio más concurrido de Madrid sur.

La llegada de grandes superficies a la periferia —el centro comercial Sambil Outlet en Leganés y el Madrid Xanadú en Arroyomolinos atraen a compradores vallecanos— ha erosionado la cuota de ropa y electrónica del comercio local. La respuesta del tejido asociativo pasa por la especialización en productos frescos, la extensión de horarios y la digitalización de una parte del comercio tradicional con apoyo del programa municipal Emprende en el Barrio.`,
    status: 'published' as const,
    category: 'economy' as const,
    districtId: 'puente-vallecas',
    authorId: AUTHOR_ID,
    publishedAt: pub(14, 6),
  },
  {
    id: 'rep-013',
    title: 'San Blas-Canillejas: el distrito del deporte y la nueva Ciudad del Fútbol',
    slug: 'san-blas-canillejas-deporte-ciudad-futbol',
    summary: 'San Blas-Canillejas alberga la Ciudad del Fútbol de la RFEF, el WiZink Center y varios complejos deportivos que lo convierten en el distrito con mayor densidad de infraestructura deportiva de Madrid. Su desarrollo urbanístico está condicionado por el peso de esos equipamientos.',
    content: `San Blas-Canillejas es un distrito de contrastes. Al sur, el antiguo barrio obrero de San Blas mantiene una identidad popular fuerte con mercado municipal propio y comercio de barrio activo. Al norte, los polígonos industriales de Canillejas se han transformado en un corredor de grandes equipamientos: el WiZink Center —antiguo Palacio de los Deportes—, la Ciudad del Fútbol de Las Rozas con su antena de la RFEF, y el estadio de atletismo Vallehermoso II definen un paisaje de infraestructura singular en la trama urbana de Madrid.

La llegada de eventos deportivos internacionales al WiZink Center —conciertos de gran formato, finales de la Euroliga de Baloncesto, partidos de la NBA Europe— genera un impacto económico estimado en 85 millones de euros anuales en el entorno del distrito, según un estudio de la Cámara de Comercio de Madrid. Los hosteleros de los accesos a la avenida de Arcentales han multiplicado su facturación los días de evento, aunque también se quejan del colapso de tráfico y transporte público en esas jornadas.

El planeamiento urbanístico del distrito tiene pendiente la resolución del Plan Parcial del Área de Planeamiento Específico de Canillejas, que prevé 4.200 nuevas viviendas y un parque urbano de 18 hectáreas en los terrenos del antiguo estadio de fútbol. La proximidad al aeropuerto de Barajas —y el ruido asociado— condiciona los usos residenciales en la mitad norte del distrito y ha frenado la inversión privada en esa zona durante la última década.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'san-blas',
    authorId: AUTHOR_ID,
    publishedAt: pub(7, 1),
  },
  {
    id: 'rep-014',
    title: 'Madrid gastronómica: la capital supera a Barcelona en reservas de turismo culinario',
    slug: 'madrid-gastronomica-turismo-culinario',
    summary: 'Por primera vez, Madrid supera a Barcelona en número de reservas de turismo gastronómico internacional, según datos de TheFork y el Observatorio de Turismo de la Comunidad. El fenómeno tiene epicentros claros: Chueca, el Mercado de San Miguel y los nuevos gastromercados del sur.',
    content: `El turismo gastronómico ha sido el segmento de mayor crecimiento en Madrid durante los últimos tres años. Según datos del Observatorio de Turismo de la Comunidad de Madrid, en 2025 la capital registró 4,2 millones de visitas motivadas principalmente por la experiencia culinaria, superando por primera vez a Barcelona (3,8 millones) en este segmento específico. La clave no es solo la proliferación de restaurantes con estrella Michelin —Madrid tiene ya 27, frente a los 24 de 2022—, sino la democratización de una oferta gastronómica de calidad en todos los rangos de precio.

El Mercado de San Miguel, el Mercado de San Antón en Chueca y el Mercado de Vallehermoso en Chamberí son los nodos más fotografiados de esa oferta, pero el fenómeno se extiende a nuevos espacios. El Gastromercado de Legazpi, inaugurado en 2024 en las naves rehabilitadas del antiguo mercado de ganados, ha atraído en su primer año de funcionamiento a 1,1 millones de visitantes y ha generado 420 empleos directos en el entorno de Arganzuela.

El impacto sobre el tejido de restauración tradicional genera debate. Los restaurantes de toda la vida en barrios como La Latina o Huertas conviven cada vez más incómodos con locales orientados al turista de alto poder adquisitivo que ha disparado sus alquileres comerciales. La Asociación de Hostelería de Madrid pide al Ayuntamiento una zonificación que proteja los locales históricos de la presión especulativa, similar a la figura de los comercios emblemáticos que ya existe en Barcelona y en el propio municipio de Madrid para el comercio minorista.`,
    status: 'published' as const,
    category: 'tourism' as const,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: pub(3, 5),
  },
  {
    id: 'rep-015',
    title: 'El Retiro renueva sus estanques: inversión histórica en el parque más visitado de Madrid',
    slug: 'retiro-renueva-estanques-inversion',
    summary: 'El Ayuntamiento ha aprobado una inversión de 18 millones para restaurar los estanques del Retiro, renovar su red de riego y rehabilitar el Palacio de Cristal. Es la mayor intervención en el parque desde su catalogación como Patrimonio Mundial de la UNESCO en 2021.',
    content: `El Parque del Retiro recibe más de 15 millones de visitas al año, lo que lo convierte en el espacio verde más frecuentado de España. A pesar de su popularidad, sus infraestructuras hídricas llevan décadas sin una renovación integral: las tuberías de distribución del estanque grande datan en parte de los años cincuenta y presentan pérdidas estimadas en un 30% del caudal circulante.

El plan aprobado contempla tres fases. La primera, ya en ejecución, aborda la sustitución de la red de tuberías del estanque grande y la instalación de un sistema de filtración que reducirá el consumo de agua en un 40%. La segunda fase restaurará el Palacio de Cristal —con un nuevo sistema de climatización pasiva que protegerá las colecciones del Reina Sofía que alberga— y la tercera acondicionará los jardines de la Rosaleda con variedades autóctonas resistentes a la sequía.`,
    status: 'published' as const,
    category: 'environment' as const,
    districtId: 'retiro',
    authorId: AUTHOR_ID,
    publishedAt: pub(170, 2),
  },
  {
    id: 'rep-016',
    title: 'Salamanca: el distrito más caro de Madrid endurece la presión sobre el pequeño comercio',
    slug: 'salamanca-presion-pequeno-comercio',
    summary: 'El precio medio del alquiler comercial en el distrito de Salamanca ha superado los 90 euros por metro cuadrado al mes en las calles Serrano, Goya y Velázquez. La presión empuja hacia el cierre a los comercios tradicionales que no pueden asumir las nuevas rentas.',
    content: `Salamanca es el distrito con la renta per cápita más alta de Madrid y uno de los corredores comerciales de lujo más densos de Europa. La concentración de firmas internacionales de moda, joyerías y restaurantes de alta gama en el eje Serrano-Ortega y Gasset ha disparado los precios del suelo comercial hasta niveles que hacen inviable la permanencia de negocios de proximidad: tintorerías, papelerías, ferreterías y pequeñas fruterías han desaparecido del barrio a un ritmo de veinte locales por año desde 2020.

Las asociaciones de vecinos del distrito, lideradas por la Asociación de Barrios de Salamanca, piden al Ayuntamiento que extienda la figura de los comercios emblemáticos —que ya protege a 33 establecimientos históricos en el barrio— y que fije un coeficiente corrector en el IBI para locales con contratos de arrendamiento largo a negocios de proximidad. El debate sobre qué ciudad se quiere para Salamanca —un gran centro comercial de lujo a cielo abierto o un barrio donde también se pueda comprar el pan— es cada vez más intenso.`,
    status: 'published' as const,
    category: 'economy' as const,
    districtId: 'salamanca',
    authorId: AUTHOR_ID,
    publishedAt: pub(155, 4),
  },
  {
    id: 'rep-017',
    title: 'Tetuán multicultural: convivencia y tensión en el distrito con más orígenes del norte de Madrid',
    slug: 'tetuan-multicultural-convivencia-tension',
    summary: 'Tetuán concentra comunidades de 110 nacionalidades distintas en un territorio de apenas 7 km². El distrito ha pasado en dos décadas de ser un barrio obrero homogéneo a convertirse en el espacio de mayor diversidad étnica del norte de Madrid, con todas las oportunidades y fricciones que eso implica.',
    content: `La transformación de Tetuán ha sido una de las más rápidas de Madrid. El barrio, históricamente vinculado a la clase trabajadora industrial, recibió desde los años noventa sucesivas oleadas migratorias: primero latinoamericanos, después marroquíes y argelinos, más tarde subsaharianos y, en los últimos años, venezolanos y colombianos que huyen de la crisis de sus países. Hoy el 38% de su padrón es de origen extranjero, con una concentración especialmente alta en los barrios de Bellas Vistas y Valdeacederas.

La convivencia genera riqueza cultural —mercados informales, restaurantes de cocinas del mundo, festividades religiosas que colorean el calendario del barrio— pero también tensiones sobre el uso del espacio público y la integración escolar. El colegio público Menéndez Pidal tiene alumnado de 42 nacionalidades y ha desarrollado un programa de mediación intercultural reconocido a nivel europeo. El Ayuntamiento gestiona en Tetuán cuatro centros de atención a inmigrantes, aunque los trabajadores sociales advierten de que la demanda supera ampliamente la capacidad instalada.`,
    status: 'published' as const,
    category: 'general' as const,
    districtId: 'tetuan',
    authorId: AUTHOR_ID,
    publishedAt: pub(140, 7),
  },
  {
    id: 'rep-018',
    title: 'Chamberí y el dilema de la densificación: crecer en vertical o preservar el barrio',
    slug: 'chamberi-densificacion-vertical-preservar',
    summary: 'Chamberí es uno de los distritos con menor suelo vacante de Madrid y sus vecinos llevan años debatiendo si permitir la elevación de plantas en edificios existentes para generar nueva vivienda. El debate enfrenta a asociaciones vecinales, promotores y al propio Ayuntamiento.',
    content: `Chamberí tiene una de las densidades residenciales más altas de Madrid —más de 25.000 habitantes por kilómetro cuadrado— y prácticamente ningún solar disponible para nueva edificación. La única vía para aumentar el parque de viviendas en el barrio pasa por la rehabilitación de edificios existentes o la polémica densificación vertical: permitir añadir plantas en edificios que no han alcanzado su aprovechamiento máximo según el Plan General.

La propuesta divide al barrio. Los promotores y algunos propietarios de edificios ven en la densificación una oportunidad para rentabilizar sus inmuebles y contribuir a la solución del problema de vivienda. Las asociaciones vecinales, encabezadas por la AVV Chamberí Centro, argumentan que añadir plantas cambiará el carácter del barrio, saturará las infraestructuras de saneamiento y agravará los problemas de aparcamiento. El Ayuntamiento estudia un reglamento de densificación selectiva que solo autorizaría la elevación en calles anchas y con acceso a transporte público de alta capacidad.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'chamberi',
    authorId: AUTHOR_ID,
    publishedAt: pub(125, 0),
  },
  {
    id: 'rep-019',
    title: 'Fuencarral-El Pardo: gestionar el monte más grande de Madrid en tiempos de sequía',
    slug: 'fuencarral-el-pardo-monte-sequia',
    summary: 'El Monte de El Pardo, con 15.800 hectáreas de encinar mediterráneo, es el pulmón verde más grande de Madrid y uno de los bosques periurbanos más extensos de Europa. La sequía recurrente y el aumento del turismo de naturaleza ponen a prueba su gestión.',
    content: `El Monte de El Pardo es propiedad del Patrimonio Nacional y limita con el distrito de Fuencarral-El Pardo en casi toda su extensión norte. El encinar, uno de los mejor conservados de la Península Ibérica gracias a siglos de uso exclusivo como coto de caza real, alberga ciervos, jabalíes, buitres leonados y una de las mayores poblaciones de lince ibérico en entorno periurbano.

La sequía de los últimos años ha reducido el nivel del embalse de El Pardo al 34% de su capacidad y ha aumentado el riesgo de incendio en los meses estivales. El plan de gestión forestal aprobado en 2024 incluye la creación de cortafuegos ampliados, la instalación de puntos de agua distribuidos para la fauna y la limitación de accesos en días de alto riesgo. El turismo de naturaleza, que ha crecido un 60% desde la pandemia, se gestiona mediante un sistema de reservas online con aforo diario máximo de 3.000 visitantes.`,
    status: 'published' as const,
    category: 'environment' as const,
    districtId: 'fuencarral',
    authorId: AUTHOR_ID,
    publishedAt: pub(110, 3),
  },
  {
    id: 'rep-020',
    title: 'Moncloa y la Ciudad Universitaria: el campus más grande de España busca su futuro',
    slug: 'moncloa-ciudad-universitaria-futuro',
    summary: 'La Ciudad Universitaria de Madrid, construida en los años treinta y devastada por la guerra civil, alberga hoy a más de 90.000 estudiantes repartidos entre la UCM y la UPM. Su integración con el tejido urbano de Moncloa-Aravaca es una asignatura pendiente.',
    content: `La Ciudad Universitaria fue proyectada en 1927 como un campus moderno al estilo de los grandes recintos anglosajones, con edificios racionalistas rodeados de zonas verdes y alejados del centro urbano. Noventa años después, el resultado es ambivalente: el campus es hermoso y funcional en sus horas de mayor actividad, pero genera una enorme masa de desplazamientos diarios y una frontera física entre Moncloa y el resto de la ciudad que resulta difícil de franquear a pie o en bicicleta.

El plan de integración urbana impulsado por el Ayuntamiento y las dos universidades contempla la apertura de nuevos accesos desde el metro de Moncloa y Metropolitano, la creación de un carril bici continuo que conecte el campus con el Parque del Oeste y la instalación de servicios de hostelería y comercio en planta baja de los edificios universitarios que dan a las calles perimetrales. El objetivo es que el campus deje de ser una isla y pase a ser una extensión natural del barrio, accesible y activa también fuera del horario lectivo.`,
    status: 'published' as const,
    category: 'education' as const,
    districtId: 'moncloa',
    authorId: AUTHOR_ID,
    publishedAt: pub(97, 5),
  },
  {
    id: 'rep-021',
    title: 'Carabanchel: la cárcel que fue y el barrio que quiere ser',
    slug: 'carabanchel-carcel-transformacion-barrio',
    summary: 'El solar de la antigua cárcel de Carabanchel, demolida en 2008, lleva casi dos décadas vacío en pleno centro del distrito. La disputa entre el Ayuntamiento, la Comunidad y los vecinos sobre su uso futuro refleja las tensiones de un barrio en plena transformación.',
    content: `La prisión de Carabanchel fue durante cuarenta años el mayor centro penitenciario de España y uno de los símbolos más oscuros del franquismo. Su demolición en 2008 generó una herida urbana de casi siete hectáreas en el corazón del distrito que todavía no ha cicatrizado. El solar, propiedad del Ministerio de Defensa, ha sido objeto de negociaciones interminables sobre su cesión y uso sin que ningún proyecto haya prosperado.

Las asociaciones vecinales de Carabanchel reivindican mayoritariamente que el solar se destine a un gran parque público con equipamientos culturales y deportivos, en un distrito que tiene uno de los ratios de zona verde por habitante más bajos de Madrid. El Ayuntamiento ha propuesto alternativamente un modelo mixto con parque, vivienda pública y un centro de salud. La Comunidad, propietaria de una parte del suelo colindante, plantea incorporar una residencia universitaria. La resolución del conflicto de usos marcará el perfil del Carabanchel de la próxima generación.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'carabanchel',
    authorId: AUTHOR_ID,
    publishedAt: pub(83, 1),
  },
  {
    id: 'rep-022',
    title: 'Usera: el barrio chino de Madrid y su economía étnica de 200 millones al año',
    slug: 'usera-barrio-chino-economia-etnica',
    summary: 'Usera alberga la comunidad china más numerosa de Madrid y la segunda de España. Sus restaurantes, supermercados y empresas de importación generan una economía étnica estimada en 200 millones de euros anuales que ha transformado radicalmente el comercio del barrio.',
    content: `La calle Pradillo y sus alrededores en Usera constituyen el núcleo del barrio chino de Madrid, un espacio económico y cultural que no tiene equivalente en ningún otro punto de la capital. Los más de 20.000 ciudadanos de origen chino empadronados en Usera —sobre un total de 140.000 en toda España— han construido un ecosistema comercial autosuficiente: supermercados con productos de importación directa, restaurantes de cocina regional china, bazares mayoristas, academias de idiomas y negocios de servicios orientados a la comunidad.

El impacto económico trasciende la comunidad china. Los restaurantes de Usera son destino gastronómico de madrileños de toda la ciudad, y el Año Nuevo Chino convoca decenas de miles de visitantes que llenan el barrio durante varios días. Sin embargo, la barrera lingüística y la tendencia de la comunidad a resolver sus necesidades dentro del propio ecosistema étnico dificultan la integración plena en las estructuras de participación ciudadana del distrito. El Ayuntamiento ha creado un servicio de mediación cultural específico para Usera, aunque la dotación de mediadores es aún insuficiente según los trabajadores sociales del área.`,
    status: 'published' as const,
    category: 'economy' as const,
    districtId: 'usera',
    authorId: AUTHOR_ID,
    publishedAt: pub(68, 6),
  },
  {
    id: 'rep-023',
    title: 'Moratalaz: el barrio tranquilo que envejece y busca relevo generacional',
    slug: 'moratalaz-envejecimiento-relevo-generacional',
    summary: 'Moratalaz tiene la población más envejecida de Madrid: el 28% de sus residentes supera los 65 años. El reto de atraer familias jóvenes y renovar el tejido social del barrio sin alterar su carácter tranquilo centra el debate político y vecinal.',
    content: `Moratalaz fue construido entre los años sesenta y setenta como un barrio de vivienda social densa para trabajadores industriales que llegaban del campo. Esa generación fundadora, ya jubilada, domina hoy el padrón del distrito. La tasa de envejecimiento —28% de mayores de 65— es la más alta de Madrid y genera una demanda creciente de servicios de proximidad, atención domiciliaria y accesibilidad en el espacio público que el Ayuntamiento no siempre puede cubrir con los recursos asignados al distrito.

El parque de viviendas, construido en bloque abierto con amplias zonas verdes entre edificios, resulta atractivo para familias jóvenes que buscan espacio a precios más asequibles que en el centro. El precio medio del metro cuadrado en Moratalaz es un 35% inferior al de la media de Madrid, lo que ha empezado a generar una tímida llegada de familias con hijos. El colegio público Federico García Lorca ha aumentado sus matrículas un 18% en los últimos tres años, señal de que el relevo generacional, lento pero real, está en marcha.`,
    status: 'published' as const,
    category: 'general' as const,
    districtId: 'moratalaz',
    authorId: AUTHOR_ID,
    publishedAt: pub(58, 4),
  },
  {
    id: 'rep-024',
    title: 'Ciudad Lineal: el sueño de Arturo Soria cumple 130 años con nuevas presiones urbanas',
    slug: 'ciudad-lineal-arturo-soria-130-anos',
    summary: 'La Ciudad Lineal que proyectó Arturo Soria en 1892 como alternativa al modelo urbano radial sigue siendo reconocible en su trama de calles arboladas y parcelas generosas. Pero la presión del crecimiento de Madrid amenaza con desnaturalizar su herencia urbanística.',
    content: `Arturo Soria concibió la Ciudad Lineal como una solución al hacinamiento de las ciudades industriales: una banda residencial de ancho fijo, cruzada por un tranvía central y bordeada de jardines, que se extendería linealmente por el territorio sin los problemas de congestión del modelo radial. El proyecto original, que llegó a construirse en varios kilómetros de la actual Calle de Arturo Soria, fue el primer ejemplo mundial de urbanismo lineal y anticipó debates que siguen vigentes en el urbanismo contemporáneo.

El distrito que lleva su nombre conserva en parte esa herencia: parcelas más amplias que en el centro, arbolado generoso en las calles principales y una mezcla de usos residenciales, comerciales y equipamientos que hace los barrios más autosuficientes. Pero la presión del mercado inmobiliario ha generado una oleada de sustitución de viviendas unifamiliares y edificios de baja altura por bloques de seis o más plantas que alteran la escala del barrio. Las asociaciones vecinales han conseguido catalogar como bien protegido el tramo original de la calle Arturo Soria, pero el resto del distrito carece de protección equivalente.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'ciudad-lineal',
    authorId: AUTHOR_ID,
    publishedAt: pub(47, 2),
  },
  {
    id: 'rep-025',
    title: 'Hortaleza: tecnología y logística en el distrito que creció junto al aeropuerto',
    slug: 'hortaleza-tecnologia-logistica-aeropuerto',
    summary: 'Hortaleza alberga el mayor parque tecnológico de Madrid —el Parque Empresarial La Moraleja— y una densa red de polígonos logísticos vinculados a la proximidad del aeropuerto de Barajas. El reto es integrar esa actividad económica con la vida residencial del distrito.',
    content: `La Moraleja es la dirección más cotizada del mercado de oficinas prime en el norte de Madrid. El parque empresarial, que se extiende a ambos lados de la A-1, alberga las sedes españolas de Microsoft, Oracle, Maersk y más de 300 empresas tecnológicas y de consultoría. La proximidad al aeropuerto —15 minutos en coche— y la oferta residencial de calidad en las urbanizaciones adyacentes hacen de La Moraleja la elección habitual de los ejecutivos internacionales que trabajan en Madrid.

La convivencia entre el uso empresarial y el residencial no está exenta de tensiones. El tráfico en hora punta en los accesos a La Moraleja colapsa varias arterias del distrito, y los vecinos de las urbanizaciones se quejan del ruido de los camiones de reparto que acceden a los polígonos logísticos de Hortaleza en horario nocturno. El Plan de Movilidad de Hortaleza, presentado en 2025, propone un carril bus exprés desde Arturo Soria hasta el parque empresarial y la regulación de los horarios de reparto de última milla para reducir el impacto acústico.`,
    status: 'published' as const,
    category: 'economy' as const,
    districtId: 'hortaleza',
    authorId: AUTHOR_ID,
    publishedAt: pub(38, 7),
  },
  {
    id: 'rep-026',
    title: 'Villa de Vallecas: el PAU que prometió ciudad y aún espera dotaciones',
    slug: 'villa-vallecas-pau-dotaciones-pendientes',
    summary: 'El PAU de Vallecas, uno de los mayores desarrollos residenciales de Madrid con 16.000 viviendas, lleva dos décadas esperando los equipamientos públicos prometidos en el plan urbanístico. Colegios, centros de salud y zonas verdes siguen siendo insuficientes para una población que ya supera los 60.000 habitantes.',
    content: `El Plan de Actuación Urbanística de Vallecas fue aprobado en los años noventa como una de las grandes respuestas al déficit de vivienda en Madrid sur. Las primeras familias llegaron a principios de los 2000 a bloques recién terminados rodeados de descampados, con una única línea de autobús y sin dotaciones básicas. Dos décadas después, la situación ha mejorado pero sigue sin completarse: faltan dos centros de salud, el instituto público IES Pablo Neruda opera con barracones desde hace ocho años y el parque central prometido en el plan parcial acumula retrasos indefinidos.

La asociación de vecinos AMPA-PAU Vallecas ha documentado en un informe las 23 dotaciones públicas comprometidas en el plan urbanístico que aún no se han ejecutado o están en estado de proyecto sin financiación aprobada. El Ayuntamiento reconoce el déficit pero lo atribuye a las restricciones presupuestarias de los años de crisis y a la complejidad de los convenios urbanísticos con los promotores privados. La Comunidad de Madrid, responsable de educación y sanidad, ha anunciado la licitación de un nuevo centro de salud para 2026, aunque los plazos de ejecución superarán con seguridad los dos años.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'villa-vallecas',
    authorId: AUTHOR_ID,
    publishedAt: pub(25, 0),
  },
  {
    id: 'rep-027',
    title: 'Vicálvaro: el ecobarrio que intenta demostrar que la sostenibilidad es compatible con el precio asequible',
    slug: 'vicalvaro-ecobarrio-sostenibilidad-asequible',
    summary: 'El desarrollo residencial de Valdecarros, en Vicálvaro, es el primer gran barrio de Madrid diseñado desde el origen con criterios de eficiencia energética y movilidad sostenible. Con 52.000 viviendas previstas, será el mayor nuevo barrio de Europa cuando esté terminado.',
    content: `Valdecarros es la mayor actuación urbanística en marcha en Madrid y una de las más grandes de Europa. El plan, aprobado definitivamente en 2022 tras años de litigio judicial, prevé 52.000 viviendas —el 30% con algún tipo de protección— en un ámbito de 10 millones de metros cuadrados al sur del municipio de Vicálvaro. La gran apuesta diferencial respecto a los PAU de los noventa es la integración de la sostenibilidad desde el diseño: edificios de consumo casi nulo, red de calor y frío centralizada de fuente renovable, carril bici como eje estructurante y reserva de suelo para huertos urbanos.

El reto más inmediato es la conectividad. Valdecarros está hoy prácticamente incomunicado en transporte público: la línea de metro más próxima queda a 4 kilómetros. El plan de movilidad asociado prevé la extensión de la Línea 9 de metro hasta el corazón del nuevo barrio, pero esa infraestructura no estará disponible hasta al menos 2029, cuando las primeras viviendas ya estarán ocupadas. Los expertos en urbanismo advierten de que si los primeros residentes consolidan el hábito del coche, será muy difícil revertirlo aunque llegue el metro.`,
    status: 'published' as const,
    category: 'urban_development' as const,
    districtId: 'vicalvaro',
    authorId: AUTHOR_ID,
    publishedAt: pub(16, 3),
  },
  {
    id: 'rep-028',
    title: 'Barajas: vivir junto al aeropuerto más grande de España',
    slug: 'barajas-vivir-junto-aeropuerto',
    summary: 'Los 50.000 vecinos de Barajas conviven con el mayor aeropuerto de España en una relación de amor y odio: el empleo que genera el hub de Adolfo Suárez es vital para el distrito, pero el ruido de los aviones y el tráfico de mercancías deterioran la calidad de vida de miles de familias.',
    content: `El aeropuerto Adolfo Suárez Madrid-Barajas es el mayor empleador de la región: 180.000 puestos de trabajo directos e inducidos, entre operadores de tierra, personal de compañías aéreas, trabajadores de carga y empleados del polígono industrial de Cobo Calleja, directamente vinculado a la actividad aeroportuaria. Para Barajas, el aeropuerto es la razón de ser económica del distrito y la principal fuente de empleo de sus familias.

Pero la proximidad tiene un precio. Las rutas de aproximación a las pistas 36L y 36R pasan directamente sobre los barrios de Barajas pueblo y Alameda de Osuna, con niveles de ruido que superan los 65 decibelios en períodos de máximo tráfico. El mapa de afección acústica publicado por AENA en 2024 muestra que más de 12.000 viviendas del distrito están en la zona de incomodidad severa. La comunidad de vecinos Barajas Silencioso lleva ocho años litigando ante la Audiencia Nacional para obligar a AENA a instalar ventanas de doble acristalamiento en las viviendas más afectadas, con resultados parciales.`,
    status: 'published' as const,
    category: 'general' as const,
    districtId: 'barajas',
    authorId: AUTHOR_ID,
    publishedAt: pub(9, 6),
  },
];

const REPORT_TAGS: { reportId: string; tagId: string }[] = [
  { reportId: 'rep-001', tagId: 'urbanismo' },
  { reportId: 'rep-001', tagId: 'vivienda' },
  { reportId: 'rep-002', tagId: 'urbanismo' },
  { reportId: 'rep-002', tagId: 'patrimonio' },
  { reportId: 'rep-003', tagId: 'metro' },
  { reportId: 'rep-003', tagId: 'movilidad' },
  { reportId: 'rep-004', tagId: 'ciclismo' },
  { reportId: 'rep-004', tagId: 'movilidad' },
  { reportId: 'rep-004', tagId: 'sostenibilidad' },
  { reportId: 'rep-005', tagId: 'cultura' },
  { reportId: 'rep-005', tagId: 'patrimonio' },
  { reportId: 'rep-006', tagId: 'medioambiente' },
  { reportId: 'rep-006', tagId: 'sostenibilidad' },
  { reportId: 'rep-007', tagId: 'economia' },
  { reportId: 'rep-007', tagId: 'urbanismo' },
  { reportId: 'rep-008', tagId: 'cultura' },
  { reportId: 'rep-008', tagId: 'urbanismo' },
  { reportId: 'rep-009', tagId: 'medioambiente' },
  { reportId: 'rep-009', tagId: 'salud' },
  { reportId: 'rep-009', tagId: 'sostenibilidad' },
  { reportId: 'rep-010', tagId: 'vivienda' },
  { reportId: 'rep-010', tagId: 'economia' },
  { reportId: 'rep-011', tagId: 'urbanismo' },
  { reportId: 'rep-011', tagId: 'innovacion' },
  { reportId: 'rep-011', tagId: 'sostenibilidad' },
  { reportId: 'rep-012', tagId: 'economia' },
  { reportId: 'rep-012', tagId: 'urbanismo' },
  { reportId: 'rep-013', tagId: 'urbanismo' },
  { reportId: 'rep-013', tagId: 'deporte' },
  { reportId: 'rep-014', tagId: 'turismo' },
  { reportId: 'rep-014', tagId: 'economia' },
  { reportId: 'rep-014', tagId: 'cultura' },
  { reportId: 'rep-015', tagId: 'medioambiente' },
  { reportId: 'rep-015', tagId: 'patrimonio' },
  { reportId: 'rep-016', tagId: 'economia' },
  { reportId: 'rep-016', tagId: 'vivienda' },
  { reportId: 'rep-017', tagId: 'urbanismo' },
  { reportId: 'rep-018', tagId: 'urbanismo' },
  { reportId: 'rep-018', tagId: 'vivienda' },
  { reportId: 'rep-019', tagId: 'medioambiente' },
  { reportId: 'rep-019', tagId: 'sostenibilidad' },
  { reportId: 'rep-020', tagId: 'educacion' },
  { reportId: 'rep-020', tagId: 'movilidad' },
  { reportId: 'rep-021', tagId: 'urbanismo' },
  { reportId: 'rep-021', tagId: 'vivienda' },
  { reportId: 'rep-022', tagId: 'economia' },
  { reportId: 'rep-022', tagId: 'cultura' },
  { reportId: 'rep-023', tagId: 'salud' },
  { reportId: 'rep-024', tagId: 'urbanismo' },
  { reportId: 'rep-024', tagId: 'patrimonio' },
  { reportId: 'rep-025', tagId: 'economia' },
  { reportId: 'rep-025', tagId: 'innovacion' },
  { reportId: 'rep-025', tagId: 'transporte' },
  { reportId: 'rep-026', tagId: 'urbanismo' },
  { reportId: 'rep-026', tagId: 'vivienda' },
  { reportId: 'rep-027', tagId: 'urbanismo' },
  { reportId: 'rep-027', tagId: 'sostenibilidad' },
  { reportId: 'rep-027', tagId: 'movilidad' },
  { reportId: 'rep-028', tagId: 'transporte' },
  { reportId: 'rep-028', tagId: 'medioambiente' },
];

const NEWS_ITEMS = [
  {
    id: 'nws-001',
    title: 'BiciMAD amplía 80 nuevas estaciones en los distritos del sur',
    slug: 'bicimad-amplia-80-estaciones-sur',
    summary: 'La EMT ha licitado la instalación de 80 nuevas estaciones de BiciMAD en Villaverde, Carabanchel, Vallecas y Usera. La ampliación, financiada con fondos Next Generation, estará operativa antes de finales de 2026.',
    content: `La EMT ha adjudicado el contrato de instalación de 80 nuevas estaciones de BiciMAD en los cuatro distritos del sur con menor cobertura actual. Cada estación contará con entre 12 y 20 puntos de anclaje y paneles solares para la carga autónoma de las bicicletas eléctricas.

La inversión total asciende a 9,4 millones de euros, cubiertos en un 70% por los fondos europeos Next Generation dentro del eje de movilidad urbana sostenible. La EMT prevé que las nuevas estaciones generen un incremento del 25% en los viajes diarios de BiciMAD en esas zonas.`,
    status: 'published' as const,
    source: 'EMT Madrid',
    sourceUrl: null,
    districtId: 'carabanchel',
    authorId: AUTHOR_ID,
    publishedAt: pub(6, 2),
  },
  {
    id: 'nws-002',
    title: 'Corte total en la Línea 1 de Metro durante tres fines de semana de junio',
    slug: 'corte-linea-1-metro-junio',
    summary: 'Metro de Madrid cortará la Línea 1 entre Valdecarros y Pinar de Chamartín los fines de semana del 6, 13 y 20 de junio para renovar la catenaria y actualizar el sistema de señalización. Se habilitarán autobuses lanzadera gratuitos.',
    content: `Metro de Madrid ha anunciado el cierre parcial de la Línea 1 durante tres fines de semana consecutivos en junio para acometer trabajos de modernización que no pueden ejecutarse en horario nocturno habitual. Los trabajos afectarán a la totalidad de la línea entre las 22:00 del viernes y las 6:00 del lunes.

Los autobuses lanzadera cubrirán las paradas afectadas con una frecuencia de cinco minutos en horas punta. Metro recomienda a los usuarios planificar con antelación sus desplazamientos y consultar la app oficial para conocer las rutas alternativas disponibles.`,
    status: 'published' as const,
    source: 'Metro de Madrid',
    sourceUrl: null,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: pub(12, 9),
  },
  {
    id: 'nws-003',
    title: 'Madrid registra 38,4 °C en mayo, el más cálido desde que hay registros',
    slug: 'madrid-record-temperatura-mayo',
    summary: 'La Agencia Estatal de Meteorología ha confirmado que el pasado 21 de mayo fue el día más caluroso registrado en Madrid en el mes de mayo, con 38,4 °C en el observatorio del Retiro. La ola de calor afectó especialmente a los distritos del sur y el este.',
    content: `El observatorio meteorológico del Retiro registró el 21 de mayo una temperatura máxima de 38,4 °C, superando el anterior récord histórico para ese mes (36,2 °C, del 29 de mayo de 1969). La ola de calor, de origen sahariano, afectó a toda la Península Ibérica durante cuatro días con temperaturas anómalas de entre 8 y 12 grados por encima de la media estacional.

Los servicios de emergencia del Ayuntamiento activaron el protocolo de calor extremo con apertura de refugios climatizados en 47 centros cívicos, refuerzo de la atención domiciliaria a mayores dependientes y distribución de agua en los principales puntos de afluencia turística. El Summa 112 atendió 340 llamadas relacionadas con el calor durante el pico de la ola.`,
    status: 'published' as const,
    source: 'AEMET',
    sourceUrl: null,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: pub(4, 11),
  },
  {
    id: 'nws-004',
    title: 'El Ayuntamiento aprueba el nuevo Plan de Movilidad Urbana Sostenible 2026-2030',
    slug: 'plan-movilidad-urbana-sostenible-2026',
    summary: 'El pleno municipal ha aprobado el Plan de Movilidad Urbana Sostenible con 29 votos a favor y 8 abstenciones. El plan contempla 200 km de nuevos carriles bici, la extensión de Madrid 360 a seis distritos más y la electrificación completa de la flota de autobuses de la EMT en 2029.',
    content: `El Plan de Movilidad Urbana Sostenible 2026-2030 ha sido aprobado en el pleno del Ayuntamiento con el apoyo de los grupos municipal del gobierno y la abstención de los grupos de oposición, que han criticado los plazos de ejecución y la falta de dotación presupuestaria garantizada para los últimos años del plan.

Las medidas más destacadas incluyen la extensión de la zona de bajas emisiones Madrid 360 a los distritos de Chamberí, Tetuán, Arganzuela, Retiro, Salamanca y Carabanchel, la construcción de 200 km de carriles bici protegidos y la obligación de que todos los vehículos de reparto de última milla en el centro sean de cero emisiones a partir de 2028.`,
    status: 'published' as const,
    source: 'Ayuntamiento de Madrid',
    sourceUrl: null,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: pub(18, 10),
  },
  {
    id: 'nws-005',
    title: 'El Mercado de San Antón reabre tras seis meses de obras de rehabilitación',
    slug: 'mercado-san-anton-reabre-rehabilitacion',
    summary: 'El icónico mercado de Chueca ha reabierto sus puertas después de seis meses de cierre para acometer obras de mejora estructural, renovación de instalaciones y ampliación de la terraza del tercer piso. La obra ha costado 3,2 millones de euros.',
    content: `El Mercado de San Antón, referencia gastronómica del barrio de Chueca desde su rehabilitación en 2011, ha cerrado la mayor intervención de su historia con la reapertura de todos sus niveles tras seis meses de obras. Los trabajos han incluido la sustitución completa de las instalaciones de climatización, la renovación del sistema de extracción de humos, la ampliación de la terraza superior y la mejora de la accesibilidad en todos los niveles.

Los comerciantes del mercado han operado durante las obras desde una carpa provisional en la calle Augusto Figueroa que, según varios puesteros, ha funcionado mejor de lo esperado y ha mantenido la clientela habitual. La reapertura ha sido celebrada con una jornada de puertas abiertas con degustaciones gratuitas y actuaciones musicales en directo.`,
    status: 'published' as const,
    source: null,
    sourceUrl: null,
    districtId: 'centro',
    authorId: AUTHOR_ID,
    publishedAt: pub(8, 8),
  },
  {
    id: 'nws-006',
    title: 'Nuevo récord de visitantes en el Museo del Prado: 3,8 millones en 2025',
    slug: 'museo-prado-record-visitantes-2025',
    summary: 'El Museo del Prado ha cerrado 2025 con 3,8 millones de visitantes, su cifra más alta en 206 años de historia. El museo atribuye el crecimiento a la exposición temporal sobre Goya y al auge del turismo cultural internacional.',
    content: `El Museo Nacional del Prado ha presentado sus datos de visitas de 2025 con un nuevo máximo histórico de 3.812.000 visitantes, superando el récord anterior de 3,4 millones registrado en 2019. El 68% de los visitantes fueron internacionales, con Estados Unidos, Francia, Alemania y Japón como principales mercados emisores.

La exposición temporal "Goya. La mirada del tiempo", que cerró en enero de 2026 tras cinco meses en cartel, fue visitada por 780.000 personas y se convirtió en la más taquillera de la historia del museo. La dirección del Prado ha anunciado la introducción de un sistema de reservas obligatorias para todos los visitantes a partir de septiembre de 2026 para mejorar la experiencia dentro del edificio.`,
    status: 'published' as const,
    source: 'Museo Nacional del Prado',
    sourceUrl: null,
    districtId: 'retiro',
    authorId: AUTHOR_ID,
    publishedAt: pub(35, 9),
  },
  {
    id: 'nws-007',
    title: 'Huelga de conductores de la EMT convocada para el 15 de junio',
    slug: 'huelga-conductores-emt-junio',
    summary: 'Los sindicatos CCOO y UGT han convocado una huelga de 24 horas en la EMT para el 15 de junio en rechazo al acuerdo salarial propuesto por la empresa. Los servicios mínimos garantizarán el 40% de los servicios en hora punta.',
    content: `Los comités de empresa de la EMT han rechazado la propuesta de convenio colectivo presentada por la dirección, que ofrecía un incremento salarial del 3,5% para 2026 frente al 5,2% que reclaman los trabajadores. Tras el fracaso de la mediación del Servicio de Mediación y Arbitraje de la Comunidad de Madrid, los sindicatos han convocado una huelga de 24 horas para el próximo 15 de junio.

Los servicios mínimos decretados por la Comunidad garantizan el 40% de los servicios en hora punta (7:00-9:00 y 17:00-20:00) y el 25% en el resto del día. El Ayuntamiento recomienda a los usuarios planificar alternativas de transporte y anuncia que el servicio de BiciMAD estará reforzado ese día con personal adicional de mantenimiento.`,
    status: 'published' as const,
    source: 'CCOO Transporte',
    sourceUrl: null,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: pub(2, 7),
  },
  {
    id: 'nws-008',
    title: 'El Ayuntamiento compra suelo en Vallecas para construir 400 viviendas de alquiler asequible',
    slug: 'ayuntamiento-suelo-vallecas-vivienda-asequible',
    summary: 'La Empresa Municipal de la Vivienda ha ejercido el derecho de tanteo para adquirir una parcela de 8.200 m² en Entrevías por 12 millones de euros. Sobre ella se construirán 400 viviendas destinadas al alquiler a precio limitado para jóvenes y familias con renta media.',
    content: `La Empresa Municipal de la Vivienda y Suelo (EMVS) ha formalizado la compra de una parcela residencial en el barrio de Entrevías, en el distrito de Puente de Vallecas, ejerciendo el derecho de tanteo ante la transmisión privada del suelo entre dos fondos de inversión. El precio pagado ha sido de 12,3 millones de euros, un 8% por debajo del precio de la transmisión original.

Las 400 viviendas se construirán en régimen de alquiler con precios entre 600 y 900 euros mensuales para pisos de entre 50 y 80 metros cuadrados, con acceso restringido a unidades familiares con ingresos entre 24.000 y 45.000 euros anuales. La EMVS prevé iniciar las obras en el primer trimestre de 2027 y tenerlas terminadas en 2029.`,
    status: 'published' as const,
    source: 'EMVS Madrid',
    sourceUrl: null,
    districtId: 'puente-vallecas',
    authorId: AUTHOR_ID,
    publishedAt: pub(22, 8),
  },
  {
    id: 'nws-009',
    title: 'Lavapiés acoge el primer festival de cine de barrio de Madrid con entrada gratuita',
    slug: 'lavapies-festival-cine-barrio-gratuito',
    summary: 'La plaza de Lavapiés acogerá durante cuatro noches de julio un festival de cine al aire libre con películas de directores del barrio y proyecciones de clásicos del cine social internacional. La entrada es gratuita con aforo limitado a 600 personas por sesión.',
    content: `La asociación cultural La Tabacalera y el colectivo Cine de Barrio han organizado la primera edición del Festival Internacional de Cine de Lavapiés, que se celebrará del 10 al 13 de julio en la plaza de Lavapiés con proyección en pantalla gigante a partir de las 22:00. El festival mezcla cortos y largometrajes de directores residentes en el barrio con una selección de películas internacionales sobre diversidad urbana y migración.

La programación incluye el estreno del documental "Calle Mesón de Paredes", rodado íntegramente en Lavapiés por el colectivo de cine Seis Pies, y una retrospectiva de Ken Loach con cuatro de sus películas sobre vida obrera. El festival cuenta con el apoyo del Área de Cultura del Ayuntamiento y la colaboración de la Filmoteca Española.`,
    status: 'published' as const,
    source: null,
    sourceUrl: null,
    districtId: 'centro',
    authorId: AUTHOR_ID,
    publishedAt: pub(5, 10),
  },
  {
    id: 'nws-010',
    title: 'La Comunidad licita el nuevo hospital de Valdebebas con 600 camas',
    slug: 'hospital-valdebebas-licitacion-600-camas',
    summary: 'La Consejería de Sanidad ha publicado el pliego de licitación para el nuevo Hospital de Valdebebas, con 600 camas y presupuesto de 420 millones de euros. El centro, que atenderá a los nuevos desarrollos del norte de Madrid, deberá estar operativo en 2030.',
    content: `La Consejería de Sanidad de la Comunidad de Madrid ha publicado en el BOCM el pliego de licitación del nuevo Hospital Universitario de Valdebebas, un centro de tercer nivel con 600 camas, 16 quirófanos, área de urgencias con 80 boxes y unidad de cuidados intensivos de 48 plazas. El presupuesto base de licitación es de 419,7 millones de euros con un plazo de ejecución de 42 meses.

El hospital dará servicio a los nuevos desarrollos urbanísticos del norte de Madrid —Valdebebas, Madrid Nuevo Norte y Los Berrocales— que se prevé albergarán más de 150.000 nuevos residentes en la próxima década. La licitación ha generado interés de las principales constructoras con experiencia hospitalaria: Acciona, FCC, Ferrovial y Sacyr han confirmado su intención de presentar oferta.`,
    status: 'published' as const,
    source: 'Consejería de Sanidad CM',
    sourceUrl: null,
    districtId: 'hortaleza',
    authorId: AUTHOR_ID,
    publishedAt: pub(29, 3),
  },
  {
    id: 'nws-011',
    title: 'Gran Vía cumple 110 años: el Ayuntamiento anuncia un plan de embellecimiento de fachadas',
    slug: 'gran-via-110-anos-plan-fachadas',
    summary: 'La Gran Vía de Madrid cumple 110 años desde la apertura de su primer tramo en 1915. El Ayuntamiento ha anunciado un plan de limpieza y rehabilitación de fachadas para los edificios más deteriorados del eje, con una inversión inicial de 8 millones de euros.',
    content: `El 4 de abril de 1910 comenzaron las obras de demolición de las primeras manzanas necesarias para abrir la Gran Vía, aunque el primer tramo —desde Alcalá hasta Red de San Luis— no se inauguró hasta 1915. En sus 110 años, la arteria se ha convertido en la calle más representativa de Madrid, con una mezcla única de arquitectura ecléctica, modernista y art déco que la distingue de cualquier otra vía urbana de España.

El plan de embellecimiento contempla la limpieza de fachadas de 18 edificios con mayor deterioro visible, la restauración de molduras y elementos ornamentales en cuatro inmuebles catalogados y la renovación del pavimento de las aceras en el tramo central. El Ayuntamiento negociará con los propietarios privados las condiciones de acceso y cofinanciación de las obras, que deberán estar terminadas antes del verano de 2026.`,
    status: 'published' as const,
    source: null,
    sourceUrl: null,
    districtId: 'centro',
    authorId: AUTHOR_ID,
    publishedAt: pub(44, 9),
  },
  {
    id: 'nws-012',
    title: 'Incendio en nave industrial de Villaverde: sin heridos y daños materiales importantes',
    slug: 'incendio-nave-industrial-villaverde',
    summary: 'Un incendio declarado la madrugada del lunes en una nave de almacenamiento de materiales plásticos en el polígono industrial de Villaverde Alto ha movilizado a 12 dotaciones de bomberos. No ha habido víctimas pero los daños materiales superan el millón de euros.',
    content: `El incendio se declaró a las 3:47 de la madrugada en una nave de 2.400 metros cuadrados dedicada al almacenamiento de pellets de plástico reciclado en la calle Herreros, en el polígono industrial de Villaverde Alto. Los Bomberos de Madrid movilizaron 12 dotaciones que tardaron cuatro horas en controlar el fuego, que amenazó con extenderse a las naves colindantes.

No hubo que lamentar víctimas ya que la nave estaba vacía en el momento del incendio. Los técnicos municipales han ordenado el cierre preventivo de las dos naves adyacentes hasta que se evalúe la estabilidad estructural de la medianería. La Policía Municipal investiga el origen del siniestro, no descartando un posible fallo eléctrico en la instalación de maquinaria de clasificación.`,
    status: 'published' as const,
    source: 'Bomberos de Madrid',
    sourceUrl: null,
    districtId: 'villaverde',
    authorId: AUTHOR_ID,
    publishedAt: pub(11, 6),
  },
  {
    id: 'nws-013',
    title: 'El precio del alquiler en Madrid baja por primera vez en cuatro años en febrero',
    slug: 'precio-alquiler-madrid-baja-febrero',
    summary: 'El precio medio del alquiler en Madrid capital cayó un 1,2% en febrero respecto al mes anterior, según los datos del portal Idealista. Es la primera caída mensual desde marzo de 2021 y los analistas debaten si supone un punto de inflexión o una corrección estacional.',
    content: `Los datos de febrero de 2026 del portal inmobiliario Idealista muestran una caída del 1,2% en el precio medio del alquiler en Madrid capital respecto a enero, situándolo en 18,3 euros por metro cuadrado. Es el primer descenso mensual en casi cuatro años y ha generado un intenso debate sobre si refleja un cambio de tendencia o simplemente la estacionalidad habitual del mercado en invierno.

Los analistas del sector apuntan a varios factores que podrían estar moderando la subida: el aumento de la oferta de vivienda en los nuevos desarrollos periféricos, la estabilización de la demanda de alquiler turístico tras las restricciones municipales y el efecto contractivo de los tipos de interés altos sobre la demanda de inversión residencial. Sin embargo, la mayoría advierte que un solo dato mensual no es suficiente para hablar de cambio de tendencia y que habrá que esperar a los datos del segundo trimestre para confirmar si la corrección es estructural.`,
    status: 'published' as const,
    source: 'Idealista',
    sourceUrl: null,
    districtId: null,
    authorId: AUTHOR_ID,
    publishedAt: pub(87, 4),
  },
  {
    id: 'nws-014',
    title: 'Abre en Hortaleza el mayor centro de datos de Madrid con 40 MW de capacidad',
    slug: 'centro-datos-hortaleza-40mw',
    summary: 'La empresa Digital Realty ha inaugurado en el polígono de Hortaleza el mayor centro de datos de Madrid, con 40 MW de potencia instalada y capacidad para 8.000 servidores. La instalación, que ha creado 120 empleos directos, se alimenta al 100% de energía renovable.',
    content: `Digital Realty ha completado la primera fase de su nuevo campus de centros de datos en Hortaleza con la inauguración de un edificio de 12.000 metros cuadrados con 40 megavatios de potencia instalada. La inversión total de esta primera fase asciende a 180 millones de euros y convierte a Madrid en uno de los principales hubs de infraestructura digital del sur de Europa, junto con Lisboa y Milán.

El centro opera al 100% con energía renovable gracias a un contrato de compra directa de electricidad eólica con un parque situado en Castilla-La Mancha. La compañía ha anunciado una segunda fase de 30 MW adicionales cuya construcción comenzará en 2027, lo que llevaría la inversión total en el campus a más de 300 millones de euros y el empleo directo a más de 200 puestos.`,
    status: 'published' as const,
    source: 'Digital Realty',
    sourceUrl: null,
    districtId: 'hortaleza',
    authorId: AUTHOR_ID,
    publishedAt: pub(53, 2),
  },
  {
    id: 'nws-015',
    title: 'La Casa de Campo estrena servicio de transporte fluvial por el lago',
    slug: 'casa-campo-transporte-fluvial-lago',
    summary: 'El Ayuntamiento ha puesto en marcha un servicio de barcas eléctricas con capacidad para 12 pasajeros que conectan el embarcadero principal con tres puntos del perímetro del lago de la Casa de Campo. El precio del trayecto es de 3 euros y funciona todos los fines de semana.',
    content: `El lago de la Casa de Campo estrena este mayo un servicio de transporte fluvial operado por cuatro barcas eléctricas de fabricación española con capacidad para doce pasajeros. El servicio conecta el embarcadero histórico —junto a las instalaciones de alquiler de barcas— con tres puntos del perímetro del lago: el área de merenderos norte, el acceso al Zoo Aquarium y el embarcadero sur junto al Parque de Atracciones.

El precio del trayecto sencillo es de 3 euros, con descuentos del 50% para menores de 12 años y mayores de 65 con tarjeta Madrid Salud. El servicio opera los sábados, domingos y festivos entre las 10:00 y las 20:00 de abril a octubre. El Ayuntamiento prevé que el servicio reciba 60.000 usuarios en su primera temporada completa.`,
    status: 'published' as const,
    source: 'Ayuntamiento de Madrid',
    sourceUrl: null,
    districtId: 'moncloa',
    authorId: AUTHOR_ID,
    publishedAt: pub(1, 11),
  },
  {
    id: 'nws-016',
    title: 'El Mercado de Maravillas completa su rehabilitación con una nueva planta de hostelería',
    slug: 'mercado-maravillas-rehabilitacion-hosteleria',
    summary: 'El Mercado Municipal de Maravillas, en Tetuán, ha completado su rehabilitación con la apertura de una nueva planta superior dedicada a restauración y actividades culturales. La inversión total ha sido de 5,8 millones de euros cofinanciados por el Ayuntamiento y los puesteros.',
    content: `El Mercado de Maravillas, con más de cien años de historia en el barrio de Cuatro Caminos, ha culminado su renovación integral con la apertura de la planta superior acondicionada como espacio de restauración y ocio. Los doce nuevos locales de hostelería incluyen cocinas de varios países, una cervecería artesanal y un espacio polivalente para exposiciones y actuaciones musicales en directo los fines de semana.

La rehabilitación ha respetado la estructura de hierro fundido del mercado original, catalogado como Bien de Interés Arquitectónico, añadiendo una nueva cubierta acristalada que inunda de luz natural la planta baja donde operan los 87 puestos de alimentación tradicionales. Los puesteros han financiado el 30% de la inversión mediante una derrama aprobada en asamblea, con la condición de que las tarifas de alquiler de los nuevos locales de hostelería se fijen a precios de mercado y no subvencionen los puestos de alimentación.`,
    status: 'published' as const,
    source: null,
    sourceUrl: null,
    districtId: 'tetuan',
    authorId: AUTHOR_ID,
    publishedAt: pub(63, 5),
  },
  {
    id: 'nws-017',
    title: 'Barajas supera los 65 millones de pasajeros en 2025, récord histórico',
    slug: 'barajas-65-millones-pasajeros-2025',
    summary: 'El aeropuerto Adolfo Suárez Madrid-Barajas cerró 2025 con 65,3 millones de pasajeros, superando por primera vez su propio récord de 2019. El crecimiento del turismo internacional y la recuperación de rutas de largo radio explican el nuevo máximo histórico.',
    content: `AENA ha publicado los datos definitivos de tráfico del aeropuerto de Madrid-Barajas para 2025, con un total de 65,3 millones de pasajeros que supera el anterior récord histórico de 61,7 millones alcanzado en 2019. El crecimiento ha sido especialmente intenso en las rutas de largo radio hacia América Latina y Asia, que han recuperado los niveles prepandemia y los han superado en un 12%.

Las cuatro terminales del aeropuerto operaron al límite de su capacidad durante los meses de julio y agosto, con retrasos sistemáticos en la T4 que generaron quejas de pasajeros y aerolíneas. AENA ha anunciado la ampliación de la capacidad de la T4S mediante la construcción de un nuevo edificio satélite que añadirá 15 millones de pasajeros adicionales de capacidad anual, con una inversión de 1.200 millones de euros y un plazo de ejecución de seis años.`,
    status: 'published' as const,
    source: 'AENA',
    sourceUrl: null,
    districtId: 'barajas',
    authorId: AUTHOR_ID,
    publishedAt: pub(120, 8),
  },
];

const NEWS_TAGS: { newsId: string; tagId: string }[] = [
  { newsId: 'nws-001', tagId: 'ciclismo' },
  { newsId: 'nws-001', tagId: 'movilidad' },
  { newsId: 'nws-001', tagId: 'sostenibilidad' },
  { newsId: 'nws-002', tagId: 'metro' },
  { newsId: 'nws-002', tagId: 'transporte' },
  { newsId: 'nws-003', tagId: 'medioambiente' },
  { newsId: 'nws-003', tagId: 'salud' },
  { newsId: 'nws-004', tagId: 'movilidad' },
  { newsId: 'nws-004', tagId: 'sostenibilidad' },
  { newsId: 'nws-004', tagId: 'transporte' },
  { newsId: 'nws-005', tagId: 'economia' },
  { newsId: 'nws-005', tagId: 'turismo' },
  { newsId: 'nws-006', tagId: 'cultura' },
  { newsId: 'nws-006', tagId: 'turismo' },
  { newsId: 'nws-007', tagId: 'transporte' },
  { newsId: 'nws-008', tagId: 'vivienda' },
  { newsId: 'nws-008', tagId: 'urbanismo' },
  { newsId: 'nws-009', tagId: 'cultura' },
  { newsId: 'nws-010', tagId: 'salud' },
  { newsId: 'nws-010', tagId: 'urbanismo' },
  { newsId: 'nws-011', tagId: 'patrimonio' },
  { newsId: 'nws-011', tagId: 'turismo' },
  { newsId: 'nws-012', tagId: 'seguridad' },
  { newsId: 'nws-013', tagId: 'vivienda' },
  { newsId: 'nws-013', tagId: 'economia' },
  { newsId: 'nws-014', tagId: 'innovacion' },
  { newsId: 'nws-014', tagId: 'sostenibilidad' },
  { newsId: 'nws-015', tagId: 'medioambiente' },
  { newsId: 'nws-015', tagId: 'movilidad' },
  { newsId: 'nws-016', tagId: 'cultura' },
  { newsId: 'nws-016', tagId: 'economia' },
  { newsId: 'nws-017', tagId: 'transporte' },
  { newsId: 'nws-017', tagId: 'economia' },
];

async function seed() {
  console.log('Seeding database...');

  await db.insert(user).values(SEED_USER).onConflictDoNothing();
  console.log(`  ✓ 1 seed user`);

  await db.insert(districts).values(DISTRICTS).onConflictDoNothing();
  console.log(`  ✓ ${DISTRICTS.length} districts`);

  await db.insert(tags).values(TAGS).onConflictDoNothing();
  console.log(`  ✓ ${TAGS.length} tags`);

  await db.insert(reports).values(REPORTS).onConflictDoNothing();
  console.log(`  ✓ ${REPORTS.length} reports`);

  await db.insert(reportTags).values(REPORT_TAGS).onConflictDoNothing();
  console.log(`  ✓ ${REPORT_TAGS.length} report-tag links`);

  await db.insert(news).values(NEWS_ITEMS).onConflictDoNothing();
  console.log(`  ✓ ${NEWS_ITEMS.length} news items`);

  await db.insert(newsTags).values(NEWS_TAGS).onConflictDoNothing();
  console.log(`  ✓ ${NEWS_TAGS.length} news-tag links`);

  console.log('Done. Run `just studio` to inspect the data.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
