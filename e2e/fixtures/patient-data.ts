export interface QuickCreatePatientData {
  fullName: string;
  birthDate: string;
  phone: string;
}

// Combinatorial pool (12 × 12 × 12 = 1728 combos) so generated names stay dissimilar enough to
// avoid the app's own fuzzy possible-duplicate check (pg_trgm similarity > 0.35 on full_name) —
// a shared literal prefix like "E2E Test Patient <timestamp>" would trigger it on every run
// against the same tenant, since only the numeric suffix would differ.
const FIRST_NAMES = [
  'Ana', 'Luis', 'María', 'Carlos', 'Sofía', 'Jorge', 'Elena', 'Pablo', 'Daniela', 'Ricardo', 'Fernanda', 'Miguel',
];
const LAST_NAMES = [
  'García', 'Hernández', 'López', 'Martínez', 'Rodríguez', 'Sánchez', 'Torres', 'Ramírez', 'Flores', 'Gómez', 'Díaz', 'Reyes',
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Every call returns a fresh, unique payload so the suite can be run repeatedly against the
 * same database (no reset between runs) without colliding with previously created patients or
 * tripping the possible-duplicate warning from spec 004.
 */
export function uniquePatientData(): QuickCreatePatientData {
  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const phoneDigits = uniqueSuffix.slice(-10).padStart(10, '5');
  const fullName = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)} ${pick(LAST_NAMES)}`;

  return {
    fullName,
    birthDate: '1990-05-15',
    phone: phoneDigits,
  };
}
