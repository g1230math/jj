// migrate_mockdata.js — Run with: node scripts/migrate_mockdata.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'data', 'mockData.ts');
let code = fs.readFileSync(file, 'utf8');

// 1. Add Supabase import + helpers after the defaultLectures array closing
const supabaseHelper = `
// ═══════ Supabase key-value helpers ═══════
import { supabase } from '../lib/supabase';

async function getData<T>(key: string, defaults: T): Promise<T> {
  if (!supabase) return defaults;
  try {
    const { data, error } = await supabase.from('site_data').select('value').eq('key', key).single();
    if (error || !data) return defaults;
    return data.value as T;
  } catch { return defaults; }
}

async function saveData<T>(key: string, value: T): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('site_data').upsert({ key, value: value as any, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  } catch { /* silent */ }
}
`;

// Insert helper after "// --- localStorage 기반 강의 관리 ---"
code = code.replace(
    '// --- localStorage 기반 강의 관리 ---\nconst LECTURES_KEY = \'g1230_lectures\';',
    supabaseHelper + '\n// --- 강의 관리 ---'
);

// 2. Define all the replacements: pattern -> { key, returnType? }
const replacements = [
    // Lectures
    { fnGet: 'getLectures', fnSave: 'saveLectures', key: 'lectures', type: 'Lecture[]', defaults: 'defaultLectures' },
    // Progress (special - handled separately below)
    // Assignments
    { fnGet: 'getAssignments', fnSave: 'saveAssignments', key: 'instructor_assignments', type: 'InstructorAssignment[]', defaults: 'defaultAssignments' },
    // Notices
    { fnGet: 'getNotices', fnSave: 'saveNotices', key: 'notices', type: 'NoticeItem[]', defaults: 'defaultNotices' },
    // Blog
    { fnGet: 'getBlogPosts', fnSave: 'saveBlogPosts', key: 'blog', type: 'BlogPost[]', defaults: 'defaultBlogPosts' },
    // Gallery
    { fnGet: 'getGallery', fnSave: 'saveGallery', key: 'gallery', type: 'GalleryItem[]', defaults: 'defaultGallery' },
    // Resources
    { fnGet: 'getResources', fnSave: 'saveResources', key: 'resources', type: 'ResourceItem[]', defaults: 'defaultResources' },
    // FAQ
    { fnGet: 'getFaqs', fnSave: 'saveFaqs', key: 'faq', type: 'FaqItem[]', defaults: 'defaultFaqs' },
    // Inquiries
    { fnGet: 'getInquiries', fnSave: 'saveInquiries', key: 'inquiries', type: 'InquiryItem[]', defaults: 'defaultInquiries' },
    // History
    { fnGet: 'getHistoryItems', fnSave: 'saveHistoryItems', key: 'history_items', type: 'HistoryItem[]', defaults: 'defaultHistoryItems' },
    // Department Info
    { fnGet: 'getDepartmentInfo', fnSave: 'saveDepartmentInfo', key: 'department_info', type: 'DepartmentInfo[]', defaults: 'defaultDepartmentInfo' },
    // Calendar Events
    { fnGet: 'getCalendarEvents', fnSave: 'saveCalendarEvents', key: 'calendar_events', type: 'CalendarEvent[]', defaults: 'defaultCalendarEvents' },
    // Popups
    { fnGet: 'getPopups', fnSave: 'savePopups', key: 'popups', type: 'PopupItem[]', defaults: 'defaultPopups' },
    // Popup Settings
    { fnGet: 'getPopupSettings', fnSave: 'savePopupSettings', key: 'popup_settings', type: 'PopupSettings', defaults: 'defaultPopupSettings' },
    // Instructors
    { fnGet: 'getInstructorProfiles', fnSave: 'saveInstructorProfiles', key: 'instructors', type: 'InstructorProfile[]', defaults: 'defaultInstructors' },
    // Facilities
    { fnGet: 'getFacilityPhotos', fnSave: 'saveFacilityPhotos', key: 'facilities', type: 'FacilityPhoto[]', defaults: 'defaultFacilities' },
    // Course Classes
    { fnGet: 'getCourseClasses', fnSave: 'saveCourseClasses', key: 'courses', type: 'CourseClass[]', defaults: 'defaultCourseClasses' },
    // Success Stories
    { fnGet: 'getSuccessStories', fnSave: 'saveSuccessStories', key: 'success_stories', type: 'SuccessStoryItem[]', defaults: 'defaultSuccessStories' },
    // Success Stats
    { fnGet: 'getSuccessStats', fnSave: 'saveSuccessStats', key: 'success_stats', type: 'SuccessStoryStat[]', defaults: 'defaultSuccessStats' },
    // Home Stats
    { fnGet: 'getHomeStats', fnSave: 'saveHomeStats', key: 'home_stats', type: 'HomeStat[]', defaults: 'defaultHomeStats' },
    // Home Testimonials
    { fnGet: 'getHomeTestimonials', fnSave: 'saveHomeTestimonials', key: 'home_testimonials', type: 'HomeTestimonial[]', defaults: 'defaultTestimonials' },
    // Program Features
    { fnGet: 'getProgramFeatures', fnSave: 'saveProgramFeatures', key: 'program_features', type: 'HomeProgramFeature[]', defaults: 'defaultProgramFeatures' },
    // Consult Requests
    { fnGet: 'getConsultRequests', fnSave: 'saveConsultRequests', key: 'consult_requests', type: 'ConsultRequest[]', defaults: '[]' },
];

