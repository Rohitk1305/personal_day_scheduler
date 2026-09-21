import fs from 'fs';
import path from 'path';

// 8 Core College Subjects
const subjects = [
  { code: "BAGC304", name: "Principles of Genetics", faculty: "KD (Dr. Kamla Dhyani)", color: "#8B5CF6" },
  { code: "BAGC305", name: "Crop Production Technology-I (Kharif Crops)", faculty: "SG (Dr. Shagun Gupta)", color: "#10B981" },
  { code: "BAGC306", name: "Production Technology of Fruit and Plantation Crops", faculty: "SS (Dr. Suneeta Singh)", color: "#F59E0B" },
  { code: "BAGC307", name: "Fundamentals of Extension Education", faculty: "TV (Dr. Tanuja Verma)", color: "#EC4899" },
  { code: "BAGC308", name: "Fundamentals of Nematology", faculty: "KS", color: "#EF4444" },
  { code: "BAGC309", name: "Principles and Practices of Natural Farming", faculty: "JPS (Dr. J.P. Singh)", color: "#84CC16" },
  { code: "BAGA302", name: "Entrepreneurship Development and Business Communication", faculty: "SB (Dr. Sobha Bisht)", color: "#06B6D4" },
  { code: "BAGS301", name: "Beneficial Insect Farming", faculty: "HK (Dr. Hitender Kumar)", color: "#3B82F6" },
  { code: "BAGA303", name: "Physical Education (Not studied)", faculty: "-", color: "#9CA3AF" }
];

const categoryGuidance = {
  college_exam_prep: { label: "College Semester Exam Study", color: "#2563EB", icon: "📖" },
  exam_prep: { label: "Competitive Exam Prep (1 Hr)", color: "#6366F1", icon: "📘" },
  mcq_practice: { label: "College Question Bank Practice", color: "#4F46E5", icon: "📝" },
  first_revision: { label: "1st Revision (40 min)", color: "#059669", icon: "🔁" },
  second_revision: { label: "2nd Revision (40 min)", color: "#10B981", icon: "🔂" },
  pre_study: { label: "Pre-class Study (40 min)", color: "#D97706", icon: "🎯" },
  weekly_revision: { label: "Weekly Revision", color: "#8B5CF6", icon: "📚" },
  mock_test: { label: "Weekly Mock Test", color: "#DC2626", icon: "🧪" },
  college: { label: "College Lecture", color: "#2563EB", icon: "🏫" },
  practical: { label: "College Practical", color: "#0284C7", icon: "🔬" },
  drawing: { label: "Drawing / Hobby (Wed & Sun)", color: "#EC4899", icon: "🎨" },
  jaap: { label: "Jaap (5 min)", color: "#F59E0B", icon: "🧘", high_priority: true },
  routine: { label: "Routine / Personal Care", color: "#6B7280", icon: "🚿" },
  meals: { label: "Meals & Rest", color: "#F97316", icon: "🍽️" },
  sleep: { label: "Sleep", color: "#374151", icon: "😴" },
  backlog: { label: "Backlog / Deep Dive", color: "#7C3AED", icon: "🛠️" }
};

// Explicit Subject-by-Subject Rotation per Day of Week
// Ensures every college subject is deeply studied for semester exams in 3-day intervals!

