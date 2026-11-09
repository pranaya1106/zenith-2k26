/**
 * ZENITH '26 — central content source.
 *
 * PROVENANCE
 * `official`          — taken from the supplied ZENITH '26 poster / brand assets.
 * `previous-edition`  — carried over from the ZENITH '25 website as mock content.
 *
 * Before launch, replace every `previous-edition` block with confirmed '26 details
 * and set `registration.url` / `problemStatements.url` once they are live.
 * The UI reads the `provisional` flags below to label those blocks honestly.
 */

export const event = {
  name: 'ZENITH',
  edition: "'26",
  year: '2026',
  theme: 'The AI Voyage',
  kind: 'National-level hackathon',
  organiser: 'SCOPE Club',
  organiserFull: 'SCOPE Club — School of Programming Excellence',
  institution: 'MLR Institute of Technology',
  institutionShort: 'MLRIT',
  city: 'Hyderabad',
  venue: 'MLR Institute of Technology, Dundigal, Hyderabad',
  // official — ZENITH '26 poster
  dates: {
    display: '17 — 19 Dec 2026',
    compact: '17—19 DEC ’26',
    startISO: '2026-12-17T09:00:00+05:30',
  },
  format: '2-day national hackathon + AWS Student Community Day',
  prizePool: '₹1.5 Lakh',
  fee: '₹499',
  collaborator: 'AWS Student Builder Group at MLRIT',
  stats: [
    { value: '03', label: 'Days' },
    { value: '03', label: 'Domains' },
    { value: '24', label: 'Hours' },
    { value: '01', label: 'Community Day' },
  ],
}

export const links = {
  /** Live '26 registration (Unstop). Every RegisterButton links here. */
  registration:
    'https://unstop.com/o/nVtipkH?lb=y8puo0h&utm_medium=Share&utm_source=online_coding_challenge&utm_campaign=Scopesco2995',
  /** Set to the live '26 problem statement URL when published. `null` opens the status dialog. */
  problemStatements: null,
  /** Genuine previous-edition destinations. */
  problemStatementsArchive: 'https://zenithps.vercel.app/',
  itineraryArchive: 'https://zenith-itinerary.vercel.app/',
  /**
   * Google Maps for the venue (MLRIT, Dundigal). A full google.com/maps URL
   * rather than the maps.app.goo.gl short link, which some networks and
   * blockers refuse to load. Works on desktop and opens the Maps app on phones.
   * Short link supplied: https://maps.app.goo.gl/KSZw5SexpNYxSbYD6
   */
  venueMap:
    'https://www.google.com/maps/search/?api=1&query=MLR+Institute+of+Technology%2C+Dundigal%2C+Hyderabad%2C+Telangana+500043',
  social: {
    instagram: 'https://www.instagram.com/mlrit_scope/',
    linkedin: 'https://www.linkedin.com/in/scope-club-mlrit-9017541a3/',
    x: 'https://x.com/MlritScope',
    github: 'https://github.com/scopeclub',
  },
}

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Domains', href: '#domains' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export const benefits = [
  {
    index: '01',
    title: 'Network',
    copy: 'Connect with industry experts and like-minded innovators during the AWS Student Community Day.',
  },
  {
    index: '02',
    title: 'Workshops',
    copy: 'Learn from expert speakers through hands-on sessions covering AI, ML, Cloud Computing, Data Engineering, and AWS.',
  },
  {
    index: '03',
    title: 'Prize Pool',
    copy: 'Compete with teams from across the country and win a share of the ₹1,50,000 prize pool.',
  },
  {
    index: '04',
    title: 'Recognition',
    copy: 'Earn certificates, showcase your technical skills, and add a valuable achievement to your portfolio.',
  },
]

export const about = {
  mission: [
    'ZENITH ’26 is a three-day national-level technology event organized by SCOPE Club, MLR Institute of Technology, in association with the AWS Student Builder Group. Featuring AWS Student Community Day and a 24-hour hackathon, the event brings together innovators to explore emerging technologies, collaborate, and build impactful solutions.',
    'ZENITH ’26 provides a platform for participants to explore emerging technologies, exchange ideas, and develop innovative solutions to real-world challenges.',
  ],
  objectives: [
    'Encourage innovation and problem-solving',
    'Build hands-on learning and skill development',
    'Promote collaboration and teamwork',
    'Foster competitive spirit and engagement',
    'Connect with industry experts and mentors',
    'Gain exposure to cutting-edge technologies',
  ],
}

