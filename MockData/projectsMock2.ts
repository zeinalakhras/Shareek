import { UserApiResponse, UserProfileData } from '@/types/user';
import { ApiResponse, RecommendedProjectDTO, ProjectSummaryDTO } from '../types/types';
import { ProjectDraft } from '@/types/project';

export const CURRENT_TEST_USER_ID = 'usr_me_123';

export const mockRecommendedProjectsResponse: ApiResponse<{ items: RecommendedProjectDTO[] }> = {
  status: "success",
  code: "SUCCESS",
  message: "Recommendations retrieved successfully",
  data: {
    items: [
      {
        id: "prj_rec_101",
        name: "Smart Learning Platform",
        description: "An interactive e-learning platform. We are looking for frontend developers to complete our MVP.",
        status: "active",
        visibility: "public",
        work_type: "remote",
        duration: "medium",
        is_university_project: true,
        image_url: null,
        owner: {
          id: "usr_8f2k19ab",
          full_name: "Ahmed Mohamed",
          profile_image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        members: [
          { id: "usr_8f2k19ab", full_name: "Ahmed Mohamed", role_title: "Project Lead", profile_image: "https://randomuser.me/api/portraits/men/32.jpg" },
          { id: "usr_mem_101", full_name: "Tariq Aziz", role_title: "Backend Engineer", profile_image: "https://randomuser.me/api/portraits/men/50.jpg" }
        ],
        stars_count: 156,
        members_count: 4,
        open_roles: [
          {
            id: "role_101_1",
            title: "Frontend Developer (React)",
            description: "Build interactive e-learning components and responsive user interfaces.",
            commitment_type: "Part-time",
            requirements: [
              "Strong experience with React & TypeScript",
              "Proficiency in Tailwind CSS & state management",
              "Ability to integrate REST APIs"
            ]
          },
          {
            id: "role_101_2",
            title: "UI/UX Designer",
            description: "Design intuitive user flows and high-fidelity wireframes for student portals.",
            commitment_type: "Volunteer",
            requirements: [
              "Proficiency in Figma and interactive prototyping",
              "Understanding of design systems and accessibility standards"
            ]
          }
        ],
        created_at: "2026-05-10T08:00:00Z",
        match_score: 0.95,
        matching_skills: ["skl_reactjs", "skl_tailwind"]
      },
      {
        id: "prj_rec_102",
        name: "LocalMarket App",
        description: "Connecting local artisans with buyers. Backend architecture is ready, need mobile devs.",
        status: "active",
        visibility: "public",
        work_type: "hybrid",
        duration: "long",
        is_university_project: false,
        image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
        owner: {
          id: "usr_99x77a",
          full_name: "Sara Ali",
          profile_image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        members: [
          { id: "usr_99x77a", full_name: "Sara Ali", role_title: "Product Owner", profile_image: "https://randomuser.me/api/portraits/women/44.jpg" },
          { id: "usr_mem_102", full_name: "Rami Omar", role_title: "UI Designer", profile_image: null }
        ],
        stars_count: 89,
        members_count: 3,
        open_roles: [
          {
            id: "role_102_1",
            title: "React Native Developer",
            description: "Develop cross-platform mobile interfaces for marketplace features.",
            commitment_type: "Part-time",
            requirements: [
              "Hands-on experience with React Native and Expo",
              "Knowledge of NativeWind / Tailwind CSS",
              "Experience handling mobile navigation & state"
            ]
          },
          {
            id: "role_102_2",
            title: "QA Tester",
            description: "Ensure smooth functionality and conduct testing across iOS and Android.",
            commitment_type: "Volunteer",
            requirements: [
              "Experience with mobile app manual testing",
              "Good bug reporting and tracking skills"
            ]
          }
        ],
        created_at: "2026-04-18T11:20:00Z",
        match_score: 0.88,
        matching_skills: ["skl_react_native", "skl_expo"]
      },
      {
        id: "prj_rec_103",
        name: "FitTrack Companion",
        description: "A community-driven health and workout tracker integrating smartwatch telemetry.",
        status: "insufficientPartners",
        visibility: "public",
        work_type: "remote",
        duration: "short",
        is_university_project: false,
        image_url: null,
        owner: {
          id: "usr_77b81c",
          full_name: "Kareem Hassan",
          profile_image: "https://randomuser.me/api/portraits/men/65.jpg"
        },
        members: [
          { id: "usr_77b81c", full_name: "Kareem Hassan", role_title: "Lead Architect", profile_image: "https://randomuser.me/api/portraits/men/65.jpg" }
        ],
        stars_count: 210,
        members_count: 2,
        open_roles: [
          {
            id: "role_103_1",
            title: "Mobile Engineer",
            description: "Integrate smartwatch health telemetry into real-time mobile dashboards.",
            commitment_type: "Part-time",
            requirements: [
              "Experience in cross-platform mobile development",
              "Familiarity with HealthKit / Google Fit SDKs"
            ]
          },
          {
            id: "role_103_2",
            title: "Backend Developer (Node.js)",
            description: "Architect high-performance endpoints for telemetry data aggregation.",
            commitment_type: "Equity",
            requirements: [
              "Proficiency in Node.js, Express, and TypeScript",
              "Experience with database architecture"
            ]
          }
        ],
        created_at: "2026-06-01T14:00:00Z",
        match_score: 0.79,
        matching_skills: ["skl_typescript", "skl_tailwind"]
      },
      {
        id: "prj_rec_104",
        name: "AI Code Reviewer",
        description: "Developer tool providing real-time static code analysis and smart refactoring suggestions.",
        status: "active",
        visibility: "public",
        work_type: "remote",
        duration: "medium",
        is_university_project: true,
        image_url: null,
        owner: {
          id: "usr_44m21p",
          full_name: "Nour El-Din",
          profile_image: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        members: [
          { id: "usr_44m21p", full_name: "Nour El-Din", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/12.jpg" },
          { id: "usr_mem_104", full_name: "Hala Mahmoud", role_title: "Fullstack Developer", profile_image: "https://randomuser.me/api/portraits/women/28.jpg" }
        ],
        stars_count: 312,
        members_count: 5,
        open_roles: [
          {
            id: "role_104_1",
            title: "Python Developer",
            description: "Implement static code analysis algorithms and AST parsing pipelines.",
            commitment_type: "Part-time",
            requirements: [
              "Strong background in Python and FastAPI",
              "Familiarity with static code analysis tools"
            ]
          },
          {
            id: "role_104_2",
            title: "DevOps Engineer",
            description: "Manage deployment pipelines and containerize code analysis workloads.",
            commitment_type: "Volunteer",
            requirements: [
              "Experience with Docker and CI/CD pipelines",
              "Cloud deployment knowledge"
            ]
          }
        ],
        created_at: "2026-03-25T09:30:00Z",
        match_score: 0.65,
        matching_skills: ["skl_python", "skl_fastapi"]
      }
    ]
  }
};

export const mockAllProjectsResponse: ApiResponse<{ items: ProjectSummaryDTO[] }> = {
  status: "success",
  code: "SUCCESS",
  message: "Projects retrieved successfully",
  data: {
    items: [
      {
        id: "prj_complete_1",
        name: "E-Commerce Suite",
        description: "A fully functional microservices-based e-commerce platform with live tracking and cross-platform mobile apps.",
        status: "completed",
        visibility: "public",
        work_type: "remote",
        duration: "long",
        is_university_project: false,
        image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
        github_url: "https://github.com/example/ecommerce-suite",
        website_url: "https://ecommerce-suite-demo.com",
        owner: {
          id: "usr_owner1",
          full_name: "Omar Khaled",
          profile_image: null
        },
        members: [
          { id: "usr_owner1", full_name: "Omar Khaled", role_title: "Project Lead", profile_image: null },
          { id: "usr_44m21p", full_name: "Nour El-Din", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/12.jpg" },
          { id: "usr_mem_104", full_name: "Hala Mahmoud", role_title: "Fullstack Developer", profile_image: "https://randomuser.me/api/portraits/women/28.jpg" }
        ],
        stars_count: 245,
        members_count: 6,
        created_at: "2026-01-10T08:00:00Z"
      },
      {
        id: "prj_complete_2",
        name: "AI-Powered Resume Builder",
        description: "An intelligent platform that helps users build ATS-friendly resumes with real-time AI suggestions and custom tracking.",
        status: "completed",
        visibility: "public",
        work_type: "hybrid",
        duration: "medium",
        is_university_project: true,
        image_url: null,
        github_url: "https://github.com/example/ai-resume-builder",
        website_url: "https://ai-resume-builder.app",
        owner: {
          id: "usr_owner2",
          full_name: "Sara Ahmad",
          profile_image: "https://randomuser.me/api/portraits/women/12.jpg"
        },
        members: [
          { id: "usr_owner2", full_name: "Sara Ahmad", role_title: "Project Lead", profile_image: "https://randomuser.me/api/portraits/women/12.jpg" },
          { id: "usr_44m21p", full_name: "Nour El-Din", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/12.jpg" },
          { id: "usr_mem_104", full_name: "Hala Mahmoud", role_title: "Fullstack Developer", profile_image: "https://randomuser.me/api/portraits/women/28.jpg" }
        ],
        stars_count: 189,
        members_count: 3,
        created_at: "2026-02-15T10:30:00Z"
      },
      {
        id: "prj_complete_3",
        name: "DevHub Community Portal",
        description: "A specialized networking platform built for developers to share articles, host hackathons, and find open-source collaborators.",
        status: "blocked",
        visibility: "public",
        work_type: "remote",
        duration: "long",
        is_university_project: false,
        image_url: null,
        owner: {
          id: "usr_owner3",
          full_name: "Zaid Mustafa",
          profile_image: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        members: [
          { id: "usr_owner3", full_name: "Zaid Mustafa", role_title: "Project Lead", profile_image: "https://randomuser.me/api/portraits/men/45.jpg" },
          { id: "usr_44m21p", full_name: "Nour El-Din", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/12.jpg" },
          { id: "usr_mem_104", full_name: "Hala Mahmoud", role_title: "Fullstack Developer", profile_image: "https://randomuser.me/api/portraits/women/28.jpg" }
        ],
        stars_count: 412,
        members_count: 8,
        created_at: "2025-11-20T14:00:00Z"
      },
      {
        id: "prj_complete_5",
        name: "TaskFlow Kanban Board",
        description: "A fast, collaborative project management tool featuring real-time synchronization, drag-and-drop tasks, and analytics dashboards.",
        status: "insufficientPartners",
        visibility: "public",
        work_type: "remote",
        duration: "medium",
        is_university_project: true,
        image_url: null,
        owner: {
          id: "usr_owner5",
          full_name: "Hamza Nour",
          profile_image: "https://randomuser.me/api/portraits/men/62.jpg"
        },
        open_roles: [
          {
            id: "role_comp5_1",
            title: "Backend Engineer (Node.js)",
            description: "Develop real-time web socket sync for task management boards.",
            commitment_type: "Equity",
            requirements: [
              "Node.js, Express, and WebSocket / Socket.io",
              "PostgreSQL database management"
            ]
          },
          {
            id: "role_comp5_2",
            title: "DevOps Specialist",
            description: "Set up real-time server infrastructure and monitoring dashboards.",
            commitment_type: "Part-time",
            requirements: [
              "Docker and serverless architectures",
              "Performance optimization"
            ]
          }
        ],
        members: [
          { id: "usr_owner5", full_name: "Hamza Nour", role_title: "Project Lead", profile_image: "https://randomuser.me/api/portraits/men/62.jpg" }
        ],
        stars_count: 320,
        members_count: 4,
        created_at: "2026-01-25T16:45:00Z"
      },
      {
        id: "prj_my_active_owner",
        name: "EcoTracker App",
        description: "We are building a React Native app to help users track their daily carbon footprint through automated purchase analysis and manual logging.",
        status: "completed",
        visibility: "public",
        work_type: "remote",
        duration: "medium",
        is_university_project: true,
        image_url: null,
        github_url: "https://github.com/example/ecotracker-app",
        website_url: "https://ecotracker.dev",
        owner: {
          id: CURRENT_TEST_USER_ID,
          full_name: "My Account",
          profile_image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        members: [
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Project Lead" },
          { id: "usr_member_1", full_name: "Elena Rodriguez", role_title: "Product Owner" },
          { id: "usr_member_2", full_name: "Alex Johnson", role_title: "Backend Lead" }
        ],
        stars_count: 54,
        members_count: 3,
        created_at: "2026-04-01T10:00:00Z"
      },
      {
        id: "prj_my_banned_owner",
        name: "Crypto Automated Bot",
        description: "High-frequency trading bot interface for crypto exchanges.",
        status: "blocked",
        visibility: "public",
        work_type: "remote",
        duration: "short",
        is_university_project: false,
        image_url: null,
        owner: {
          id: CURRENT_TEST_USER_ID,
          full_name: "My Account",
          profile_image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        members: [
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Owner" }
        ],
        stars_count: 12,
        members_count: 1,
        created_at: "2026-02-01T08:00:00Z"
      },

      // =============================================================
      // 🚀 MVP PROJECTS REPLACING OLD ACTIVE PROJECTS
      // =============================================================
      {
        id: "prj_rec_101",
        name: "SkillSwap Network",
        description: "A peer-to-peer skill exchange platform for developers and designers to swap practical expertise and build real portfolio projects.",
        status: "RECRUITING",
        visibility: "public",
        work_type: "remote",
        duration: "4 Months",
        is_university_project: true,
        image_url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        owner: {
          id: "usr_44m21p",
          full_name: "Zaid Al-Ali",
          profile_image: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        tags: ["React Native", "Expo", "Node.js"],
        stars_count: 48,
        members_count: 2,
        members: [
          { id: "usr_44m21p", full_name: "Zaid Al-Ali", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/22.jpg" },
          { id: "usr_mem_801", full_name: "Mona Hassan", role_title: "Backend Developer", profile_image: "https://randomuser.me/api/portraits/women/33.jpg" }
        ],
        open_roles: [
          { id: "role_mobile_1", title: "Mobile UI Designer", isRequired: true, requiredCount: 1, filledCount: 0, skills: ["Figma", "Tailwind"] },
          { id: "role_dev_1", title: "Fullstack Dev", isRequired: false, requiredCount: 1, filledCount: 0, skills: ["GraphQL", "TypeScript"] }
        ],
        created_at: "2026-09-12T08:30:00Z"
      },
      {
        id: "prj_test_rec_owner_1",
        name: "My Next Big SaaS App",
        description: "A specialized project created by me currently in recruitment mode seeking UI designers and backend developers.",
        status: "RECRUITING",
        visibility: "public",
        work_type: "remote",
        duration: "3 Months",
        is_university_project: false,
        image_url: "https://cdn-icons-png.flaticon.com/512/1086/1086741.png",
        owner: {
          id: CURRENT_TEST_USER_ID,
          full_name: "My Account",
          profile_image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        tags: ["React Native", "Tailwind", "Supabase"],
        stars_count: 15,
        members_count: 1,
        members: [
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/1.jpg" }
        ],
        open_roles: [
          { id: "role_my_1", title: "UI/UX Designer", isRequired: true, requiredCount: 1, filledCount: 0, skills: ["Figma"] },
          { id: "role_my_2", title: "Backend Engineer", isRequired: true, requiredCount: 1, filledCount: 0, skills: ["Node.js", "PostgreSQL"] }
        ],
        created_at: "2026-09-20T10:00:00Z"
      },
      {
        id: "prj_test_rec_member_2",
        name: "DevPortfolio Showcase",
        description: "Open source showcase network for developer portfolios. I joined as a frontend developer.",
        status: "RECRUITING",
        visibility: "public",
        work_type: "remote",
        duration: "2 Months",
        is_university_project: false,
        image_url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        owner: {
          id: "usr_owner_dev",
          full_name: "Youssef Nabil",
          profile_image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        tags: ["Next.js", "TypeScript", "Tailwind"],
        stars_count: 34,
        members_count: 2,
        members: [
          { id: "usr_owner_dev", full_name: "Youssef Nabil", role_title: "Product Manager", profile_image: "https://randomuser.me/api/portraits/men/32.jpg" },
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "React Native Dev", profile_image: "https://randomuser.me/api/portraits/men/1.jpg" }
        ],
        open_roles: [
          { id: "role_dev_rec_1", title: "Backend Developer", isRequired: true, requiredCount: 1, filledCount: 0, skills: ["NestJS"] }
        ],
        created_at: "2026-09-18T11:00:00Z"
      },
      {
        id: "prj_test_prep_owner_3",
        name: "Campus Event Tracker",
        description: "My project in preparation phase with all roles filled and preparing for active execution window.",
        status: "PREPARATION",
        visibility: "public",
        work_type: "hybrid",
        duration: "4 Months",
        is_university_project: true,
        image_url: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
        owner: {
          id: CURRENT_TEST_USER_ID,
          full_name: "My Account",
          profile_image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        tags: ["Expo", "Firebase", "React"],
        stars_count: 88,
        members_count: 3,
        prep_ends_at: "2026-10-10T12:00:00Z",
        manual_start_window_ends_at: "2026-10-13T12:00:00Z",
        members: [
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Project Creator", profile_image: "https://randomuser.me/api/portraits/men/1.jpg" },
          { id: "usr_mem_prep1", full_name: "Huda Al-Masri", role_title: "UI Designer", profile_image: "https://randomuser.me/api/portraits/women/12.jpg" },
          { id: "usr_mem_prep2", full_name: "Khaled Samer", role_title: "Backend Dev", profile_image: "https://randomuser.me/api/portraits/men/14.jpg" }
        ],
        open_roles: [],
        created_at: "2026-09-08T09:30:00Z"
      },
      {
        id: "prj_test_prep_member_4",
        name: "Smart Campus Shuttle",
        description: "Live tracking system for university bus transport. Currently preparing for active launch.",
        status: "PREPARATION",
        visibility: "public",
        work_type: "hybrid",
        duration: "4 Months",
        is_university_project: true,
        image_url: "https://cdn-icons-png.flaticon.com/512/2830/2830305.png",
        owner: {
          id: "usr_owner_bus",
          full_name: "Samer Al-Otaibi",
          profile_image: "https://randomuser.me/api/portraits/men/40.jpg"
        },
        tags: ["React Native", "Google Maps API", "Express"],
        stars_count: 62,
        members_count: 3,
        prep_ends_at: "2026-10-05T12:00:00Z",
        manual_start_window_ends_at: "2026-10-08T12:00:00Z",
        members: [
          { id: "usr_owner_bus", full_name: "Samer Al-Otaibi", role_title: "Team Lead", profile_image: "https://randomuser.me/api/portraits/men/40.jpg" },
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Mobile Lead Developer", profile_image: "https://randomuser.me/api/portraits/men/1.jpg" },
          { id: "usr_mem_bus2", full_name: "Lila Kassam", role_title: "UI Designer", profile_image: "https://randomuser.me/api/portraits/women/20.jpg" }
        ],
        open_roles: [],
        created_at: "2026-09-05T09:00:00Z"
      },
      {
        id: "prj_test_act_owner_5",
        name: "AI Study Buddy",
        description: "Active development stage! Mobile app providing student quiz generators and automated flashcard creation.",
        status: "IN_PROGRESS",
        visibility: "public",
        work_type: "remote",
        duration: "6 Months",
        is_university_project: true,
        image_url: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
        owner: {
          id: CURRENT_TEST_USER_ID,
          full_name: "My Account",
          profile_image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        tags: ["Expo", "Python", "FastAPI", "OpenAI"],
        stars_count: 210,
        members_count: 3,
        members: [
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Project Lead & Mobile Dev", profile_image: "https://randomuser.me/api/portraits/men/1.jpg" },
          { id: "usr_mem_buddy1", full_name: "Wael Nader", role_title: "AI Specialist", profile_image: "https://randomuser.me/api/portraits/men/60.jpg" },
          { id: "usr_mem_buddy2", full_name: "Nouran Ali", role_title: "Frontend Developer", profile_image: "https://randomuser.me/api/portraits/women/45.jpg" }
        ],
        open_roles: [],
        created_at: "2026-07-01T15:00:00Z"
      },
      {
        id: "prj_test_act_member_6",
        name: "Smart Task Orchestrator",
        description: "Workflow automation app currently in active sprint execution phase.",
        status: "IN_PROGRESS",
        visibility: "public",
        work_type: "remote",
        duration: "5 Months",
        is_university_project: false,
        image_url: "https://cdn-icons-png.flaticon.com/512/1598/1598191.png",
        owner: {
          id: "usr_owner_task",
          full_name: "Omar Sharif",
          profile_image: "https://randomuser.me/api/portraits/men/72.jpg"
        },
        tags: ["React Native", "Redux", "Node.js"],
        stars_count: 145,
        members_count: 3,
        members: [
          { id: "usr_owner_task", full_name: "Omar Sharif", role_title: "Product Manager", profile_image: "https://randomuser.me/api/portraits/men/72.jpg" },
          { id: CURRENT_TEST_USER_ID, full_name: "My Account", role_title: "Mobile Lead", profile_image: "https://randomuser.me/api/portraits/men/1.jpg" },
          { id: "usr_mem_task1", full_name: "Salma Eid", role_title: "Backend Dev", profile_image: "https://randomuser.me/api/portraits/women/25.jpg" }
        ],
        open_roles: [],
        created_at: "2026-07-10T10:00:00Z"
      }
    ]
  }
};

type NotificationType = 'support' | 'request' | 'match' | 'review';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  time: string;
  description: string;
  clickableText?: string;
}

export const notifications: NotificationItem[] = [
  {
    id: '1',
    type: 'support',
    title: 'Support team',
    time: '3m ago',
    description: 'Congrats! Your account has been officially verified.',
  },
  {
    id: '2',
    type: 'request',
    title: 'Request to join',
    time: '1h ago',
    description: 'Nasser Kamali sent an application to join the "LocalMarket" project. ',
    clickableText: 'Click here to view Nasser\'s profile',
  },
  {
    id: '3',
    type: 'match',
    title: 'New Project Match: Smart Home Dashboard',
    time: '2h ago',
    description: 'A new opportunity aligns perfectly with your skill set in UX and IoT systems.',
  },
  {
    id: '4',
    type: 'review',
    title: 'Review Completed',
    time: 'Yesterday',
    description: 'Your collaboration on the \'Green City\' project was rated 5 stars.',
  },
];

export const MOCK_APPLICATIONS_RESPONSE = {
  status: 'success',
  code: 'SUCCESS',
  message: 'Your applications retrieved successfully',
  data: {
    items: [
      {
        id: 'app_7q2w5e',
        project: {
          id: 'prj_91jd7lmq',
          name: 'Smart Learning Platform',
        },
        role: {
          id: 'rol_frontend',
          name: 'Frontend Developer',
        },
        status: 'pending',
        message: 'I am very excited to work on this project...',
        created_at: '2026-04-30T12:40:00Z',
        updated_at: '2026-04-30T12:40:00Z',
      },
      {
        id: 'app_9m3k2l',
        project: {
          id: 'prj_xyz789',
          name: 'Project Management App',
        },
        role: {
          id: 'rol_backend',
          name: 'Backend Developer',
        },
        status: 'accepted',
        message: null,
        created_at: '2026-04-25T09:15:00Z',
        updated_at: '2026-04-26T11:00:00Z',
      },
      {
        id: 'app_5k8p2v',
        project: {
          id: 'prj_abc456',
          name: 'E-Commerce Mobile App',
        },
        role: {
          id: 'rol_uiux',
          name: 'UI/UX Designer',
        },
        status: 'rejected',
        message: 'Thank you for your interest, but we have selected another candidate for this role.',
        created_at: '2026-04-20T14:30:00Z',
        updated_at: '2026-04-22T10:00:00Z',
      },
      {
        "id": "app_rec_101_pending",
        "project": {
          "id": "prj_rec_101",
          "name": "Smart Learning Platform"
        },
        "role": {
          "id": "role_101_1",
          "name": "Frontend Developer (React)"
        },
        "status": "pending",
        "message": "Hi, I have solid experience with React, TypeScript, and Tailwind CSS. I would love to contribute to completing your MVP!",
        "created_at": "2026-05-11T10:15:00Z",
        "updated_at": "2026-05-11T10:15:00Z"
      },
    ],
    pagination: {
      page: 1,
      per_page: 10,
      total_items: 2,
      total_pages: 1,
      has_next: false,
      has_prev: false,
    },
  },
};


export const MOCK_USERS_DATABASE: Record<string, UserProfileData> = {
  // --- المستخدمون الأساسيون ---
  "1299001": {
    id: "1299001",
    full_name: "Nasser Kamali",
    email: "nasser.kamali@example.com",
    phone_number: "+201012345678",
    location: "Cairo, Egypt",
    is_verified: true,
    telegram_username: "@nasser_kamali",
    bio: "CS Junior at Cairo University. Passionate about UI/UX and React Native. Building things for the future🚀",
    profile_image: "https://randomuser.me/api/portraits/women/44.jpg",
    is_student: true,
    university: { id: "uni_cairo", name: "Cairo University" },
    major: "Computer Science",
    study_year: 3,
    collaboration_style: "hybrid",
    time_commitment: "10-20 hours/week",
    project_duration: "long-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_react", name: "React" },
      { id: "skl_figma", name: "Figma" },
      { id: "skl_python", name: "Python" },
      { id: "skl_ts", name: "TypeScript" }
    ],
    roles: [
      { id: "rol_uiux", name: "UI/UX Designer" },
      { id: "rol_frontend", name: "Frontend Developer" }
    ],
    stats: { stars_received: 128, projects_count: 6, collaborations_count: 12 },
    created_at: "2026-01-15T08:00:00Z",
    completed_projects: ["prj_my_active_owner"]
  },
  "usr_8f2k19ab": {
    id: "usr_8f2k19ab",
    full_name: "Ahmed Mohamed",
    email: "ahmed.mohamed@example.com",
    phone_number: "+201023456789",
    location: "Cairo, Egypt",
    is_verified: false,
    telegram_username: null,
    bio: "Web application developer passionate about modern JS frameworks.",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    is_student: true,
    university: { id: "uni_cairo", name: "Cairo University" },
    major: "Computer Science",
    study_year: 3,
    collaboration_style: "remote",
    time_commitment: "10-20 hours/week",
    project_duration: "short-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_reactjs", name: "React.js" },
      { id: "skl_nodejs", name: "Node.js" }
    ],
    roles: [{ id: "rol_frontend", name: "Frontend Developer" }],
    stats: { stars_received: 44, projects_count: 9, collaborations_count: 17 },
    created_at: "2026-04-20T10:30:00Z",
    completed_projects: []
  },

  // --- أصحاب المشاريع (Project Owners) ---
  "usr_owner1": {
    id: "usr_owner1",
    full_name: "Omar Khaled",
    email: "omar.khaled@example.com",
    phone_number: "+201034567890",
    location: "Alexandria, Egypt",
    is_verified: true,
    telegram_username: "@omar_khaled",
    bio: "Senior Solutions Architect & Microservices Specialist.",
    profile_image: "https://randomuser.me/api/portraits/men/11.jpg",
    is_student: false,
    university: null,
    major: "Software Engineering",
    study_year: 0,
    collaboration_style: "remote",
    time_commitment: "full-time",
    project_duration: "long-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_micro", name: "Microservices" },
      { id: "skl_docker", name: "Docker" }
    ],
    roles: [{ id: "rol_arch", name: "Solutions Architect" }],
    stats: { stars_received: 245, projects_count: 12, collaborations_count: 30 },
    created_at: "2025-08-10T10:00:00Z",
    completed_projects: ["prj_complete_1"]
  },
  "usr_owner2": {
    id: "usr_owner2",
    full_name: "Sara Ahmad",
    email: "sara.ahmad@example.com",
    phone_number: "+201045678901",
    location: "Giza, Egypt",
    is_verified: true,
    telegram_username: "@sara_ahmad",
    bio: "AI researcher focusing on NLP and smart resume parsing algorithms.",
    profile_image: "https://randomuser.me/api/portraits/women/12.jpg",
    is_student: true,
    university: { id: "uni_cairo", name: "Cairo University" },
    major: "Artificial Intelligence",
    study_year: 4,
    collaboration_style: "hybrid",
    time_commitment: "5-10 hours/week",
    project_duration: "short-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_py", name: "Python" },
      { id: "skl_nlp", name: "NLP" }
    ],
    roles: [{ id: "rol_ai", name: "AI Engineer" }],
    stats: { stars_received: 189, projects_count: 4, collaborations_count: 9 },
    created_at: "2026-01-12T11:00:00Z",
    completed_projects: ["prj_complete_2"]
  },
  "usr_owner3": {
    id: "usr_owner3",
    full_name: "Zaid Mustafa",
    email: "zaid.mustafa@example.com",
    phone_number: "+962791234567",
    location: "Amman, Jordan",
    is_verified: true,
    telegram_username: "@zaid_mustafa",
    bio: "DevRel and Community Builder. Founder of DevHub Portal.",
    profile_image: "https://randomuser.me/api/portraits/men/45.jpg",
    is_student: false,
    university: null,
    major: "Computer Systems",
    study_year: 0,
    collaboration_style: "remote",
    time_commitment: "full-time",
    project_duration: "long-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_comm", name: "Community Management" },
      { id: "skl_devrel", name: "DevRel" }
    ],
    roles: [{ id: "rol_lead", name: "Community Lead" }],
    stats: { stars_received: 412, projects_count: 15, collaborations_count: 45 },
    created_at: "2025-05-01T09:00:00Z",
    completed_projects: []
  },
  "usr_owner4": {
    id: "usr_owner4",
    full_name: "Laila Hasan",
    email: "laila.hasan@example.com",
    phone_number: "+963912345678",
    location: "Damascus, Syria",
    is_verified: false,
    telegram_username: null,
    bio: "Fintech Product Manager and mobile finance advocate.",
    profile_image: "https://randomuser.me/api/portraits/women/24.jpg",
    is_student: true,
    university: { id: "uni_damascus", name: "Damascus University" },
    major: "Information Systems",
    study_year: 3,
    collaboration_style: "on_site",
    time_commitment: "10-20 hours/week",
    project_duration: "short-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_fin", name: "Financial Modeling" },
      { id: "skl_pm", name: "Product Management" }
    ],
    roles: [{ id: "rol_pm", name: "Product Manager" }],
    stats: { stars_received: 95, projects_count: 3, collaborations_count: 7 },
    created_at: "2026-02-01T14:00:00Z",
    completed_projects: []
  },
  "usr_owner5": {
    id: "usr_owner5",
    full_name: "Hamza Nour",
    email: "hamza.nour@example.com",
    phone_number: "+201056789012",
    location: "Cairo, Egypt",
    is_verified: true,
    telegram_username: "@hamza_nour",
    bio: "Real-time systems enthusiast & Productivity tools creator.",
    profile_image: "https://randomuser.me/api/portraits/men/62.jpg",
    is_student: true,
    university: { id: "uni_cairo", name: "Cairo University" },
    major: "Computer Engineering",
    study_year: 4,
    collaboration_style: "remote",
    time_commitment: "10-20 hours/week",
    project_duration: "long-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_ws", name: "WebSockets" },
      { id: "skl_node", name: "Node.js" }
    ],
    roles: [{ id: "rol_back", name: "Backend Engineer" }],
    stats: { stars_received: 320, projects_count: 8, collaborations_count: 19 },
    created_at: "2025-10-15T16:00:00Z",
    completed_projects: []
  },

  // --- أطراف وأعضاء المشاريع (Members) ---
  "usr_member_1": {
    id: "usr_member_1",
    full_name: "Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    phone_number: "+201067890123",
    location: "Cairo, Egypt",
    is_verified: false,
    telegram_username: null,
    bio: "Product Owner focusing on eco-friendly technology and agile workflow.",
    profile_image: "https://randomuser.me/api/portraits/women/32.jpg",
    is_student: true,
    university: { id: "uni_cairo", name: "Cairo University" },
    major: "Information Systems",
    study_year: 4,
    collaboration_style: "remote",
    time_commitment: "5-10 hours/week",
    project_duration: "short-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_agile", name: "Agile" },
      { id: "skl_jira", name: "Jira" }
    ],
    roles: [{ id: "rol_po", name: "Product Owner" }],
    stats: { stars_received: 94, projects_count: 5, collaborations_count: 11 },
    created_at: "2026-02-10T09:00:00Z",
    completed_projects: ["prj_my_active_owner"]
  },
  "usr_member_2": {
    id: "usr_member_2",
    full_name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone_number: "+201078901234",
    location: "Cairo, Egypt",
    is_verified: true,
    telegram_username: "@alex_johnson",
    bio: "Backend Lead specializing in Python, Docker, and Redis architectures.",
    profile_image: "https://randomuser.me/api/portraits/men/22.jpg",
    is_student: false,
    university: { id: "uni_cairo", name: "Cairo University" },
    major: "Computer Engineering",
    study_year: 3,
    collaboration_style: "remote",
    time_commitment: "10-20 hours/week",
    project_duration: "long-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_py", name: "Python" },
      { id: "skl_dock", name: "Docker" }
    ],
    roles: [{ id: "rol_backend", name: "Backend Lead" }],
    stats: { stars_received: 68, projects_count: 4, collaborations_count: 8 },
    created_at: "2026-02-18T14:30:00Z",
    completed_projects: ["prj_my_active_owner"]
  },
  "usr_owner_elena": {
    id: "usr_owner_elena",
    full_name: "Elena Rodriguez",
    email: "elena.sy@example.com",
    phone_number: "+963923456789",
    location: "Damascus, Syria",
    is_verified: true,
    telegram_username: "@elena_rodriguez",
    bio: "AR Developer & Campus Navigation Project Lead.",
    profile_image: "https://randomuser.me/api/portraits/women/32.jpg",
    is_student: true,
    university: { id: "uni_damascus", name: "Damascus University" },
    major: "Software Engineering",
    study_year: 4,
    collaboration_style: "hybrid",
    time_commitment: "10-20 hours/week",
    project_duration: "long-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_unity", name: "Unity 3D" },
      { id: "skl_ar", name: "ARKit / ARCore" }
    ],
    roles: [{ id: "rol_lead", name: "Project Lead" }],
    stats: { stars_received: 120, projects_count: 7, collaborations_count: 15 },
    created_at: "2026-01-05T11:20:00Z",
    completed_projects: []
  },
  "usr_owner_elena2": {
    id: "usr_owner_elena2",
    full_name: "Osla Watkins",
    email: "osla.watkins@example.com",
    phone_number: "+201089012345",
    location: "Cairo, Egypt",
    is_verified: false,
    telegram_username: null,
    bio: "UI & UX Designer crafting mobile interactions and micro-animations.",
    profile_image: "https://randomuser.me/api/portraits/women/65.jpg",
    is_student: true,
    university: { id: "uni_cairo", name: "Cairo University" },
    major: "Digital Design",
    study_year: 2,
    collaboration_style: "remote",
    time_commitment: "5-10 hours/week",
    project_duration: "short-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_figma", name: "Figma" },
      { id: "skl_ui", name: "UI Design" }
    ],
    roles: [{ id: "rol_uiux", name: "UI & UX Designer" }],
    stats: { stars_received: 52, projects_count: 3, collaborations_count: 6 },
    created_at: "2026-03-01T10:15:00Z",
    completed_projects: []
  },
  "usr_member_10": {
    id: "usr_member_10",
    full_name: "Sami Mansour",
    email: "sami.mansour@example.com",
    phone_number: "+963934567890",
    location: "Damascus, Syria",
    is_verified: true,
    telegram_username: "@sami_mansour",
    bio: "Node.js & Express API Developer.",
    profile_image: "https://randomuser.me/api/portraits/men/78.jpg",
    is_student: true,
    university: { id: "uni_damascus", name: "Damascus University" },
    major: "IT Engineering",
    study_year: 3,
    collaboration_style: "remote",
    time_commitment: "10-20 hours/week",
    project_duration: "short-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_node", name: "Node.js" },
      { id: "skl_exp", name: "Express" }
    ],
    roles: [{ id: "rol_back", name: "Backend Engineer" }],
    stats: { stars_received: 76, projects_count: 5, collaborations_count: 9 },
    created_at: "2026-03-15T08:45:00Z",
    completed_projects: []
  },
  "usr_44m21p": {
    id: "usr_44m21p",
    full_name: "Nour El-Din",
    email: "nour.eldin@example.com",
    phone_number: "+201090123456",
    location: "Cairo, Egypt",
    is_verified: true,
    telegram_username: "@nour_eldin",
    bio: "Project Creator & Tech Strategist passionate about building scalable microservices and cross-platform apps.",
    profile_image: "https://randomuser.me/api/portraits/men/12.jpg",
    is_student: true,
    university: {
      id: "uni_cairo",
      name: "Cairo University"
    },
    major: "Software Engineering",
    study_year: 4,
    collaboration_style: "remote",
    time_commitment: "10-20 hours/week",
    project_duration: "long-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_proj_mgmt", name: "Project Management" },
      { id: "skl_react_native", name: "React Native" },
      { id: "skl_arch", name: "System Architecture" }
    ],
    roles: [
      { id: "rol_creator", name: "Project Creator" }
    ],
    stats: {
      stars_received: 180,
      projects_count: 6,
      collaborations_count: 14
    },
    created_at: "2026-01-15T10:00:00Z",
    completed_projects: ["prj_complete_1", "prj_complete_2"]
  },
  "usr_mem_104": {
    id: "usr_mem_104",
    full_name: "Hala Mahmoud",
    email: "hala.mahmoud@example.com",
    phone_number: "+963945678901",
    location: "Damascus, Syria",
    is_verified: false,
    telegram_username: null,
    bio: "Fullstack Developer specialized in Node.js, React, and PostgreSQL database management.",
    profile_image: "https://randomuser.me/api/portraits/women/28.jpg",
    is_student: true,
    university: {
      id: "uni_damascus",
      name: "Damascus University"
    },
    major: "IT Engineering",
    study_year: 3,
    collaboration_style: "hybrid",
    time_commitment: "5-10 hours/week",
    project_duration: "short-term",
    github_url: "https://github.com/default",
    linkedin_url: "https://linkedin.com/in/default-dev",
    website_url: "https://default-portfolio.dev",
    skills: [
      { id: "skl_node", name: "Node.js" },
      { id: "skl_react", name: "React" },
      { id: "skl_postgres", name: "PostgreSQL" }
    ],
    roles: [
      { id: "rol_fullstack", name: "Fullstack Developer" }
    ],
    stats: {
      stars_received: 115,
      projects_count: 4,
      collaborations_count: 9
    },
    created_at: "2026-02-01T12:00:00Z",
    completed_projects: ["prj_complete_1", "prj_complete_2"]
  }
};

