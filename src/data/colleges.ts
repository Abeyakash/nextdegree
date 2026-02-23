export interface College {
  id: number;
  slug: string;
  name: string;
  location: string;
  rating: number;
  courses: string[];
  fees: number;
  students: string;
  colorClass: string;
  established: number;
  overview: string;
  placements: { avg: string; high: string; recruiters: string[] };
  image: string;
}

export const colleges: College[] = [
  // --- Dahisar Colleges (Original) ---
  {
    id: 1,
    slug: "thakur-ramnarayan-college",
    name: "Thakur Ramnarayan College of Arts and Commerce",
    location: "Dahisar East, Mumbai",
    rating: 4.4,
    courses: ["B.Com", "BMS", "BA"],
    fees: 60000,
    students: "4000+",
    colorClass: "bg-blue-500",
    established: 1990,
    overview: "Thakur Ramnarayan College offers quality education in arts, commerce, and management with modern infrastructure.",
    placements: { avg: "₹5 LPA", high: "₹12 LPA", recruiters: ["TCS", "Infosys", "Capgemini"] },
    image: "/colleges/images/thakur.jpg"
  },
  {
    id: 2,
    slug: "reena-mehta-college",
    name: "Reena Mehta College",
    location: "Dahisar East, Mumbai",
    rating: 4.2,
    courses: ["B.Com", "BMS", "BAF"],
    fees: 55000,
    students: "3500+",
    colorClass: "bg-green-500",
    established: 1988,
    overview: "Reena Mehta College is known for its strong focus on academics and student development in commerce and management.",
    placements: { avg: "₹4.5 LPA", high: "₹10 LPA", recruiters: ["Infosys", "Wipro", "TCS"] },
    image: "/colleges/images/reena_mehta.jpg"
  },
  {
    id: 3,
    slug: "mit-vishwajyoti-college",
    name: "MIT Vishwajyoti School Junior & Senior College",
    location: "Dahisar East, Mumbai",
    rating: 4.1,
    courses: ["Science", "Commerce", "Arts"],
    fees: 65000,
    students: "3000+",
    colorClass: "bg-purple-500",
    established: 1995,
    overview: "MIT Vishwajyoti College provides excellent junior and senior college programs with emphasis on holistic growth.",
    placements: { avg: "₹5 LPA", high: "₹11 LPA", recruiters: ["Capgemini", "Cognizant", "IBM"] },
    image: "/colleges/images/mit_vishwajyoti.jpg"
  },

  // --- Mira-Bhayandar Colleges (Original) ---
  {
    id: 4,
    slug: "royal-college-mira-road",
    name: "Royal College of Arts, Science & Commerce",
    location: "Mira Road, Mumbai",
    rating: 4.3,
    courses: ["B.Com", "BMS", "BAF"],
    fees: 50000,
    students: "3800+",
    colorClass: "bg-red-500",
    established: 1992,
    overview: "Royal College offers comprehensive programs in arts, science, and commerce with modern infrastructure and placements.",
    placements: { avg: "₹4.8 LPA", high: "₹10 LPA", recruiters: ["TCS", "Infosys", "Reliance"] },
    image: "/colleges/images/royal.jpg"
  },
  {
    id: 5,
    slug: "rawal-college-mira-road",
    name: "Rawal College",
    location: "Mira Road, Mumbai",
    rating: 4.0,
    courses: ["BMS", "B.Com", "BAF"],
    fees: 45000,
    students: "3200+",
    colorClass: "bg-yellow-500",
    established: 1985,
    overview: "Rawal College focuses on commerce and management courses with excellent faculty and industry linkages.",
    placements: { avg: "₹4.5 LPA", high: "₹9 LPA", recruiters: ["Wipro", "Infosys", "TCS"] },
    image: "/colleges/images/rawal.jpg"
  },

  // --- Virar Colleges (Original) ---
  {
    id: 6,
    slug: "viva-college-virar",
    name: "Viva College of Arts, Commerce & Science",
    location: "Virar West, Mumbai",
    rating: 4.1,
    courses: ["B.Com", "BMS", "Science"],
    fees: 40000,
    students: "2800+",
    colorClass: "bg-indigo-500",
    established: 1990,
    overview: "Viva College provides diverse courses and ensures strong student placement programs in Mumbai's northern suburbs.",
    placements: { avg: "₹4.2 LPA", high: "₹9 LPA", recruiters: ["Cognizant", "TCS", "Infosys"] },
    image: "/colleges/images/viva.jpg"
  },
  
  // --- South Mumbai Colleges (Added) ---
  {
    id: 8,
    slug: "st-xaviers-college",
    name: "St. Xavier's College",
    location: "Fort, Mumbai",
    rating: 4.6,
    courses: ["BA", "BSc", "BCom", "BMM"],
    fees: 20000,
    students: "6000+",
    colorClass: "bg-red-700",
    established: 1869,
    overview: "A prestigious autonomous college known for its legacy in Arts, Science, and Commerce, located in South Mumbai.",
    placements: { avg: "₹6 LPA", high: "₹20 LPA", recruiters: ["DE Shaw", "KPMG", "Deloitte"] },
    image: "/colleges/images/st_xaviers.jpg"
  },
  {
    id: 9,
    slug: "narsee-monjee-college",
    name: "Narsee Monjee College of Commerce & Economics",
    location: "Vile Parle West, Mumbai",
    rating: 4.5,
    courses: ["BCom", "BFA", "BFM", "BMS"],
    fees: 25000,
    students: "5500+",
    colorClass: "bg-yellow-600",
    established: 1964,
    overview: "One of the top institutions for Commerce and Economics in Mumbai, with excellent placement records.",
    placements: { avg: "₹7 LPA", high: "₹25 LPA", recruiters: ["EY", "JP Morgan", "Axis Bank"] },
    image: "/colleges/images/narsee_monjee.jpg"
  },
  {
    id: 10,
    slug: "hr-college",
    name: "H.R. College of Commerce & Economics",
    location: "Churchgate, Mumbai",
    rating: 4.4,
    courses: ["BCom", "BAF", "BBI", "BMS"],
    fees: 35000,
    students: "4500+",
    colorClass: "bg-teal-500",
    established: 1960,
    overview: "Autonomous college under HSNCU, highly reputed for its Commerce and Management programs.",
    placements: { avg: "₹5 LPA", high: "₹15 LPA", recruiters: ["HDFC", "Deloitte", "KPMG"] },
    image: "/colleges/images/hr_college.jpg"
  },
  {
    id: 11,
    slug: "mithibai-college",
    name: "Mithibai College of Arts",
    location: "Vile Parle West, Mumbai",
    rating: 4.4,
    courses: ["BA", "BSc", "BCom", "BMM"],
    fees: 40000,
    students: "7000+",
    colorClass: "bg-blue-600",
    established: 1961,
    overview: "One of the most sought-after colleges for Arts, Science, and Commerce, affiliated with the University of Mumbai.",
    placements: { avg: "₹4.5 LPA", high: "₹12 LPA", recruiters: ["Wipro", "L&T", "TCS"] },
    image: "/colleges/images/mithibai.jpg"
  },
  {
    id: 12,
    slug: "jai-hind-college",
    name: "Jai Hind College",
    location: "Churchgate, Mumbai",
    rating: 4.3,
    courses: ["BMS", "BMM", "BCom", "BA"],
    fees: 30000,
    students: "4000+",
    colorClass: "bg-orange-500",
    established: 1948,
    overview: "A highly-rated autonomous college offering diverse programs in Arts, Science, and Commerce.",
    placements: { avg: "₹4 LPA", high: "₹10 LPA", recruiters: ["Morgan Stanley", "Infosys", "Deloitte"] },
    image: "/colleges/images/jai_hind.jpg"
  },
  {
    id: 13,
    slug: "podar-college",
    name: "R.A. Podar College of Commerce & Economics",
    location: "Matunga, Mumbai",
    rating: 4.2,
    courses: ["BCom", "MCom"],
    fees: 18000,
    students: "3500+",
    colorClass: "bg-green-700",
    established: 1941,
    overview: "A reputed government-aided college exclusively for Commerce and Economics education.",
    placements: { avg: "₹3.5 LPA", high: "₹8 LPA", recruiters: ["PwC", "SBI", "Axis Bank"] },
    image: "/colleges/images/podar.jpg"
  },
  {
    id: 14,
    slug: "sydenham-college",
    name: "Sydenham College of Commerce & Economics",
    location: "Churchgate, Mumbai",
    rating: 4.1,
    courses: ["BCom", "MCom"],
    fees: 15000,
    students: "3000+",
    colorClass: "bg-indigo-700",
    established: 1913,
    overview: "Asia's oldest commerce college, highly regarded for its academic excellence in Commerce.",
    placements: { avg: "₹4 LPA", high: "₹9 LPA", recruiters: ["HDFC Bank", "ICICI Bank", "Standard Chartered"] },
    image: "/colleges/images/sydenham.jpg"
  },
  {
    id: 15,
    slug: "dg-ruia-college",
    name: "Ramnarain Ruia Autonomous College",
    location: "Matunga, Mumbai",
    rating: 4.3,
    courses: ["BSc", "BA", "BMM"],
    fees: 25000,
    students: "5000+",
    colorClass: "bg-purple-600",
    established: 1937,
    overview: "Known for its strong focus on Science and Arts programs and a vibrant campus culture.",
    placements: { avg: "₹3.8 LPA", high: "₹7 LPA", recruiters: ["TCS", "Tech Mahindra", "Cognizant"] },
    image: "/colleges/images/ruia.jpg"
  },

  // --- Bandra / Andheri Colleges (Added) ---
  {
    id: 16,
    slug: "rizvi-college",
    name: "Rizvi College of Arts, Science and Commerce",
    location: "Bandra West, Mumbai",
    rating: 4.0,
    courses: ["Arts", "Science", "Commerce", "BMS"],
    fees: 45000,
    students: "3500+",
    colorClass: "bg-rose-500",
    established: 1992,
    overview: "A prominent college in Bandra offering a wide range of undergraduate courses.",
    placements: { avg: "₹3.5 LPA", high: "₹6 LPA", recruiters: ["Wipro", "HCL", "Reliance"] },
    image: "/colleges/images/rizvi.jpg"
  },
  {
    id: 17,
    slug: "tolani-college",
    name: "Tolani College of Commerce",
    location: "Andheri East, Mumbai",
    rating: 3.9,
    courses: ["BCom", "BAF", "BMS"],
    fees: 40000,
    students: "2800+",
    colorClass: "bg-yellow-400",
    established: 1989,
    overview: "Focuses primarily on commerce and related professional courses.",
    placements: { avg: "₹3.2 LPA", high: "₹5.5 LPA", recruiters: ["TCS", "ICICI Bank", "HDFC"] },
    image: "/colleges/images/tolani.jpg"
  },
  {
    id: 18,
    slug: "patkar-college",
    name: "Patkar-Varde College",
    location: "Goregaon West, Mumbai",
    rating: 4.0,
    courses: ["Arts", "Science", "Commerce"],
    fees: 38000,
    students: "4200+",
    colorClass: "bg-lime-500",
    established: 1964,
    overview: "A well-established college in the western suburbs offering a variety of streams.",
    placements: { avg: "₹3.5 LPA", high: "₹6.5 LPA", recruiters: ["Infosys", "Wipro", "Capgemini"] },
    image: "/colleges/images/patkar.jpg"
  },
  {
    id: 19,
    slug: "thakur-college-kandivali",
    name: "Thakur College of Science and Commerce",
    location: "Kandivali East, Mumbai",
    rating: 4.4,
    courses: ["Science", "Commerce", "BMS", "IT"],
    fees: 55000,
    students: "6000+",
    colorClass: "bg-red-600",
    established: 1992,
    overview: "A large college with excellent infrastructure, popular for Science and Commerce courses.",
    placements: { avg: "₹4.5 LPA", high: "₹10 LPA", recruiters: ["TCS", "Accenture", "Cognizant"] },
    image: "/colleges/images/thakur_kandivali.jpg"
  },
  {
    id: 20,
    slug: "kc-college",
    name: "Kishinchand Chellaram College (K.C. College)",
    location: "Churchgate, Mumbai",
    rating: 4.2,
    courses: ["BSc", "BCom", "BA", "BMM"],
    fees: 28000,
    students: "4500+",
    colorClass: "bg-sky-500",
    established: 1954,
    overview: "A reputed autonomous college offering multi-disciplinary courses in the heart of Mumbai.",
    placements: { avg: "₹4 LPA", high: "₹9 LPA", recruiters: ["Capgemini", "Wipro", "Infosys"] },
    image: "/colleges/images/kc_college.jpg"
  },

  // --- Ghatkopar / Mulund Colleges (Added) ---
  {
    id: 21,
    slug: "rj-college",
    name: "Ramniranjan Jhunjhunwala College",
    location: "Ghatkopar West, Mumbai",
    rating: 4.1,
    courses: ["Science", "Arts", "Commerce", "IT"],
    fees: 40000,
    students: "5000+",
    colorClass: "bg-pink-600",
    established: 1953,
    overview: "Autonomous college known for Science and Arts, with a dedicated placement cell.",
    placements: { avg: "₹3.5 LPA", high: "₹7 LPA", recruiters: ["TCS", "Larsen & Toubro", "Wipro"] },
    image: "/colleges/images/rj.jpg"
  },
  {
    id: 22,
    slug: "mulund-college-of-commerce",
    name: "Mulund College of Commerce (MCC)",
    location: "Mulund West, Mumbai",
    rating: 4.0,
    courses: ["BCom", "BMS", "BAF"],
    fees: 35000,
    students: "3000+",
    colorClass: "bg-amber-600",
    established: 1970,
    overview: "A well-known college in the central suburbs, focusing mainly on commerce and management education.",
    placements: { avg: "₹3 LPA", high: "₹5.5 LPA", recruiters: ["Infosys", "HDFC", "Axis Bank"] },
    image: "/colleges/images/mulund.jpg"
  },
  {
    id: 23,
    slug: "vivekanand-college",
    name: "Vivekanand Education Society's Arts, Science & Commerce College (VESASC)",
    location: "Chembur, Mumbai",
    rating: 4.0,
    courses: ["BA", "BSc", "BCom", "BMS"],
    fees: 38000,
    students: "4000+",
    colorClass: "bg-cyan-600",
    established: 1970,
    overview: "Offers a mix of Arts, Science, and Commerce courses with a good academic environment.",
    placements: { avg: "₹3.3 LPA", high: "₹6 LPA", recruiters: ["TCS", "Larsen & Toubro", "Tech Mahindra"] },
    image: "/colleges/images/vesasc.jpg"
  },
  {
    id: 24,
    slug: "sathaye-college",
    name: "Sathaye College (formerly Parle College)",
    location: "Vile Parle East, Mumbai",
    rating: 3.9,
    courses: ["Arts", "Science", "Commerce"],
    fees: 30000,
    students: "3000+",
    colorClass: "bg-gray-500",
    established: 1959,
    overview: "A well-regarded suburban college with a focus on holistic education.",
    placements: { avg: "₹3 LPA", high: "₹5 LPA", recruiters: ["Wipro", "Capgemini", "HDFC"] },
    image: "/colleges/images/sathaye.jpg"
  },
  {
    id: 25,
    slug: "kjs-college-of-science",
    name: "K. J. Somaiya College of Science and Commerce",
    location: "Vidyavihar, Mumbai",
    rating: 4.2,
    courses: ["BSc", "BCom", "MSc", "IT"],
    fees: 50000,
    students: "4000+",
    colorClass: "bg-fuchsia-700",
    established: 1959,
    overview: "Known for its science programs and good infrastructure within the Somaiya Vidyavihar campus.",
    placements: { avg: "₹4 LPA", high: "₹9 LPA", recruiters: ["Infosys", "TCS", "Accenture"] },
    image: "/colleges/images/kjsac.jpg"
  },
  {
    id: 26,
    slug: "burhani-college",
    name: "Burhani College of Commerce & Arts",
    location: "Mazgaon, Mumbai",
    rating: 3.8,
    courses: ["BCom", "BA", "BMS"],
    fees: 30000,
    students: "2500+",
    colorClass: "bg-emerald-500",
    established: 1968,
    overview: "A college focused on commerce and arts, located in South Mumbai.",
    placements: { avg: "₹2.8 LPA", high: "₹4.5 LPA", recruiters: ["HDFC", "ICICI Bank", "Genpact"] },
    image: "/colleges/images/burhani.jpg"
  },
  {
    id: 27,
    slug: "bhavans-college-andheri",
    name: "Bhavan's College",
    location: "Andheri West, Mumbai",
    rating: 4.1,
    courses: ["BA", "BSc", "BCom", "BMS"],
    fees: 35000,
    students: "4500+",
    colorClass: "bg-amber-800",
    established: 1946,
    overview: "Part of the Bharatiya Vidya Bhavan, offering a mix of Arts, Science, and Commerce courses.",
    placements: { avg: "₹3.5 LPA", high: "₹6 LPA", recruiters: ["TCS", "Wipro", "Infosys"] },
    image: "/colleges/images/bhavans.jpg"
  },
  {
    id: 28,
    slug: "guru-nanak-college",
    name: "Guru Nanak Khalsa College of Arts, Science & Commerce",
    location: "Matunga East, Mumbai",
    rating: 4.0,
    courses: ["Arts", "Science", "Commerce", "BMS"],
    fees: 32000,
    students: "3800+",
    colorClass: "bg-cyan-800",
    established: 1937,
    overview: "A well-known college in Matunga for its strong academic record across multiple streams.",
    placements: { avg: "₹3.2 LPA", high: "₹5.8 LPA", recruiters: ["HCL", "Cognizant", "TCS"] },
    image: "/colleges/images/guru_nanak.jpg"
  },
  {
    id: 29,
    slug: "md-college",
    name: "Shri M.D. Shah Mahila College of Arts and Commerce",
    location: "Malad West, Mumbai",
    rating: 3.9,
    courses: ["BA", "BCom", "BMS"],
    fees: 30000,
    students: "2500+",
    colorClass: "bg-pink-400",
    established: 1968,
    overview: "A prominent women's college in the western suburbs offering Arts and Commerce degrees.",
    placements: { avg: "₹2.5 LPA", high: "₹4 LPA", recruiters: ["Wipro", "HDFC", "TCS"] },
    image: "/colleges/images/md_shah.jpg"
  },
  {
    id: 30,
    slug: "dr-bhanuben-nanavati",
    name: "Dr. Bhanuben Nanavati College of Pharmacy",
    location: "Vile Parle West, Mumbai",
    rating: 4.3,
    courses: ["B.Pharm", "M.Pharm"],
    fees: 120000,
    students: "1000+",
    colorClass: "bg-lime-700",
    established: 1982,
    overview: "A specialized college focused on Pharmaceutical Science education and research.",
    placements: { avg: "₹5.5 LPA", high: "₹10 LPA", recruiters: ["Cipla", "Sun Pharma", "Dr. Reddy's Labs"] },
    image: "/colleges/images/bhanuben_nanavati.jpg"
  },
  {
    id: 31,
    slug: "siws-college",
    name: "South Indian Welfare Society's College (SIWS)",
    location: "Wadala, Mumbai",
    rating: 3.9,
    courses: ["Arts", "Science", "Commerce"],
    fees: 30000,
    students: "3000+",
    colorClass: "bg-red-900",
    established: 1978,
    overview: "Offers undergraduate programs in Arts, Science, and Commerce in the central Mumbai region.",
    placements: { avg: "₹3 LPA", high: "₹5 LPA", recruiters: ["Infosys", "Wipro", "TCS"] },
    image: "/colleges/images/siws.jpg"
  },
  {
    id: 32,
    slug: "ismail-yusuf-college",
    name: "Ismail Yusuf College",
    location: "Jogeshwari East, Mumbai",
    rating: 3.7,
    courses: ["Arts", "Science", "Commerce"],
    fees: 15000,
    students: "2000+",
    colorClass: "bg-zinc-600",
    established: 1924,
    overview: "One of the oldest government colleges in Mumbai with a large campus.",
    placements: { avg: "₹2.5 LPA", high: "₹4 LPA", recruiters: ["TCS", "HDFC", "Wipro"] },
    image: "/colleges/images/ismail_yusuf.jpg"
  },
  {
    id: 33,
    slug: "prakash-college-of-commerce",
    name: "Prakash College of Commerce & Science",
    location: "Kandivali West, Mumbai",
    rating: 3.8,
    courses: ["BCom", "BSc", "BMS"],
    fees: 40000,
    students: "2200+",
    colorClass: "bg-blue-300",
    established: 1985,
    overview: "A suburban college offering Commerce and Science undergraduate programs.",
    placements: { avg: "₹2.8 LPA", high: "₹4.8 LPA", recruiters: ["Capgemini", "Infosys", "ICICI Bank"] },
    image: "/colleges/images/prakash.jpg"
  },
  {
    id: 34,
    slug: "chetana-college",
    name: "Chetana's H.S. College of Commerce & Economics",
    location: "Bandra East, Mumbai",
    rating: 4.0,
    courses: ["BCom", "MCom", "BMS"],
    fees: 45000,
    students: "3000+",
    colorClass: "bg-lime-300",
    established: 1970,
    overview: "Known for its Commerce and Management programs near Bandra Kurla Complex (BKC).",
    placements: { avg: "₹3.5 LPA", high: "₹6 LPA", recruiters: ["HDFC Bank", "Deloitte", "Genpact"] },
    image: "/colleges/images/chetana.jpg"
  },
  {
    id: 35,
    slug: "siws-college-of-science",
    name: "SIWS College of Science & Commerce",
    location: "Wadala, Mumbai",
    rating: 4.1,
    courses: ["BSc", "BCom", "IT", "CS"],
    fees: 35000,
    students: "3500+",
    colorClass: "bg-teal-700",
    established: 1978,
    overview: "A sister college to SIWS, offering strong programs in Science and Commerce.",
    placements: { avg: "₹3.3 LPA", high: "₹5.5 LPA", recruiters: ["Infosys", "TCS", "Wipro"] },
    image: "/colleges/images/siws_science.jpg"
  }
];