export const domains = [
  {
    index: '01',
    name: 'AI for Healthcare',
    short: 'HLT',
    description:
      'Develop AI-powered solutions that strengthen healthcare delivery through improved patient care, effective wellness monitoring, and streamlined hospital management.',
    focus: ['Patient care', 'Wellness monitoring', 'Hospital management'],
    accent: 'pink',
  },
  {
    index: '02',
    name: 'AI for Education',
    short: 'EDU',
    description:
      'Design AI-powered solutions that enhance personalized learning, increase student engagement, and support virtual classrooms, assessment tools, and skill-building platforms.',
    focus: ['Personalised learning', 'Virtual classrooms', 'Assessment tools', 'Skill building'],
    accent: 'mint',
  },
  {
    index: '03',
    name: 'AI for Security',
    short: 'SEC',
    description:
      'Developing AI-powered solutions for cybersecurity, surveillance, threat detection, monitoring, and public safety.',
    focus: ['Cybersecurity', 'Surveillance', 'Threat detection', 'Public safety'],
    accent: 'purple',
  },
]

/**
 * Problem statements page (/problem-statements/), from the official
 * "Problem Statements for ZENITH’26" brief. `domain` must match a
 * `domains[].name` above so each statement lands under the right heading;
 * a domain with no entries shows a "releasing soon" placeholder.
 *
 * Fields: id, domain, title, summary (card teaser), description, objective,
 * optional `link` (full brief / PDF).
 */