// Remove all KEY constants
code = code.replace(/const [A-Z_]+_KEY = 'g1230_[^']+';?\n/g, '');
code = code.replace(/const LECTURES_KEY = 'g1230_lectures';?\n/g, '');
code = code.replace(/const PROGRESS_KEY = 'g1230_lecture_progress';?\n/g, '');
code = code.replace(/const ASSIGNMENTS_KEY = 'g1230_instructor_assignments';?\n/g, '');
code = code.replace(/const POPUPS_KEY = 'g1230_popups';?\n/g, '');
code = code.replace(/const POPUP_SETTINGS_KEY = 'g1230_popup_settings';?\n/g, '');
code = code.replace(/const CONSULT_KEY = 'g1230_consultRequests';?\n/g, '');

// Replace each get function
for (const r of replacements) {
    // Match: export function getFoo(): Type { ... }
    const getPattern = new RegExp(
        `export function ${r.fnGet}\\(\\)[^{]*\\{[\\s\\S]*?\\n\\}`,
        'g'
    );
    const getReplacement = `export async function ${r.fnGet}(): Promise<${r.type}> {\n  return getData('${r.key}', ${r.defaults});\n}`;
    code = code.replace(getPattern, getReplacement);

    // Match: export function saveFoo(items: Type) { localStorage... }
    const savePattern = new RegExp(
        `export function ${r.fnSave}\\([^)]*\\)[^{]*\\{[^}]*\\}`,
        'g'
    );
    const paramType = r.type.includes('[]') ? `items: ${r.type}` : `settings: ${r.type}`;
    const paramName = r.type.includes('[]') ? 'items' : 'settings';
    const saveReplacement = `export async function ${r.fnSave}(${paramType}) { await saveData('${r.key}', ${paramName}); }`;
    code = code.replace(savePattern, saveReplacement);
}