export function getCollegeBySlug(slug: string): College | undefined {
  return colleges.find(college => college.slug === slug);
}

export interface CollegeDetails {
  officialWebsite: string;
  admissionLink: string;
  university: string;
  accreditation: string;
  admissionMode: string;
  contactEmail: string;
  contactPhone: string;
  popularPrograms: string[];
}

const mumbaiUniversityAdmissionPortal = 'https://muugadmission.samarth.edu.in/'

const collegeDirectory: Record<string, Partial<CollegeDetails>> = {
  'st-xaviers-college': {
    officialWebsite: 'https://xaviers.edu/',
    admissionLink: 'https://xaviers.edu/main/index.php/admissions/',
    accreditation: 'NAAC A+',
    admissionMode: 'Merit based + entrance for selected programs',
    contactEmail: 'principal@xaviers.edu',
    contactPhone: '+91-22-22620661',
  },
  'narsee-monjee-college': {
    officialWebsite: 'https://nmcollege.in/',
    admissionLink: 'https://nmcollege.in/admissions/',
    accreditation: 'NAAC A',
    contactEmail: 'office@nmcollege.in',
    contactPhone: '+91-22-42334000',
  },
  'hr-college': {
    officialWebsite: 'https://hrcollege.edu/',
    admissionLink: 'https://hrcollege.edu/admissions/',
    accreditation: 'NAAC A',
    contactEmail: 'info@hrcollege.edu',
    contactPhone: '+91-22-22876115',
  },
  'mithibai-college': {
    officialWebsite: 'https://mithibai.ac.in/',
    admissionLink: 'https://mithibai.ac.in/admissions/',
    accreditation: 'NAAC A',
    contactEmail: 'principal@mithibai.ac.in',
    contactPhone: '+91-22-42339000',
  },
  'jai-hind-college': {
    officialWebsite: 'https://www.jaihindcollege.com/',
    admissionLink: 'https://www.jaihindcollege.com/admissions/',
    accreditation: 'NAAC A',
    contactEmail: 'info@jaihindcollege.edu.in',
    contactPhone: '+91-22-22040256',
  },
  'podar-college': {
    officialWebsite: 'https://www.podarcollege.edu.in/',
    admissionLink: 'https://www.podarcollege.edu.in/admission',
    accreditation: 'NAAC A',
    contactEmail: 'podarcollege@podarcollege.edu.in',
    contactPhone: '+91-22-24143178',
  },
  'sydenham-college': {
    officialWebsite: 'https://sydenham.ac.in/',
    admissionLink: 'https://sydenham.ac.in/admission/',
    accreditation: 'NAAC A',
    contactEmail: 'principal.sydenham@dtemaharashtra.gov.in',
    contactPhone: '+91-22-22042897',
  },
  'dg-ruia-college': {
    officialWebsite: 'https://www.ruiacollege.edu/',
    admissionLink: 'https://www.ruiacollege.edu/admissions/',
    accreditation: 'NAAC A+',
    contactEmail: 'office@ruiacollege.edu',
    contactPhone: '+91-22-24143098',
  },
  'thakur-college-kandivali': {
    officialWebsite: 'https://www.tcsc.edu.in/',
    admissionLink: 'https://www.tcsc.edu.in/admissions',
    accreditation: 'NAAC A',
    contactEmail: 'admission@tcsc.edu.in',
    contactPhone: '+91-22-28461891',
  },
  'kc-college': {
    officialWebsite: 'https://www.kccollege.edu.in/',
    admissionLink: 'https://www.kccollege.edu.in/admissions/',
    accreditation: 'NAAC A',
    contactEmail: 'kccollege@kccollege.edu.in',
    contactPhone: '+91-22-22822290',
  },
  'kjs-college-of-science': {
    officialWebsite: 'https://kjsac.somaiya.edu.in/',
    admissionLink: 'https://kjsac.somaiya.edu.in/en/admission/',
    accreditation: 'NAAC A',
    contactEmail: 'info.kjsac@somaiya.edu',
    contactPhone: '+91-22-21025919',
  },
  'bhavans-college-andheri': {
    officialWebsite: 'https://www.bhavans.ac.in/',
    admissionLink: 'https://www.bhavans.ac.in/admissions',
    accreditation: 'NAAC A',
    contactEmail: 'principal@bhavans.ac.in',
    contactPhone: '+91-22-26256451',
  },
  'guru-nanak-college': {
    officialWebsite: 'https://www.gnkhalsa.edu.in/',
    admissionLink: 'https://www.gnkhalsa.edu.in/admission',
    accreditation: 'NAAC A',
    contactEmail: 'principal@gnkhalsa.edu.in',
    contactPhone: '+91-22-24096234',
  },
  'dr-bhanuben-nanavati': {
    officialWebsite: 'https://www.bncp.ac.in/',
    admissionLink: 'https://www.bncp.ac.in/admission',
    accreditation: 'NBA + NAAC',
    admissionMode: 'Merit + CET based as per Pharmacy Council norms',
    contactEmail: 'principal@bncp.ac.in',
    contactPhone: '+91-22-26231334',
  },
  'ismail-yusuf-college': {
    officialWebsite: 'https://ismailyusufcollege.edu.in/',
    admissionLink: 'https://ismailyusufcollege.edu.in/admission/',
    accreditation: 'Government Aided',
    contactEmail: 'iycprincipal@gmail.com',
    contactPhone: '+91-22-28323701',
  },
}