export const problemStatements = [
  {
    id: 'PS-01',
    domain: 'AI for Healthcare',
    title: 'AI-assisted hospital coordination and patient flow',
    summary:
      'Prioritise patients, find the right bed across hospitals and cut waiting times at OPD, IPD and diagnostic labs.',
    description:
      'Arundhathi Hospital receives patients through its Outpatient Department (OPD) and Emergency Department. During high patient inflow, manual assessment and coordination can make it difficult to prioritize patients, identify suitable beds, and manage queues. Bed and specialized-facility availability changes continuously, while information across hospitals may be maintained independently. Patients may also experience long waits at OPD/IPD services and diagnostic labs when counters or processing stages are overloaded. The proposed system uses available vitals, symptoms, medical history, and test results to generate a severity and priority recommendation for clinical staff review. It matches care recommendations with local bed availability, queries participating hospitals when necessary, manages patient and lab queues, and presents live operational status and demand forecasts. Clinical decisions remain with qualified healthcare professionals.',
    objective:
      'To design and develop an AI-assisted healthcare coordination and hospital management platform that evaluates patient information, supports severity assessment, and recommends appropriate levels of care such as OPD, IPD, ICU, or specialized medical units based on patient requirements. The platform monitors real-time bed availability at Arundhathi Hospital and, when the required capacity is unavailable, connects with participating hospitals through an integrated Bed Availability API to identify suitable alternative facilities. It also streamlines patient flow by managing OPD consultations, IPD admissions, and diagnostic laboratory queues, reducing waiting times and improving resource allocation. Additionally, AI-driven analytics, centralized operational dashboards, and short-term patient demand forecasting help hospital administrators monitor resource utilization, plan staffing requirements, and make informed operational decisions, ultimately improving coordination and efficiency across healthcare facilities.',
  },
  {
    id: 'PS-02',
    domain: 'AI for Education',
    title: 'AI-native code comprehension assessment platform',
    summary:
      'Evaluate how candidates understand code and collaborate with AI, not just whether the final code passes.',
    description:
      "For years, technical hiring focused on solving algorithmic problems in a blank editor under time pressure. However, the AI era has transformed software development, making code generation easier while increasing the importance of asking the right questions, evaluating AI-generated solutions, and identifying incorrect suggestions. Companies like Google and Meta have begun experimenting with AI-assisted interviews focused on understanding and debugging unfamiliar code. Yet most assessment platforms still evaluate only the final output, overlooking how candidates reach a solution. Two candidates may submit the same working fix, but one may carefully prompt, evaluate, and verify the AI's response, while the other blindly accepts generated code. Traditional scoreboards treat them equally, creating a major evaluation gap that fails to distinguish genuine engineering ability from AI dependency or recognize effective AI-assisted problem-solving.",
    objective:
      'The objective is to build an AI-native code comprehension assessment platform that evaluates how candidates understand code and collaborate with AI, rather than simply checking whether the final code passes. Candidates work in a time-bound browser workspace containing real-world projects with seeded bugs, inefficient logic, and performance issues, supported by a codebase-aware AI Coding Agent that provides explanations, hints, and suggested fixes without directly revealing solutions. Every prompt, AI response, token consumption, and code change is tracked by an AI Usage Analyzer to measure AI contribution, suggestion acceptance, and tokens consumed per bug fixed. An Evaluation Engine verifies submissions against seeded solutions, while a Reasoning Agent generates evidence-based scores for debugging, prompt engineering, coding skills, and AI dependence. A Behavioral Flagger identifies patterns such as blind pasting, over-reliance on AI, strong verification, and independent debugging. Finally, a transparent leaderboard presents dimension-wise scores, helping evaluators distinguish genuine engineering ability from AI-generated results.',
  },
  {
    id: 'PS-03',
    domain: 'AI for Security',
    title: 'AI-powered campus-wide security surveillance',
    summary:
      'Turn existing CCTV into real-time threat detection with instant, timestamped alerts and video evidence.',
    // NOTE: the latest PDF repeats Statement 2's hiring text here. This is the
    // campus-security description from the earlier brief, which matches the objective.
    description:
      'Ensuring safety and security across large college campuses has become increasingly challenging due to the presence of multiple buildings, classrooms, laboratories, hostels, playgrounds, and entry and exit points. Traditional CCTV surveillance systems primarily rely on manual observation by security personnel, making it difficult to continuously oversee multiple camera feeds and identify security violations in real time. Incidents such as physical altercations, unauthorized entry, wall climbing or jumping, restricted-area access, suspicious movements, and other potentially dangerous activities may go unnoticed or be reported only after significant delays. The absence of an intelligent, centralized surveillance mechanism also makes incident identification, evidence collection, and timely response difficult. Therefore, there is a need for an AI-powered, campus-wide security surveillance system that integrates with existing CCTV infrastructure, uses computer vision and deep learning techniques to automatically detect potential security threats, and generates instant alerts with timestamps and visual evidence. Such a system would enable security personnel and college administrators to oversee multiple campus locations efficiently, respond quickly to potential incidents, maintain incident records, and improve the overall safety and security of students, faculty, and staff.',
    objective:
      'The objective is to develop an AI-powered, campus-wide security surveillance system that integrates with existing CCTV infrastructure to enable intelligent, real-time monitoring across college premises, including classrooms, laboratories, hostels, corridors, playgrounds, parking areas, and entrances. Using computer vision and deep learning, the system detects potential threats and suspicious activities such as physical altercations, unauthorized entry, wall climbing, restricted-area access, and unsafe behavior. It processes live video streams to identify violations and generate instant, timestamped alerts with relevant video evidence for timely intervention. A centralized dashboard provides real-time notifications, incident tracking, and secure event storage, reducing dependence on manual CCTV monitoring while improving threat detection, response efficiency, and overall campus safety.',
  },
]

export const timeline = {
  provisional: false,
  sourceLabel: 'ZENITH ’26 schedule',
  note: 'The ZENITH ’26 run of show: AWS Student Community Day followed by the 24-hour hackathon, 17—19 December.',
  items: [
    {
      date: 'Dec 17',
      year: '’26',
      title: 'AWS Student Community Day',
      copy: 'Gain insights from industry experts, attend interactive sessions, and build valuable professional connections.',
    },
    {
      date: 'Dec 18',
      year: '’26',
      title: 'Hackathon kickoff',
      copy: 'The 24-hour coding challenge officially begins. Teams start building innovative solutions.',
    },
    {
      date: 'Dec 19',
      year: '’26',
      title: 'Final presentations',
      copy: 'Teams showcase their projects and present their solutions to the judging panel.',
    },
    {
      date: 'Dec 19',
      year: '’26',
      title: 'Winners announced',
      copy: 'Celebrate innovation and recognize outstanding teams with a share of the ₹1,50,000 prize pool.',
    },
  ],
}

