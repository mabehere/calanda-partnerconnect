import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
const bundled=process.platform==='win32'?'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1111-570-0_26.1111.570.0_x64__3k8sg7r9htsxt/dependencies/python/python.exe':'';
const python=process.env.CALEIRA_PYTHON||(bundled&&existsSync(bundled)?bundled:process.platform==='win32'?'python':'python3');
const result=spawnSync(python,['scripts/pdf_export.py'],{stdio:'inherit'});process.exit(result.status??1);
