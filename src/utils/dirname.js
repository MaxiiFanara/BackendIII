import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __utilsDir = dirname(__filename);
const __dirname = join(__utilsDir, '..');

export default __dirname;