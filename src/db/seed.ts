/**
 * Development seed — populates the DB with realistic Madrid data.
 * Run with: just seed  (or: pnpm db:seed)
 */
import 'dotenv/config';
import { db } from './index';
import { districts, tags, reports, news } from './schema';

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
];

async function seed() {
  console.log('Seeding database...');

  await db.insert(districts).values(DISTRICTS).onConflictDoNothing();
  console.log(`  ✓ ${DISTRICTS.length} districts`);

  await db.insert(tags).values(TAGS).onConflictDoNothing();
  console.log(`  ✓ ${TAGS.length} tags`);

  console.log('Done. Run `just studio` to inspect the data.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