export const speakers = {
  provisional: true,
  note: 'The ZENITH ’26 lineup is being finalised. The profiles below speak from the previous edition.',
  people: [
    {
      name: 'Nagababu Medicharla',
      role: 'Principal Cloud Architect | AWS Ambassador | AWS Community Builder',
      linkedin: 'https://www.linkedin.com/in/nagababu-medicharla-b2a91a117/',
      photo: '/assets/speakers/nagababu-medicharla.jpg',
      accent: 'purple',
    },
    {
      name: 'Raghu Reddy',
      role: 'Lead Data Platform Engineer @ Razor Group | Ex- ZScaler | Cloud Native Organizers | AWS Community Builder | Platform Engineer | MLOps | GitOps | CKA Certified | Terraform Certified | AWS | 3X Azure | Speaker',
      linkedin: 'https://www.linkedin.com/in/raghureddycloud',
      photo: '/assets/speakers/raghu-reddy.jpg',
      accent: 'mint',
    },
    {
      name: 'Varsha Verma',
      role: 'AWS Community Builder | 11K+ LinkedIn | Tech Speaker | Lead Cloud Engineer | AWS | LINUX | DEVOPS | Terraform | DevOps Community Lead at TWS | Blogger | Public Speaker | Tech influencer',
      linkedin: 'https://www.linkedin.com/in/varsha-verma-cloud-devops',
      photo: '/assets/speakers/varsha-verma.jpg',
      accent: 'pink',
    },
    {
      name: 'Satyajit Samantray',
      role: 'Principal Cloud Architect at Searce | AWS Community Builder | AWS Ambassador | Public Speaker | 7*AWS | 1*AZURE | 1*GCP | CKA certified | Terraform | Linux | Hadoop | Helping Customers adopt Cloud',
      linkedin: 'https://www.linkedin.com/in/satyajit-samantray-b30a7075',
      photo: '/assets/speakers/satyajit-samantray.jpg',
      accent: 'purple',
    },
    {
      name: 'Vishnu Rachapudi',
      role: 'Works at @SUDO | AWS Community Builder | 12x AWS Certified | K[CNA,CSA] | Your Friendly Neighbourhood Cloud Guy',
      linkedin: 'https://www.linkedin.com/in/vishnu-rachapudi-28956920b',
      photo: '/assets/speakers/vishnu-rachapudi.jpg',
      accent: 'mint',
    },
    {
      name: 'Avinash Reddy Thipparthi',
      role: 'Aviz Academy | 8x AWS Certified | AWS Community Builder | Docker Captain',
      linkedin: 'https://www.linkedin.com/in/avizway',
      photo: '/assets/speakers/avinash-reddy-thipparthi.jpg',
      accent: 'pink',
    },
  ],
}

/**
 * Sponsors by tier. Each tier lists `slots` placeholder cards until real
 * sponsors are added to `sponsors`: { name, logo: '/assets/sponsors/x.webp', url }.
 */
export const sponsors = {
  tiers: [
    { name: 'Title Sponsor', size: 'title', slots: 1, sponsors: [] },
    { name: 'Associate Sponsors', size: 'associate', slots: 2, sponsors: [] },
    { name: 'Partners', size: 'partner', slots: 4, sponsors: [] },
  ],
}

export const faqs = [
  {
    q: 'What are the hackathon domains?',
    a: 'The hackathon covers three domains: AI for Healthcare, AI for Education and AI for Security.',
  },
  {
    q: 'What is the structure of the event?',
    a: 'It is a 3-day event that includes workshops and competitions conducted simultaneously.',
  },
  {
    q: 'What tools and technologies can I use?',
    a: 'Participants can use any programming languages, frameworks or tools. AI-generated code is allowed, but you must understand its implementation.',
  },
  {
    q: 'Do I need a team to participate?',
    a: 'You can participate individually or as part of a team with up to four members. If you don’t have a team, we’ll help you form one at the venue.',
  },
  {
    q: 'Will food or refreshments be provided?',
    a: 'Yes, refreshments will be provided for all participants during the event hours.',
  },
  {
    q: 'How will the projects be evaluated?',
    a: 'Projects will be evaluated based on innovation, technical implementation, user experience, feasibility and presentation.',
  },
]

export const contact = {
  email: 'scopeclub@mlrinstitutions.ac.in',
  people: [
    { name: 'Ravindher', phone: '+91 70327 93341', tel: '+917032793341' },
    { name: 'Triveni', phone: '+91 96763 14810', tel: '+919676314810' },
  ],
  address: {
    line1: 'SCOPE Club — MT003',
    line2: 'MLR Institute of Technology',
    line3: 'Dundigal, Hyderabad',
    line4: 'Telangana, India — 500043',
  },
}
