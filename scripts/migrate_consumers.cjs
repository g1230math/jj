// migrate_consumers.cjs — Updates consumer components for async mockData
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function readFile(rel) {
    return fs.readFileSync(path.join(srcDir, rel), 'utf8');
}
function writeFile(rel, content) {
    fs.writeFileSync(path.join(srcDir, rel), content, 'utf8');
}

let totalChanges = 0;

function migrate(rel) {
    let code = readFile(rel);
    const orig = code;
    let changes = [];

    // Pattern 1: useState(getXxx()) → useState<Type>([]); useEffect loading
    // e.g. const [items, setItems] = useState(getNotices());
    // → const [items, setItems] = useState<NoticeItem[]>([]);
    //   useEffect(() => { getNotices().then(setItems); }, []);
    const useStateGetPattern = /const \[(\w+), (set\w+)\] = useState(?:<([^>]+)>)?\((\w+)\(\)\)/g;
    let match;
    const additions = [];
    while ((match = useStateGetPattern.exec(code)) !== null) {
        const [full, varName, setter, typeAnnotation, getter] = match;
        const defaultVal = getDefaultForGetter(getter);
        const typeStr = typeAnnotation ? `<${typeAnnotation}>` : '';
        const replacement = `const [${varName}, ${setter}] = useState${typeStr}(${defaultVal})`;
        code = code.replace(full, replacement);
        additions.push(`  useEffect(() => { ${getter}().then(${setter}); }, []);`);
        changes.push(`useState(${getter}()) → async load`);
    }

    // Insert useEffect calls after existing useEffect or after return statement start
    if (additions.length > 0) {
        // Ensure useEffect is imported
        if (!code.includes('useEffect')) {
            code = code.replace(
                /import React, \{ ([^}]+) \} from 'react'/,
                (m, imports) => `import React, { ${imports}, useEffect } from 'react'`
            );
            if (!code.includes('useEffect')) {
                code = code.replace(
                    /import \{ ([^}]+) \} from 'react'/,
                    (m, imports) => `import { ${imports}, useEffect } from 'react'`
                );
            }
        }
        // Add useEffect right after the useState block
        // Find the component function body and add useEffect after state declarations
        const effectBlock = '\n' + additions.join('\n') + '\n';
        // Insert before the first return statement in the component
        const returnIdx = code.indexOf('\n  return (');
        if (returnIdx > 0) {
            code = code.slice(0, returnIdx) + effectBlock + code.slice(returnIdx);
        }
    }

    // Pattern 2: Direct function calls like saveNotices(items) → await saveNotices(items)
    // Only add await if not already present and inside an async context
    // We'll handle this by making event handlers async
    const saveCalls = [
        'saveLectures', 'saveProgress', 'saveAssignments',
        'saveNotices', 'saveBlogPosts', 'saveGallery', 'saveResources',
        'saveFaqs', 'saveInquiries', 'saveHistoryItems', 'saveDepartmentInfo',
        'saveCalendarEvents', 'savePopups', 'savePopupSettings',
        'saveInstructorProfiles', 'saveFacilityPhotos', 'saveCourseClasses',
        'saveSuccessStories', 'saveSuccessStats', 'saveHomeStats',
        'saveHomeTestimonials', 'saveProgramFeatures', 'saveConsultRequests',
        'addConsultRequest'
    ];

    for (const fn of saveCalls) {
        // Add await before save calls that don't already have await
        const savePattern = new RegExp(`(?<!await )\\b${fn}\\(`, 'g');
        if (savePattern.test(code)) {
            code = code.replace(savePattern, `await ${fn}(`);
            changes.push(`await ${fn}()`);
        }
    }

    // Pattern 3: Make handler functions async if they now contain await
    // e.g. const handleSave = () => { await save... } → const handleSave = async () => { await save... }
    // Find arrow functions containing await that aren't async
    code = code.replace(/(\b(?:const|let)\s+\w+\s*=\s*)\(\s*([^)]*)\)\s*=>\s*\{([^}]*await[^}]*)\}/g,
        (m, prefix, params, body) => {
            if (m.includes('async')) return m;
            changes.push('made handler async');
            return `${prefix}async (${params}) => {${body}}`;
        }
    );

    // Also handle inline onClick handlers: onClick={() => { await... }}
    code = code.replace(/onClick=\{(\s*)\(\s*([^)]*)\)\s*=>\s*\{([^}]*await)/g,
        (m, space, params, body) => {
            if (m.includes('async')) return m;
            return `onClick={${space}async (${params}) => {${body}`;
        }
    );

    // Pattern 4: Functions declared with function keyword containing await
    code = code.replace(/(\bfunction\s+)(\w+)\s*\(([^)]*)\)\s*\{([^]*?)(?=\nfunction|\nexport|\n\})/g,
        (m, kw, name, params, body) => {
            if (body.includes('await') && !m.includes('async')) {
                changes.push(`async function ${name}`);
                return `async ${kw}${name}(${params}) {${body}`;
            }
            return m;
        }
    );

    if (code !== orig) {
        writeFile(rel, code);
        totalChanges += changes.length;
        console.log(`✅ ${rel}: ${changes.length} changes — ${changes.join(', ')}`);
    } else {
        console.log(`⏭️ ${rel}: no changes needed`);
    }
}