// Handle special cases: getAllProgress, getProgress, saveProgress
const progressGetAll = /export function getAllProgress\(\)[^{]*\{[\s\S]*?\n\}/;
code = code.replace(progressGetAll, `export async function getAllProgress(): Promise<Record<string, LectureProgress>> {\n  return getData('lecture_progress', {} as Record<string, LectureProgress>);\n}`);

const progressGet = /export function getProgress\(lectureId: string\)[^{]*\{[\s\S]*?\n\}/;
code = code.replace(progressGet, `export async function getProgress(lectureId: string): Promise<LectureProgress> {\n  const all = await getAllProgress();\n  return all[lectureId] || {\n    lectureId,\n    status: 'not_started',\n    progress: 0,\n    lastWatched: '',\n    bookmarked: false,\n    notes: [],\n  };\n}`);

const progressSave = /export function saveProgress\(lectureId: string, update: Partial<LectureProgress>\)[^{]*\{[\s\S]*?localStorage\.setItem\([^)]+\);\n\}/;
code = code.replace(progressSave, `export async function saveProgress(lectureId: string, update: Partial<LectureProgress>) {\n  const all = await getAllProgress();\n  const current = all[lectureId] || {\n    lectureId,\n    status: 'not_started' as const,\n    progress: 0,\n    lastWatched: '',\n    bookmarked: false,\n    notes: [],\n  };\n  all[lectureId] = { ...current, ...update };\n  await saveData('lecture_progress', all);\n}`);

// Handle addConsultRequest (make it async)
code = code.replace(
    /export function addConsultRequest\(req: Omit<ConsultRequest, 'id' \| 'status' \| 'createdAt'>\): ConsultRequest \{[\s\S]*?\n\}/,
    `export async function addConsultRequest(req: Omit<ConsultRequest, 'id' | 'status' | 'createdAt'>): Promise<ConsultRequest> {\n  const list = await getConsultRequests();\n  const newReq: ConsultRequest = {\n    ...req,\n    id: \`consult_\${Date.now()}\`,\n    status: 'pending',\n    createdAt: new Date().toISOString(),\n  };\n  list.unshift(newReq);\n  await saveConsultRequests(list);\n  return newReq;\n}`
);

// Handle getHistoryItems / saveHistoryItems that use inline string keys
code = code.replace(
    /export function getHistoryItems\(\)[^{]*\{[\s\S]*?\n\}/,
    `export async function getHistoryItems(): Promise<HistoryItem[]> {\n  return getData('history_items', defaultHistoryItems);\n}`
);
code = code.replace(
    /export function saveHistoryItems\([^)]*\)[^{]*\{[\s\S]*?\n\}/,
    `export async function saveHistoryItems(items: HistoryItem[]) {\n  await saveData('history_items', items);\n}`
);

// Fix inline localStorage key functions (getDepartmentInfo, getCalendarEvents, etc.)
code = code.replace(
    /export function getDepartmentInfo\(\)[^{]*\{[\s\S]*?\n\}/,
    `export async function getDepartmentInfo(): Promise<DepartmentInfo[]> {\n  return getData('department_info', defaultDepartmentInfo);\n}`
);
code = code.replace(
    /export function saveDepartmentInfo\([^)]*\)[^{]*\{[\s\S]*?\n\}/,
    `export async function saveDepartmentInfo(items: DepartmentInfo[]) {\n  await saveData('department_info', items);\n}`
);

code = code.replace(
    /export function getCalendarEvents\(\)[^{]*\{[\s\S]*?\n\}/,
    `export async function getCalendarEvents(): Promise<CalendarEvent[]> {\n  return getData('calendar_events', defaultCalendarEvents);\n}`
);
code = code.replace(
    /export function saveCalendarEvents\([^)]*\)[^{]*\{[\s\S]*?\n\}/,
    `export async function saveCalendarEvents(items: CalendarEvent[]) {\n  await saveData('calendar_events', items);\n}`
);

// Home stats/testimonials/features that use inline keys
code = code.replace(
    /export function getHomeStats\(\)[^{]*\{[\s\S]*?\n\}/,
    `export async function getHomeStats(): Promise<HomeStat[]> {\n  return getData('home_stats', defaultHomeStats);\n}`
);
code = code.replace(
    /export function saveHomeStats\([^)]*\)[^{]*\{[^}]*\}/,
    `export async function saveHomeStats(items: HomeStat[]) { await saveData('home_stats', items); }`
);
code = code.replace(
    /export function getHomeTestimonials\(\)[^{]*\{[\s\S]*?\n\}/,
    `export async function getHomeTestimonials(): Promise<HomeTestimonial[]> {\n  return getData('home_testimonials', defaultTestimonials);\n}`
);
code = code.replace(
    /export function saveHomeTestimonials\([^)]*\)[^{]*\{[^}]*\}/,
    `export async function saveHomeTestimonials(items: HomeTestimonial[]) { await saveData('home_testimonials', items); }`
);
code = code.replace(
    /export function getProgramFeatures\(\)[^{]*\{[\s\S]*?\n\}/,
    `export async function getProgramFeatures(): Promise<HomeProgramFeature[]> {\n  return getData('program_features', defaultProgramFeatures);\n}`
);
code = code.replace(
    /export function saveProgramFeatures\([^)]*\)[^{]*\{[^}]*\}/,
    `export async function saveProgramFeatures(items: HomeProgramFeature[]) { await saveData('program_features', items); }`
);

// Remove any remaining localStorage references
const remaining = code.match(/localStorage/g);
if (remaining) {
    console.log('WARNING: Still found', remaining.length, 'localStorage references');
} else {
    console.log('SUCCESS: No localStorage references remain');
}

fs.writeFileSync(file, code, 'utf8');
console.log('Migration complete. File updated.');