export const getMockUserProfileResponse = (userId: string) => {
  // البحث عن المستخدم باستخدام الـ ID الممرر
  const foundUser = MOCK_USERS_DATABASE[userId];

  // إذا لم يجد الـ ID يرجع مستخدماً افتراضياً للسلامة
  const userData = foundUser || MOCK_USERS_DATABASE["1299001"];

  return {
    status: 200,
    message: "User profile fetched successfully",
    data: userData,
  };
};



export const MOCK_DRAFTS: ProjectDraft[] = [
  {
    id: "prj_draft_1",
    name: "Unified Library Management System",
    description: "A platform to streamline book borrowing across faculties using QR codes. Core details and open roles are currently being drafted.",
    status: "draft",
    work_type: "hybrid",
    tags: ["React Native", "Node.js", "QR Code"],
    owner: {
      id: "1299001",
      full_name: "Nasser Kamali",
      profile_image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    duration: "medium",
    is_university_project: true,
    image_url: null,
    open_roles: [
      {
        id: "role_1",
        title: "Frontend Developer",
        skills: ["React Native", "Tailwind CSS"],
        description: "Build interactive e-learning components and responsive user interfaces.",
        commitment_type: "Part-time",
        requirements: [
          "Strong experience with React & TypeScript",
          "Proficiency in Tailwind CSS & state management",
          "Ability to integrate REST APIs"
        ]
      }
    ],
    created_at: "2026-09-10T12:00:00Z",
    updated_at: "2026-09-18T15:30:00Z"
  },
  {
    id: "prj_draft_2",
    name: "Smart Resume Parser",
    description: "An AI application designed to parse resumes, automatically extract key skills, and match candidate profiles to relevant projects.",
    status: "draft",
    work_type: "remote",
    tags: ["Python", "FastAPI", "NLP"],
    owner: {
      id: "1299001",
      full_name: "Nasser Kamali",
      profile_image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    duration: "short",
    is_university_project: false,
    image_url: null,
    open_roles: [],
    created_at: "2026-09-15T09:15:00Z",
    updated_at: "2026-09-20T10:00:00Z"
  },
  {
    id: "prj_draft_3",
    name: "Untitled Project",
    description: "Draft created without description yet...",
    status: "draft",
    work_type: "remote",
    tags: [],
    owner: {
      id: "1299001",
      full_name: "Nasser Kamali",
      profile_image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    duration: "short",
    is_university_project: true,
    image_url: null,
    open_roles: [],
    created_at: "2026-09-21T08:00:00Z",
    updated_at: "2026-09-21T08:00:00Z"
  }
];