const collegeExamStudyPlan = {
  Monday: {
    slot1: { code: "BAGC306", title: "College Exam Prep: Fruit & Plantation Crops (BAGC306)", topic: "Package of practices for Mango, Banana, Citrus, Guava & Orchard Layouts" },
    slot2: { code: "BAGC305", title: "College Exam Prep: Kharif Crops (CPT-I) (BAGC305)", topic: "Rice & Maize cultivation, nursery raising, weed management & yield estimation" }
  },
  Tuesday: {
    slot1: { code: "BAGC304", title: "College Exam Prep: Principles of Genetics (BAGC304)", topic: "Mendelian ratio deviations, Linkage, Crossing Over & Gene Mapping problems" },
    slot2: { code: "BAGC307", title: "College Exam Prep: Fundamentals of Extension Education (BAGC307)", topic: "Extension teaching methods, audio-visual aids, rural development programs" }
  },
  Wednesday: {
    slot1: { code: "BAGA302", title: "College Exam Prep: Entrepreneurship Dev & Business Comm (BAGA302)", topic: "Project report formulation, business communication skills & enterprise startup" },
    slot2: { code: "BAGS301", title: "College Exam Prep: Beneficial Insect Farming (BAGS301)", topic: "Apiculture: Honeybee species, hive management & honey extraction" }
  },
  Thursday: {
    slot1: { code: "BAGC309", title: "College Exam Prep: Principles of Natural Farming (BAGC309)", topic: "Jeevamrit, Beejamrit & Ghanjeevamrit preparation, pest management in NF" },
    slot2: { code: "BAGC305", title: "College Exam Prep: Kharif Crops (CPT-I) (BAGC305)", topic: "Pulse crops: Arhar, Moong, Urd & Soybean agronomic management" }
  },
  Friday: {
    slot1: { code: "BAGC308", title: "College Exam Prep: Fundamentals of Nematology (BAGC308)", topic: "Plant parasitic nematodes morphology, Meloidogyne root-knot & control" },
    slot2: { code: "BAGC304", title: "College Exam Prep: Principles of Genetics (BAGC304)", topic: "Structural & numerical chromosomal aberrations, polyploidy breeding" }
  },
  Saturday: {
    slot1: { code: "BAGS301", title: "College Exam Prep: Beneficial Insect Farming (BAGS301)", topic: "Sericulture: Mulberry cultivation, silkworm rearing & disease control" },
    slot2: { code: "BAGC306", title: "College Exam Prep: Fruit & Plantation Crops (BAGC306)", topic: "Plantation crops: Coconut, Cashew, Arecanut, Tea & Coffee management" }
  }
};

// Competitive Exam Topics (1 Hr Morning)
const compExamTopics = {
  Monday: { subject: "Agronomy Basics", topic: "Tillage, Soil Moisture Constants & Crop Classification" },
  Tuesday: { subject: "Genetics Basics", topic: "Cell Division (Mitosis & Meiosis) & Chromosome Theory" },
  Wednesday: { subject: "Soil Science", topic: "Soil Physical Properties & Soil Organic Matter" },
  Thursday: { subject: "Horticulture Basics", topic: "Plant Propagation Methods & Nursery Techniques" },
  Friday: { subject: "Entomology / Pathology", topic: "Insect Body Regions & Fungi Classification" },
  Saturday: { subject: "Economics / Extension", topic: "Law of Diminishing Returns & Extension Principles" }
};

// College Periods Timetable
const collegeClasses = {
  Monday: [
    { start: "10:00", end: "12:00", type: "practical", title: "Practical: Beneficial Insect Farming", code: "BAGS301" },
    { start: "12:00", end: "13:00", type: "college", title: "Lecture: Fruit & Plantation Crops", code: "BAGC306" },
    { start: "13:00", end: "14:00", type: "meals", title: "Lunch break", code: null },
    { start: "14:00", end: "15:00", type: "college", title: "Library period (Class Coordinator)", code: null },
    { start: "15:00", end: "17:00", type: "practical", title: "Practical: Kharif Crops (CPT-I)", code: "BAGC305" }
  ],
  Tuesday: [
    { start: "10:00", end: "11:00", type: "college", title: "Lecture: Extension Education", code: "BAGC307" },
    { start: "11:00", end: "13:00", type: "practical", title: "Practical: Genetics", code: "BAGC304" },
    { start: "13:00", end: "14:00", type: "meals", title: "Lunch break", code: null },
    { start: "14:00", end: "15:00", type: "college", title: "Lecture: Genetics", code: "BAGC304" },
    { start: "15:00", end: "17:00", type: "college", title: "Work Programme (Batch A)", code: null }
  ],
  Wednesday: [
    { start: "10:00", end: "12:00", type: "college", title: "Physical Education (BAGA303) - class only", code: "BAGA303" },
    { start: "12:00", end: "13:00", type: "college", title: "Lecture: Entrepreneurship & Business Comm.", code: "BAGA302" },
    { start: "13:00", end: "14:00", type: "meals", title: "Lunch break", code: null },
    { start: "14:00", end: "15:00", type: "college", title: "Mentor-Mentee period", code: null },
    { start: "15:00", end: "17:00", type: "practical", title: "Practical: Extension Education", code: "BAGC307" }
  ],
  Thursday: [
    { start: "10:00", end: "11:00", type: "college", title: "Lecture: Entrepreneurship & Business Comm.", code: "BAGA302" },
    { start: "11:00", end: "13:00", type: "practical", title: "Practical: Natural Farming", code: "BAGC309" },
    { start: "13:00", end: "14:00", type: "meals", title: "Lunch break", code: null },
    { start: "14:00", end: "15:00", type: "college", title: "Lecture: Kharif Crops (CPT-I)", code: "BAGC305" },
    { start: "15:00", end: "17:00", type: "practical", title: "Practical: Fruit & Plantation Crops", code: "BAGC306" }
  ],
  Friday: [
    { start: "10:00", end: "12:00", type: "practical", title: "Practical: Nematology", code: "BAGC308" },
    { start: "12:00", end: "13:00", type: "college", title: "Lecture: Nematology", code: "BAGC308" },
    { start: "13:00", end: "14:00", type: "meals", title: "Lunch break", code: null },
    { start: "14:00", end: "15:00", type: "college", title: "Lecture: Kharif Crops (CPT-I)", code: "BAGC305" },
    { start: "15:00", end: "17:00", type: "practical", title: "Practical: Entrepreneurship & Business Comm.", code: "BAGA302" }
  ],
  Saturday: [
    { start: "10:00", end: "11:00", type: "college", title: "Lecture: Natural Farming", code: "BAGC309" },
    { start: "11:00", end: "13:00", type: "college", title: "Physical Education (BAGA303) - class only", code: "BAGA303" },
    { start: "13:00", end: "14:00", type: "meals", title: "Lunch break", code: null },
    { start: "14:00", end: "15:00", type: "college", title: "Lecture: Genetics", code: "BAGC304" },
    { start: "15:00", end: "17:00", type: "practical", title: "Practical: Beneficial Insect Farming", code: "BAGS301" }
  ]
};

