/*
  Reads data/municipios_20250809.csv (source format):
  "Código Departamento,Nombre Departamento,Código Municipio,Nombre Municipio,Tipo: Municipio / Isla / Área no municipalizada,longitud,Latitud"

  Produces two CSVs aligned with DB tables:
  - data/col_departments.csv → dept_code,name,dane_code
  - data/col_municipalities.csv → muni_code,dept_code,name,type,longitude,latitude,dane_code

  Notes:
  - Keeps codes as text to preserve leading zeros
  - Normalizes decimal commas to dots for longitude/latitude
*/

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const inputCsvPath = path.join(dataDir, 'municipios_20250809.csv');
const departmentsOutPath = path.join(dataDir, 'col_departments.csv');
const municipalitiesOutPath = path.join(dataDir, 'col_municipalities.csv');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"') {
        if (next === '"') {
          field += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (char === '\r') {
        // ignore
      } else {
        field += char;
      }
    }
  }
  // flush trailing field/row
  if (field.length > 0 || inQuotes || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function toDotDecimal(value) {
  if (value == null || value === '') return '';
  // Replace comma with dot only if it looks like a decimal number
  // Many inputs already come without quotes after parsing
  const normalized = value.replace(/,/g, '.');
  // Validate as number
  const num = Number(normalized);
  if (Number.isNaN(num)) return '';
  return String(num);
}

function escapeCsvField(value) {
  if (value == null) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function writeCsv(filePath, header, rows) {
  const lines = [];
  if (header && header.length) {
    lines.push(header.map(escapeCsvField).join(','));
  }
  for (const r of rows) {
    lines.push(r.map(escapeCsvField).join(','));
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

function main() {
  if (!fs.existsSync(inputCsvPath)) {
    console.error(`Input CSV not found at ${inputCsvPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(inputCsvPath, 'utf8');
  const rows = parseCsv(content);
  if (!rows.length) {
    console.error('Input CSV is empty');
    process.exit(1);
  }

  // Detect and skip header
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const looksLikeHeader = header[0]?.includes('código departamento');
  const dataRows = looksLikeHeader ? rows.slice(1) : rows;

  const deptMap = new Map(); // dept_code -> { dept_code, name, dane_code }
  const municipalities = [];

  for (const r of dataRows) {
    if (!r || r.length < 7) continue;
    const dept_code = (r[0] || '').trim();
    const dept_name = (r[1] || '').trim();
    const muni_code = (r[2] || '').trim();
    const muni_name = (r[3] || '').trim();
    const muni_type = (r[4] || '').trim();
    const longitude = toDotDecimal((r[5] || '').trim());
    const latitude = toDotDecimal((r[6] || '').trim());

    if (!dept_code || !dept_name) continue;

    if (!deptMap.has(dept_code)) {
      deptMap.set(dept_code, {
        dept_code,
        name: dept_name,
        dane_code: dept_code,
      });
    }

    if (muni_code && muni_name) {
      municipalities.push({
        muni_code,
        dept_code,
        name: muni_name,
        type: muni_type || '',
        longitude: longitude || '',
        latitude: latitude || '',
        dane_code: muni_code,
      });
    }
  }

  // Sort for stable output
  const departments = Array.from(deptMap.values()).sort((a, b) => a.dept_code.localeCompare(b.dept_code));
  municipalities.sort((a, b) =>
    a.dept_code === b.dept_code ? a.muni_code.localeCompare(b.muni_code) : a.dept_code.localeCompare(b.dept_code)
  );

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  writeCsv(
    departmentsOutPath,
    ['dept_code', 'name', 'dane_code'],
    departments.map((d) => [d.dept_code, d.name, d.dane_code])
  );

  writeCsv(
    municipalitiesOutPath,
    ['muni_code', 'dept_code', 'name', 'type', 'longitude', 'latitude', 'dane_code'],
    municipalities.map((m) => [m.muni_code, m.dept_code, m.name, m.type, m.longitude, m.latitude, m.dane_code])
  );

  console.log(`Wrote ${departments.length} departments → ${departmentsOutPath}`);
  console.log(`Wrote ${municipalities.length} municipalities → ${municipalitiesOutPath}`);
}

main();