export function getCollegeDetailsBySlug(
  slug: string,
  name: string,
  courses: string[],
  location?: string
): CollegeDetails {
  const known = collegeDirectory[slug] ?? {}
  const searchQuery = encodeURIComponent(`${name} ${location ?? ''} official admission`)
  const fallbackAdmissionLink = `https://www.google.com/search?q=${searchQuery}`
  const locationHint = location ? ` | Campus: ${location}` : ''

  return {
    officialWebsite: known.officialWebsite ?? mumbaiUniversityAdmissionPortal,
    admissionLink: known.admissionLink ?? fallbackAdmissionLink,
    university: known.university ?? `University of Mumbai (affiliated/autonomous as applicable)${locationHint}`,
    accreditation: known.accreditation ?? 'NAAC / UGC recognized institution',
    admissionMode: known.admissionMode ?? 'Primarily merit based with program specific rules',
    contactEmail: known.contactEmail ?? 'admissions@college.edu',
    contactPhone: known.contactPhone ?? '+91-22-00000000',
    popularPrograms: known.popularPrograms ?? courses.slice(0, 4),
  }
}

export function getCollegeAdmissionLink(
  slug: string,
  name: string,
  location?: string
): string {
  const details = getCollegeDetailsBySlug(slug, name, [], location)
  return details.admissionLink
}