// Explicit 1st Revision Map (40 min)
const firstRevisionMap40m = {
  Monday: { title: "1st Revision (40 min): Fruit Crops (BAGC306) & Kharif Crops (BAGC305)", code: "BAGC306", start: "21:40", end: "22:20" },
  Tuesday: { title: "1st Revision (40 min): Extension Education (BAGC307) & Genetics (BAGC304)", code: "BAGC304", start: "21:40", end: "22:20" },
  Wednesday: { title: "1st Revision (40 min): Entrepreneurship (BAGA302) & Extension (BAGC307)", code: "BAGA302", start: "21:40", end: "22:20" },
  Thursday: { title: "1st Revision (40 min): Natural Farming (BAGC309) & Fruit Crops (BAGC306)", code: "BAGC309", start: "21:40", end: "22:20" },
  Friday: { title: "1st Revision (40 min): Nematology (BAGC308) & Kharif Crops (BAGC305)", code: "BAGC308", start: "21:40", end: "22:20" },
  Saturday: { title: "1st Revision (40 min): Natural Farming (BAGC309) & Insect Farming (BAGS301)", code: "BAGS301", start: "21:40", end: "22:20" }
};

// Explicit 2nd Revision Map (40 min in morning 07:15 - 07:55 AM)
const secondRevisionMap40m = {
  Monday: { title: "2nd Revision (40 min): Saturday Classes Recall (Natural Farming & Genetics)", code: "BAGC304", start: "07:15", end: "07:55" },
  Tuesday: { title: "2nd Revision (40 min): Monday Classes Recall (Fruit Crops & Kharif Crops)", code: "BAGC306", start: "07:15", end: "07:55" },
  Wednesday: { title: "2nd Revision (40 min): Tuesday Classes Recall (Extension & Genetics)", code: "BAGC307", start: "07:15", end: "07:55" },
  Thursday: { title: "2nd Revision (40 min): Wednesday Classes Recall (Entrepreneurship & Extension)", code: "BAGA302", start: "07:15", end: "07:55" },
  Friday: { title: "2nd Revision (40 min): Thursday Classes Recall (Natural Farming & Kharif Crops)", code: "BAGC309", start: "07:15", end: "07:55" },
  Saturday: { title: "2nd Revision (40 min): Friday Classes Recall (Nematology & Entrepreneurship)", code: "BAGC308", start: "07:15", end: "07:55" }
};