function getDefaultForGetter(getter) {
    const defaults = {
        getLectures: '[]',
        getAllProgress: '{}',
        getAssignments: '[]',
        getNotices: '[]',
        getBlogPosts: '[]',
        getGallery: '[]',
        getResources: '[]',
        getFaqs: '[]',
        getInquiries: '[]',
        getHistoryItems: '[]',
        getDepartmentInfo: '[]',
        getCalendarEvents: '[]',
        getPopups: '[]',
        getPopupSettings: '{ enabled: true, showOnce: false, delaySeconds: 1 }',
        getInstructorProfiles: '[]',
        getFacilityPhotos: '[]',
        getCourseClasses: '[]',
        getSuccessStories: '[]',
        getSuccessStats: '[]',
        getHomeStats: '[]',
        getHomeTestimonials: '[]',
        getProgramFeatures: '[]',
        getConsultRequests: '[]',
    };
    return defaults[getter] || '[]';
}

// List of consumer files to migrate
const files = [
    'pages/Dashboard.tsx',
    'pages/Home.tsx',
    'pages/About.tsx',
    'pages/Courses.tsx',
    'pages/SuccessStories.tsx',
    'pages/Community.tsx',
    'pages/Calendar.tsx',
    'pages/Lectures.tsx',
    'components/PopupBanner.tsx',
    'components/PopupAdmin.tsx',
    'components/LectureAdmin.tsx',
    'components/ConsultModal.tsx',
    'components/ConsultAdmin.tsx',
];

for (const f of files) {
    try {
        migrate(f);
    } catch (e) {
        console.log(`❌ ${f}: ${e.message}`);
    }
}

// Special: Shuttle.tsx — convert its own localStorage functions to Supabase
let shuttle = readFile('pages/Shuttle.tsx');
const shuttleOrig = shuttle;

// Add Supabase import and convert getShuttleRoutes/saveShuttleRoutes
shuttle = shuttle.replace(
    "import { cn } from '../lib/utils';",
    "import { cn } from '../lib/utils';\nimport { supabase } from '../lib/supabase';"
);

// Replace getShuttleRoutes
shuttle = shuttle.replace(
    /export function getShuttleRoutes\(\): ShuttleRoute\[\] \{[\s\S]*?\n\}/,
    `export async function getShuttleRoutes(): Promise<ShuttleRoute[]> {
    if (!supabase) return defaultRoutes;
    try {
        const { data, error } = await supabase.from('site_data').select('value').eq('key', 'shuttle_routes').single();
        if (error || !data) return defaultRoutes;
        return data.value as ShuttleRoute[];
    } catch { return defaultRoutes; }
}`
);

// Replace saveShuttleRoutes
shuttle = shuttle.replace(
    /export function saveShuttleRoutes\(routes: ShuttleRoute\[\]\) \{[\s\S]*?\n\}/,
    `export async function saveShuttleRoutes(routes: ShuttleRoute[]) {
    if (!supabase) return;
    try {
        await supabase.from('site_data').upsert({ key: 'shuttle_routes', value: routes as any, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    } catch { /* silent */ }
}`
);

// Remove STORAGE_KEY
shuttle = shuttle.replace(/const STORAGE_KEY = '[^']+';?\r?\n/, '');

// Fix useState initialization: useState<ShuttleRoute[]>(getShuttleRoutes())
shuttle = shuttle.replace(
    'useState<ShuttleRoute[]>(getShuttleRoutes())',
    'useState<ShuttleRoute[]>(defaultRoutes)'
);

// Add useEffect for loading
shuttle = shuttle.replace(
    "const [direction, setDirection] = useState<'depart' | 'return'>('depart');",
    "const [direction, setDirection] = useState<'depart' | 'return'>('depart');\n\n    useEffect(() => { getShuttleRoutes().then(setRoutes); }, []);"
);

// Remove old storage event listener useEffect
shuttle = shuttle.replace(
    /\n\s*useEffect\(\(\) => \{\s*\n\s*const handleStorage[^}]+\}[^}]+\}[^}]+\}, \[\]\);/,
    ''
);

if (shuttle !== shuttleOrig) {
    writeFile('pages/Shuttle.tsx', shuttle);
    console.log('✅ pages/Shuttle.tsx: converted to Supabase');
} else {
    console.log('⏭️ pages/Shuttle.tsx: no changes');
}

console.log(`\nTotal changes: ${totalChanges}`);
console.log('Done!');
