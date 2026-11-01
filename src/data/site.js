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
  /** Set to the live '26 registration URL when published. `null` opens the status dialog. */
  registration: null,
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
 * Problem statements page (/problem-statements/).
 * Add entries here when the '26 briefs are ready; until then each domain on
 * the page shows a "releasing soon" placeholder. `domain` must match a
 * `domains[].name` above so the statement lands under the right heading.
 *
 * Example:
 *   { id: 'HLT-01', domain: 'Healthcare', title: 'Remote vitals triage',
 *     summary: 'One or two sentences describing the problem.',
 *     link: 'https://…/brief.pdf' }   // optional: full brief / PDF
 */
export const problemStatements = []

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