// Explicit Pre-class Study Map (40 min at night 22:20 - 23:00)
const preStudyMap40m = {
  Monday: { title: "Pre-class Study (40 min): Tomorrow's Classes (Extension BAGC307 & Genetics BAGC304)", code: "BAGC307", start: "22:20", end: "23:00" },
  Tuesday: { title: "Pre-class Study (40 min): Tomorrow's Classes (Entrepreneurship BAGA302 & Extension BAGC307)", code: "BAGA302", start: "22:20", end: "23:00" },
  Wednesday: { title: "Pre-class Study (40 min): Tomorrow's Classes (Natural Farming BAGC309 & Fruit Crops BAGC306)", code: "BAGC309", start: "22:20", end: "23:00" },
  Thursday: { title: "Pre-class Study (40 min): Tomorrow's Classes (Nematology BAGC308 & Kharif Crops BAGC305)", code: "BAGC308", start: "22:20", end: "23:00" },
  Friday: { title: "Pre-class Study (40 min): Tomorrow's Classes (Natural Farming BAGC309 & Genetics BAGC304)", code: "BAGC309", start: "22:20", end: "23:00" },
  Saturday: { title: "Pre-class Study (40 min): Backlog & Sunday Review", code: null, start: "22:20", end: "23:00" },
  Sunday: { title: "Pre-class Study (40 min): Monday's Classes (Insect Farming BAGS301 & Fruit Crops BAGC306)", code: "BAGS301", start: "22:20", end: "23:00" }
};

