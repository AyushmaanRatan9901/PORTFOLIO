import { Briefcase, Building2, CalendarDays, Code2, Users } from "lucide-react";

export const profile = {
  name: "Ayushmaan Ratan",
  role: "Full Stack & React Native Developer",
  location: "Meerut, Uttar Pradesh",
  phone: "+91 7983212577",
  email: "ayushmaanratan9901@gmail.com",
  linkedin: "https://www.linkedin.com/in/ayushmaan-ratan",
  github: "https://github.com/AyushmaanRatan9901",
  leetcode: "https://leetcode.com/",
  resume: "/Ayushmaan_Ratan_Resume.pdf",

  summary:
    "Passionate Full Stack and React Native Developer with hands-on experience building scalable mobile and web applications using React Native, React.js, Node.js, Express.js, MongoDB, MySQL, and Supabase. Skilled in REST APIs, Socket.IO, Firebase, Cloudinary, authentication systems, and modern UI development. Passionate about building high-performance, user-centric applications.",

  skills: [
    {
      category: "Mobile & Frontend",
      items: ["React Native", "React.js", "Expo", "Tailwind CSS"],
    },
    {
      category: "Languages",
      items: ["Java", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
    },
    {
      category: "Backend & APIs",
      items: ["Node.js", "Express.js", "REST APIs", "Socket.IO", "JWT"],
    },
    {
      category: "Databases & ORM/ODM",
      items: ["MongoDB", "MySQL", "Mongoose", "Supabase"],
    },
    {
      category: "Cloud & Services",
      items: ["Firebase", "Supabase", "Cloudinary"],
    },
    {
      category: "Tools",
      items: ["Git", "GitHub", "VS Code", "Postman"],
    },
  ],

  projects: [
    {
      name: "Avorix Reality - Real Estate ERP Platform",
      concept: "Real Estate ERP & Multi-Role Dashboards",
      year: "2026",
      role: "Full Stack Developer",
      description:
        "Developed a full-stack Real Estate ERP platform enabling users to buy, sell, and rent residential and commercial properties through a secure, scalable application. Designed and implemented six role-based dashboards for Customer, Seller, Broker, Builder, Home Loan Partner, and Super Admin, supporting property management, listing approvals, inquiries, loan processing, analytics, and complete administrative control.",
      technologies: [
        "React Native",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "REST APIs",
      ],
      github: "https://github.com/AyushmaanRatan9901",
      liveUrl: "#",
      media: [
        {
          type: "image",
          src: "https://placehold.co/390x844/1a1a1a/e5c158?text=Avorix+ERP+Home",
        },
        {
          type: "image",
          src: "https://placehold.co/390x844/1a1a1a/e5c158?text=Dashboards",
        },
        {
          type: "image",
          src: "https://placehold.co/390x844/1a1a1a/e5c158?text=Property+Listing",
        },
      ],
    },
    {
      name: "AI Image Generator App",
      concept: "Generative AI & Cloud Media",
      year: "2026",
      role: "Full Stack Developer",
      description:
        "Built a full-stack AI Image Generator application with secure JWT authentication, multi-session chat support, and AI-powered image generation. Integrated Cloudinary for image storage and gallery management while developing REST APIs for authentication, image generation history, and user management.",
      technologies: [
        "React Native",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JWT",
        "Cloudinary",
      ],
      github: "https://github.com/AyushmaanRatan9901",
      liveUrl: "#",
      media: [
        {
          type: "image",
          src: "https://placehold.co/390x844/1a1a1a/e5c158?text=AI+Generator",
        },
        {
          type: "image",
          src: "https://placehold.co/390x844/1a1a1a/e5c158?text=Cloudinary+Gallery",
        },
      ],
    },
    {
      name: "Expense Tracker App",
      concept: "Personal Finance & Firebase",
      year: "2025",
      role: "React Native Developer",
      description:
        "Developed a cross-platform Expense Tracker application with Firebase Authentication, allowing users to securely manage their personal financial records. Implemented complete CRUD operations for income and expense transactions, real-time data synchronization, category-wise tracking, and an intuitive mobile user interface.",
      technologies: [
        "React Native",
        "TypeScript",
        "Firebase",
        "JavaScript",
      ],
      github: "https://github.com/AyushmaanRatan9901",
      liveUrl: "#",
      media: [
        {
          type: "image",
          src: "https://placehold.co/390x844/1a1a1a/e5c158?text=Expense+Home",
        },
        {
          type: "image",
          src: "https://placehold.co/390x844/1a1a1a/e5c158?text=Analytics",
        },
      ],
    },
  ],

  stats: [
    { icon: Briefcase, label: "Internships", value: "5", color: "violet" },
    { icon: Building2, label: "Companies", value: "5", color: "amber" },
    {
      icon: CalendarDays,
      label: "Years Journey",
      value: "2+",
      color: "emerald",
    },
    { icon: Code2, label: "Projects Delivered", value: "10+", color: "sky" },
  ],

  experience: [
    {
      role: "React Native Developer Intern",
      company: "SuperWebs360",
      date: "Jun 2026 – Present",
      badge: "Internship",
      icon: Briefcase,
      color: "violet",
      points: [
        "Developing production React Native mobile applications.",
        "Building user interfaces, integrating APIs, and optimizing app performance.",
      ],
    },
    {
      role: "Mobile and Web Developer Intern",
      company: "Deckoviz Space Labs",
      date: "Apr 2026 – July 2026",
      badge: "Internship",
      icon: Code2,
      color: "sky",
      points: [
        "Worked on cross-platform mobile and web application development.",
        "Integrated RESTful APIs, state management, and modern component architecture.",
      ],
    },
    {
      role: "Scrum Master Intern",
      company: "The Entrepreneurship Network",
      date: "Mar 2026 – June 2026",
      badge: "Internship",
      icon: Users,
      color: "amber",
      points: [
        "Facilitated agile ceremonies, sprint planning, and team coordination.",
        "Improved team productivity, backlog grooming, and project delivery timeline.",
      ],
    },
    {
      role: "Application Development Intern",
      company: "Codec Technologies",
      date: "Mar 2026 – Apr 2026",
      badge: "Internship",
      icon: Briefcase,
      color: "emerald",
      points: [
        "Worked on real-world projects using React Native and Node.js.",
        "Built scalable mobile application modules and integrated backend REST APIs.",
      ],
    },
    {
      role: "Android App Development Intern",
      company: "Hex Softwares",
      date: "Mar 2026 – Apr 2026",
      badge: "Internship",
      icon: Code2,
      color: "rose",
      points: [
        "Developed Android application features and user interface components.",
        "Collaborated on mobile feature implementation and bug fixing.",
      ],
    },
  ],

  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      college: "United College of Engineering and Research",
      duration: "Aug 2022 – May 2026",
      score: "CGPA / Percentage: 78.99% (Greater Noida, UP)",
    },
    {
      degree: "Intermediate (Class XII)",
      college: "The Avenue Public School",
      duration: "2020 – 2022",
      score: "79.20% (Meerut, UP)",
    },
    {
      degree: "High School (Class X)",
      college: "The Avenue Public School",
      duration: "2020",
      score: "66.66% (Meerut, UP)",
    },
  ],

  coursework: [
    "Data Structures & Algorithms",
    "Operating Systems",
    "DBMS",
    "Object-Oriented Programming",
  ],

  certifications: [
    { name: "React Native Essential Training - Certificate", link: "#" },
    { name: "Deloitte Australia - Technology Virtual Experience (Forage)", link: "#" },
    { name: "Internet of Things (IoT) Project: Fire-Fighting Robot", link: "#" },
    { name: "Microsoft Excel (Microsoft 365) - Certificate", link: "#" },
  ],

  achievements: [
    "Developed Avorix Reality - a multi-role Real Estate ERP platform with 6 dedicated dashboards.",
    "Built AI Image Generator app with secure JWT auth & Cloudinary integration.",
    "Completed 5 technical internships across React Native, Mobile & Full Stack application development.",
  ],

  languages: ["English", "Hindi"],
};