function formatIsoTime(dateStr, timeStr) {
  const [hours, mins] = timeStr.split(':').map(Number);
  const dateObj = new Date(dateStr + 'T00:00:00+05:30');
  
  if (hours < 6) {
    dateObj.setDate(dateObj.getDate() + 1);
  }
  
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const hh = String(hours).padStart(2, '0');
  const minStr = String(mins).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}T${hh}:${minStr}:00+05:30`;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const startDate = new Date('2026-09-21T00:00:00+05:30');
const days = [];

for (let i = 0; i < 40; i++) {
  const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
  const yyyy = currentDate.getFullYear();
  const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dd = String(currentDate.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;
  
  const dayOfWeek = dayNames[currentDate.getDay()];
  const dayNumber = i + 1;
  const weekNumber = Math.floor(i / 7) + 1;
  
  const isSunday = (dayOfWeek === "Sunday");
  const isWednesday = (dayOfWeek === "Wednesday");
  const dayType = isSunday ? "home_day" : "college_day";
  
  const events = [];
  let evtIndex = 1;
  
  const addEvt = (item) => {
    const startIso = formatIsoTime(dateStr, item.start);
    const endIso = formatIsoTime(dateStr, item.end);
    
    events.push({
      id: `evt_${dateStr.replace(/-/g, '')}_${String(evtIndex++).padStart(2, '0')}`,
      start_time: startIso,
      end_time: endIso,
      title: item.title,
      category: item.category,
      subject_code: item.code || null,
      subject_name: subjects.find(s => s.code === item.code)?.name || item.subject_name || null,
      focus_topic: item.focus_topic || null,
      notes: item.notes || null,
      alert_minutes_before: item.alert_minutes_before !== undefined ? item.alert_minutes_before : 5,
      high_priority_alarm: !!item.high_priority
    });
  };
  
  if (!isSunday) {
    // COLLEGE DAY ROUTINE WITH EXPLICIT SUBJECT NAMES & CODES
    
    // 1. Wake up
    addEvt({ start: "06:00", end: "06:15", category: "routine", title: "Wake up & freshen up", high_priority: true, alert_minutes_before: 0 });
    
    // 2. Competitive Exam Prep (1 Hour Slot: 06:15 - 07:15 AM)
    const compTopic = compExamTopics[dayOfWeek] || { subject: "Competitive Agriculture", topic: "General Agriculture" };
    addEvt({
      start: "06:15",
      end: "07:15",
      category: "exam_prep",
      title: `Competitive Exam Prep (1 Hr): ${compTopic.subject}`,
      focus_topic: compTopic.topic
    });
    
    // 3. 2nd Revision of Previous Class (40 minutes: 07:15 - 07:55 AM)
    const rev2 = secondRevisionMap40m[dayOfWeek];
    if (rev2) addEvt({ start: rev2.start, end: rev2.end, category: "second_revision", title: rev2.title, code: rev2.code });
    
    // 4. Get ready
    addEvt({ start: "07:55", end: "09:30", category: "routine", title: "Get ready for college" });
    
    // 5. Jaap (9:30 AM)
    addEvt({ start: "09:30", end: "09:35", category: "jaap", title: "Jaap (5 min)", high_priority: true, alert_minutes_before: 2 });
    
    // 6. Leave
    addEvt({ start: "09:35", end: "10:00", category: "routine", title: "Final prep & leave for college" });
    
    // 7. College periods
    const cPeriods = collegeClasses[dayOfWeek] || [];
    cPeriods.forEach(cp => addEvt({ start: cp.start, end: cp.end, category: cp.type, title: cp.title, code: cp.code }));
    
    // 8. Travel back & snack
    addEvt({ start: "17:00", end: "18:00", category: "meals", title: "Travel back, rest & snack" });
    
    // 9. Jaap (6:00 PM)
    addEvt({ start: "18:00", end: "18:05", category: "jaap", title: "Jaap (5 min)", high_priority: true, alert_minutes_before: 2 });
    
    // 10. COLLEGE SEMESTER EXAM PREPARATION - SLOT 1 (18:05 - 20:00 = 1 Hr 55 Min)
    const examPlan = collegeExamStudyPlan[dayOfWeek];
    if (examPlan) {
      addEvt({
        start: "18:05",
        end: "20:00",
        category: "college_exam_prep",
        title: examPlan.slot1.title,
        code: examPlan.slot1.code,
        focus_topic: examPlan.slot1.topic
      });
    }
    
    // 11. Dinner
    addEvt({ start: "20:00", end: "21:00", category: "meals", title: "Dinner" });
    
    // 12. Drawing / Hobby Slot (ONLY ON WEDNESDAY! Mon, Tue, Thu, Fri, Sat allocated to College Study!)
    if (isWednesday) {
      addEvt({ start: "21:00", end: "21:40", category: "drawing", title: "Drawing / Hobby Hour (Wednesday Slot)" });
    } else {
      addEvt({
        start: "21:00",
        end: "21:40",
        category: "college_exam_prep",
        title: `College Exam Practice: ${examPlan?.slot1.code || 'Semester Subject'} Question Bank`,
        code: examPlan?.slot1.code,
        focus_topic: "Solve end-of-chapter questions & previous semester paper problems"
      });
    }
    
    // 13. 1st REVISION OF TODAY'S CLASSES (40 minutes: 21:40 - 22:20)
    const rev1 = firstRevisionMap40m[dayOfWeek];
    if (rev1) addEvt({ start: rev1.start, end: rev1.end, category: "first_revision", title: rev1.title, code: rev1.code });
    
    // 14. PRE-CLASS STUDY FOR TOMORROW (40 minutes: 22:20 - 23:00)
    const ps = preStudyMap40m[dayOfWeek];
    if (ps) addEvt({ start: ps.start, end: ps.end, category: "pre_study", title: ps.title, code: ps.code });
    
    // 15. COLLEGE SEMESTER EXAM PREPARATION - SLOT 2 (23:00 - 00:40 = 1 Hr 40 Min)
    if (examPlan) {
      addEvt({
        start: "23:00",
        end: "00:40",
        category: "college_exam_prep",
        title: examPlan.slot2.title,
        code: examPlan.slot2.code,
        focus_topic: examPlan.slot2.topic
      });
    }
    
    // 16. Daily Recap
    addEvt({ start: "00:40", end: "00:55", category: "routine", title: "Daily recap & plan tomorrow" });
    
    // 17. Wind down
    addEvt({ start: "00:55", end: "01:00", category: "routine", title: "Wind down" });
    
    // 18. Jaap (1:00 AM)
    addEvt({ start: "01:00", end: "01:05", category: "jaap", title: "Jaap (5 min)", high_priority: true, alert_minutes_before: 2 });
    
    // 19. Sleep
    addEvt({ start: "01:05", end: "06:00", category: "sleep", title: "Sleep" });
    
  } else {
    // SUNDAY (HOME DAY ROUTINE - SPECIFIC SUBJECTS)
    addEvt({ start: "06:00", end: "06:15", category: "routine", title: "Wake up & freshen up", high_priority: true, alert_minutes_before: 0 });
    addEvt({ start: "06:15", end: "07:45", category: "exam_prep", title: "Competitive Exam Prep (1.5 Hr): Agronomy & Soil Science Basics", focus_topic: "Tillage, Water relations & Soil Classification" });
    addEvt({ start: "07:45", end: "09:30", category: "meals", title: "Breakfast & free time" });
    addEvt({ start: "09:30", end: "09:35", category: "jaap", title: "Jaap (5 min)", high_priority: true, alert_minutes_before: 2 });
    addEvt({ start: "09:35", end: "10:35", category: "weekly_revision", title: "College Revision: Principles of Genetics (BAGC304)", code: "BAGC304" });
    addEvt({ start: "10:35", end: "11:35", category: "weekly_revision", title: "College Revision: Kharif Crops CPT-I (BAGC305)", code: "BAGC305" });
    addEvt({ start: "11:35", end: "12:35", category: "weekly_revision", title: "College Revision: Fruit & Plantation Crops (BAGC306)", code: "BAGC306" });
    addEvt({ start: "12:35", end: "14:30", category: "meals", title: "Lunch & rest" });
    addEvt({ start: "14:30", end: "15:15", category: "weekly_revision", title: "College Revision: Extension Education (BAGC307)", code: "BAGC307" });
    addEvt({ start: "15:15", end: "16:00", category: "weekly_revision", title: "College Revision: Nematology (BAGC308) & Natural Farming (BAGC309)", code: "BAGC308" });
    addEvt({ start: "16:00", end: "16:15", category: "meals", title: "Break" });
    addEvt({ start: "16:15", end: "17:15", category: "mock_test", title: "College Subjects Weekly Quiz & Test (60 MCQs)" });
    addEvt({ start: "17:15", end: "18:00", category: "mock_test", title: "Test analysis & error notebook" });
    addEvt({ start: "18:00", end: "18:05", category: "jaap", title: "Jaap (5 min)", high_priority: true, alert_minutes_before: 2 });
    addEvt({ start: "18:05", end: "20:00", category: "meals", title: "Rest, family, walk, chores" });
    addEvt({ start: "20:00", end: "21:00", category: "meals", title: "Dinner" });
    
    // DRAWING HOBBY HOUR (SUNDAY SLOT)
    addEvt({ start: "21:00", end: "21:40", category: "drawing", title: "Drawing / Hobby Hour (Sunday Slot)" });
    
    // Revisions & Pre-study
    addEvt({ start: "21:40", end: "22:20", category: "first_revision", title: "1st Revision (40 min): Entrepreneurship (BAGA302) & Insect Farming (BAGS301)", code: "BAGS301" });
    const ps = preStudyMap40m["Sunday"];
    if (ps) addEvt({ start: "22:20", end: "23:00", category: "pre_study", title: ps.title, code: ps.code });
    
    addEvt({ start: "23:00", end: "00:45", category: "college_exam_prep", title: "College Semester Exam Prep: Backlog & Laboratory Manuals Study", focus_topic: "Review practical records & key diagrams" });
    addEvt({ start: "00:45", end: "01:00", category: "routine", title: "Weekly plan check & wind down" });
    addEvt({ start: "01:00", end: "01:05", category: "jaap", title: "Jaap (5 min)", high_priority: true, alert_minutes_before: 2 });
    addEvt({ start: "01:05", end: "06:00", category: "sleep", title: "Sleep" });
  }
  
  days.push({
    date: dateStr,
    day_number: dayNumber,
    week_number: weekNumber,
    day_of_week: dayOfWeek,
    day_type: dayType,
    events
  });
}

const fullData = {
  user_profile: {
    course: "B.Sc. (Hons.) Agriculture",
    semester: "III (2026-27 odd semester)",
    section: "A",
    batch: "A",
    target_exams: ["College Semester Exams", "JRF", "AFO", "NABARD"],
    wake_time: "06:00",
    sleep_time: "01:05"
  },
  subjects,
  category_guidance: categoryGuidance,
  days
};

const outPath = path.resolve('public/study_timetable_21Sep-30Oct_2026.json');
fs.writeFileSync(outPath, JSON.stringify(fullData, null, 2));
console.log(`Successfully generated updated JSON timetable asset with explicit subject names at: ${outPath}`);
