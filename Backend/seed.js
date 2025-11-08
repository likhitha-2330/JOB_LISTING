/**
 * Professional Job Portal Seed File
 * Creates realistic job listing data with detailed profiles and relationships
 * 
 * Creates: 10 job seekers, 8 employers, 20 jobs, 25+ applications
 * Usage: node seed.js
 * Password for all accounts: password123
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const SeekerProfile = require('./models/SeekerProfile');

async function run() {
  try {
    // Connect to database
    if (typeof connectDB === 'function') {
      await connectDB();
    } else if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/joblisting');
      console.log('MongoDB connected (fallback)');
    } else {
      console.log('MongoDB connected');
    }

    console.log('🗑️  Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      SeekerProfile.deleteMany({})
    ]);

    console.log('👥 Creating users...');
    const password = await bcrypt.hash('password123', 10);

    // Create Employers first (without company reference)
    const employers = await User.create([
      {
        name: 'Sarah Chen',
        email: 'hr@techcorp.com',
        password,
        role: 'employer'
      },
      {
        name: 'Michael Rodriguez',
        email: 'jobs@innovatelab.com',
        password,
        role: 'employer'
      },
      {
        name: 'Jennifer Williams',
        email: 'careers@globaldynamics.com',
        password,
        role: 'employer'
      },
      {
        name: 'David Park',
        email: 'talent@designhub.com',
        password,
        role: 'employer'
      },
      {
        name: 'Emily Thompson',
        email: 'hiring@datavision.com',
        password,
        role: 'employer'
      },
      {
        name: 'Robert Kim',
        email: 'recruit@cloudscale.com',
        password,
        role: 'employer'
      },
      {
        name: 'Lisa Anderson',
        email: 'jobs@fintech.com',
        password,
        role: 'employer'
      },
      {
        name: 'James Wilson',
        email: 'careers@healthplus.com',
        password,
        role: 'employer'
      }
    ]);

    console.log('🏢 Creating company profiles...');
    const companies = await Company.create([
      {
        user: employers[0]._id,
        name: 'TechCorp Solutions',
        website: 'https://techcorp.com',
        description: 'Leading technology solutions provider specializing in cloud computing, AI, and enterprise software. We serve Fortune 500 companies worldwide with cutting-edge technology solutions.',
        industry: 'Technology',
        size: '501-1000',
        headquarters: { city: 'San Francisco', state: 'CA' }
      },
      {
        user: employers[1]._id,
        name: 'InnovateLab Inc',
        website: 'https://innovatelab.com',
        description: 'Fast-growing startup building the next generation of mobile and web applications. Backed by top VCs with $50M Series B funding. Join us in disrupting the tech industry!',
        industry: 'Technology',
        size: '51-200',
        headquarters: { city: 'Austin', state: 'TX' }
      },
      {
        user: employers[2]._id,
        name: 'Global Dynamics',
        website: 'https://globaldynamics.com',
        description: 'Fortune 500 consulting firm with 50+ years of excellence. We help enterprises navigate digital transformation, optimize operations, and drive sustainable growth.',
        industry: 'Operations',
        size: '1000+',
        headquarters: { city: 'New York', state: 'NY' }
      },
      {
        user: employers[3]._id,
        name: 'DesignHub Studio',
        website: 'https://designhub.com',
        description: 'Award-winning design agency creating beautiful, user-centered digital experiences. Our portfolio includes work for Apple, Nike, and Disney. Winner of 15+ design awards.',
        industry: 'Design',
        size: '11-50',
        headquarters: { city: 'Los Angeles', state: 'CA' }
      },
      {
        user: employers[4]._id,
        name: 'DataVision Analytics',
        website: 'https://datavision.com',
        description: 'Data analytics and AI platform trusted by 500+ enterprises. We turn data into actionable insights using advanced machine learning and predictive analytics.',
        industry: 'Technology',
        size: '201-500',
        headquarters: { city: 'Seattle', state: 'WA' }
      },
      {
        user: employers[5]._id,
        name: 'CloudScale Systems',
        website: 'https://cloudscale.com',
        description: 'Cloud infrastructure and DevOps solutions provider. We help companies scale their infrastructure with Kubernetes, Terraform, and modern CI/CD practices.',
        industry: 'Technology',
        size: '51-200',
        headquarters: { city: 'Boston', state: 'MA' }
      },
      {
        user: employers[6]._id,
        name: 'FinTech Solutions',
        website: 'https://fintech.com',
        description: 'Leading financial technology company revolutionizing banking and payments. Our platform processes $10B+ in transactions annually for millions of users.',
        industry: 'Finance',
        size: '201-500',
        headquarters: { city: 'Chicago', state: 'IL' }
      },
      {
        user: employers[7]._id,
        name: 'HealthPlus Medical',
        website: 'https://healthplus.com',
        description: 'Healthcare technology company improving patient outcomes through innovative software solutions. HIPAA compliant platform serving 200+ hospitals nationwide.',
        industry: 'Healthcare',
        size: '51-200',
        headquarters: { city: 'Atlanta', state: 'GA' }
      }
    ]);

    // Update employers with company reference
    for (let i = 0; i < employers.length; i++) {
      employers[i].company = companies[i]._id;
      await employers[i].save();
    }

    // Create Job Seekers
    const seekers = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Carol Davis',
        email: 'carol.davis@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Daniel Martinez',
        email: 'daniel.martinez@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Frank Brown',
        email: 'frank.brown@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Grace Lee',
        email: 'grace.lee@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Henry Taylor',
        email: 'henry.taylor@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Isabella Garcia',
        email: 'isabella.garcia@email.com',
        password,
        role: 'seeker'
      },
      {
        name: 'Jack Chen',
        email: 'jack.chen@email.com',
        password,
        role: 'seeker'
      }
    ]);

    console.log('📝 Creating seeker profiles...');
    const seekerProfiles = await SeekerProfile.create([
      {
        user: seekers[0]._id,
        headline: 'Senior Frontend Developer',
        bio: 'Passionate frontend developer with 6+ years of experience building scalable web applications with React and modern JavaScript. Specialized in creating responsive, accessible, and performant user interfaces. Led frontend teams at multiple startups.',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Git', 'Redux', 'TailwindCSS'],
        experience: [
          {
            title: 'Senior Frontend Developer',
            company: 'Tech Startup Inc',
            location: 'San Francisco, CA',
            startDate: new Date('2021-01-01'),
            currentlyWorking: true,
            description: 'Leading frontend architecture decisions and mentoring junior developers. Built responsive web applications using React and TypeScript.'
          },
          {
            title: 'Frontend Developer',
            company: 'Digital Agency',
            location: 'San Francisco, CA',
            startDate: new Date('2018-06-01'),
            endDate: new Date('2020-12-31'),
            description: 'Developed client websites and web applications. Worked with React, Vue.js, and modern CSS frameworks.'
          }
        ],
        education: [
          {
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-05-01'),
            description: 'Focused on web development and software engineering. GPA: 3.8/4.0'
          }
        ],
        availability: 'immediate',
        desiredJobTypes: ['full-time', 'remote'],
        openToRelocate: true,
        portfolioUrl: 'https://alice-portfolio.com',
        resumeUrl: 'https://example.com/alice-resume.pdf'
      },
      {
        user: seekers[1]._id,
        headline: 'Full Stack Engineer',
        bio: 'Experienced full-stack developer specializing in Python, Django, and React. Love building APIs and solving complex problems.',
        location: 'Austin, TX',
        skills: ['Python', 'Django', 'React', 'PostgreSQL', 'AWS', 'Docker']
      },
      {
        user: seekers[2]._id,
        headline: 'Mobile App Developer',
        bio: 'React Native specialist with a passion for creating beautiful mobile experiences.',
        location: 'Seattle, WA',
        skills: ['React Native', 'JavaScript', 'Swift', 'Kotlin', 'Mobile Development']
      },
      {
        user: seekers[3]._id,
        headline: 'Management Consultant',
        bio: 'Strategic consultant with MBA and 8 years experience in digital transformation.',
        location: 'New York, NY',
        skills: ['Strategy', 'Business Analysis', 'Project Management', 'Digital Transformation']
      },
      {
        user: seekers[4]._id,
        headline: 'Product Designer',
        bio: 'UX/UI designer focused on user-centered design and creating delightful experiences.',
        location: 'Los Angeles, CA',
        skills: ['Figma', 'UI/UX Design', 'User Research', 'Prototyping', 'Design Systems']
      },
      {
        user: seekers[5]._id,
        headline: 'Data Scientist',
        bio: 'PhD in Statistics with expertise in machine learning and predictive modeling.',
        location: 'Boston, MA',
        skills: ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Analysis']
      },
      {
        user: seekers[6]._id,
        headline: 'DevOps Engineer',
        bio: 'Cloud infrastructure expert specializing in Kubernetes and CI/CD automation.',
        location: 'Seattle, WA',
        skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'DevOps']
      },
      {
        user: seekers[7]._id,
        headline: 'Junior Software Engineer',
        bio: 'Recent CS graduate from MIT eager to contribute and learn. Strong foundation in algorithms and data structures.',
        location: 'Cambridge, MA',
        skills: ['JavaScript', 'Java', 'Python', 'React', 'Node.js', 'Git'],
        availability: '2 weeks',
        desiredJobTypes: ['full-time']
      },
      {
        user: seekers[8]._id,
        headline: 'Marketing Manager',
        bio: 'Digital marketing expert with 7 years driving growth through SEO, SEM, content marketing, and social media. Increased revenue by 300% at previous company. MBA from Stanford.',
        location: 'Chicago, IL',
        skills: ['Digital Marketing', 'SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'Email Marketing'],
        availability: 'immediate',
        desiredJobTypes: ['full-time', 'contract']
      },
      {
        user: seekers[9]._id,
        headline: 'Healthcare Software Engineer',
        bio: 'Software engineer specializing in healthcare technology with HIPAA compliance expertise. Built EMR systems used by 50+ hospitals. Passionate about improving patient care through technology.',
        location: 'Atlanta, GA',
        skills: ['Java', 'Spring Boot', 'HIPAA', 'Healthcare IT', 'SQL', 'REST APIs'],
        availability: 'negotiable',
        desiredJobTypes: ['full-time']
      }
    ]);

    console.log('💼 Creating job postings...');
    const jobs = await Job.create([
      // TechCorp Solutions Jobs
      {
        title: 'Senior Frontend Developer',
        description: '<p>We are looking for an experienced Senior Frontend Developer to join our engineering team. You will build scalable, responsive web applications using React, TypeScript, and modern JavaScript.</p><h3>Responsibilities:</h3><ul><li>Lead frontend architecture and technical decisions</li><li>Mentor junior developers and conduct code reviews</li><li>Build reusable components and optimize performance</li><li>Collaborate with designers and backend engineers</li></ul><h3>Requirements:</h3><ul><li>5+ years of frontend development experience</li><li>Expert knowledge of React, TypeScript, and modern CSS</li><li>Experience with state management (Redux, Context API)</li><li>Strong understanding of web performance optimization</li></ul>',
        employer: employers[0]._id,
        company: companies[0]._id,
        location: { city: 'San Francisco', state: 'CA', region: 'West Coast' },
        salary: 145000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 5, max: 10, level: 'Senior' }
      },
      {
        title: 'Backend Engineer - Python',
        description: '<p>Design and develop scalable backend systems powering millions of users. Work with Python, Django, PostgreSQL, and modern cloud infrastructure.</p><h3>Responsibilities:</h3><ul><li>Build RESTful APIs and microservices</li><li>Optimize database performance and queries</li><li>Implement caching strategies (Redis, Memcached)</li><li>Deploy and monitor services on AWS</li></ul><h3>Requirements:</h3><ul><li>3+ years Python development experience</li><li>Strong knowledge of Django/Flask and PostgreSQL</li><li>Experience with AWS (EC2, RDS, S3, Lambda)</li><li>Understanding of REST API design principles</li></ul><h3>Nice to Have:</h3><ul><li>Experience with Docker and Kubernetes</li><li>Knowledge of message queues (RabbitMQ, Kafka)</li><li>Familiarity with GraphQL</li></ul>',
        employer: employers[0]._id,
        company: companies[0]._id,
        location: { city: 'San Francisco', state: 'CA', region: 'West Coast' },
        salary: 150000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 3, max: 7, level: 'Mid' }
      },
      {
        title: 'Mobile App Developer (iOS/Android)',
        description: '<p>Build beautiful, high-performance mobile applications used by thousands of users daily. Work with React Native or native iOS/Android technologies.</p><h3>Responsibilities:</h3><ul><li>Develop mobile apps for iOS and Android</li><li>Implement new features and optimize performance</li><li>Integrate with REST APIs and third-party services</li><li>Collaborate with designers and product managers</li></ul><h3>Requirements:</h3><ul><li>2+ years mobile development experience</li><li>Proficiency in React Native OR native (Swift/Kotlin)</li><li>Experience with mobile app deployment (App Store/Play Store)</li><li>Strong understanding of mobile UI/UX principles</li></ul>',
        employer: employers[1]._id,
        company: companies[1]._id,
        location: { city: 'Austin', state: 'TX', region: 'Central' },
        salary: 120000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 2, max: 5, level: 'Mid' }
      },
      {
        title: 'Full Stack Engineer (Remote)',
        description: '<p>Work across the entire technology stack in a fast-paced startup environment. Build products that matter with cutting-edge technologies.</p><h3>Responsibilities:</h3><ul><li>Develop features end-to-end (frontend + backend)</li><li>Build RESTful APIs with Node.js/Express</li><li>Create responsive UIs with React</li><li>Design and optimize MongoDB schemas</li><li>Participate in architecture decisions</li></ul><h3>Requirements:</h3><ul><li>3+ years full-stack development experience</li><li>Strong proficiency in JavaScript/TypeScript</li><li>Experience with MERN stack (MongoDB, Express, React, Node.js)</li><li>Excellent problem-solving skills</li></ul><h3>Perks:</h3><ul><li>100% Remote - Work from anywhere</li><li>Flexible hours</li><li>Stock options</li><li>Unlimited PTO</li></ul>',
        employer: employers[1]._id,
        company: companies[1]._id,
        location: { city: 'Remote', state: '', region: 'Remote' },
        salary: 115000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 3, max: 6, level: 'Mid' }
      },
      {
        title: 'Senior Management Consultant',
        description: 'Lead strategic initiatives for Fortune 500 clients. Drive digital transformation and operational excellence across industries.',
        employer: employers[2]._id,
        company: companies[2]._id,
        location: { city: 'New York', state: 'NY', region: 'East Coast' },
        salary: 160000,
        type: 'Full-time',
        category: 'Operations',
        status: 'active',
        experience: { min: 7, max: 12, level: 'Senior' }
      },
      {
        title: 'Business Analyst',
        description: 'Analyze business processes, gather requirements, and support project delivery for enterprise clients.',
        employer: employers[2]._id,
        company: companies[2]._id,
        location: { city: 'New York', state: 'NY', region: 'East Coast' },
        salary: 95000,
        type: 'Full-time',
        category: 'Operations',
        status: 'active',
        experience: { min: 2, max: 5, level: 'Mid' }
      },
      {
        title: 'UX/UI Designer',
        description: 'Create stunning user interfaces and delightful experiences. Work with cross-functional teams on high-profile projects.',
        employer: employers[3]._id,
        company: companies[3]._id,
        location: { city: 'Los Angeles', state: 'CA', region: 'West Coast' },
        salary: 105000,
        type: 'Full-time',
        category: 'Design',
        status: 'active',
        experience: { min: 3, max: 6, level: 'Mid' }
      },
      {
        title: 'Product Designer',
        description: 'Lead product design from concept to launch. Collaborate with PM and engineering to deliver exceptional user experiences.',
        employer: employers[3]._id,
        company: companies[3]._id,
        location: { city: 'Los Angeles', state: 'CA', region: 'West Coast' },
        salary: 125000,
        type: 'Contract',
        category: 'Design',
        status: 'active',
        experience: { min: 5, max: 8, level: 'Senior' }
      },
      {
        title: 'Data Scientist',
        description: 'Build predictive models and extract insights from large datasets. Work with Python, R, SQL, and modern ML frameworks.',
        employer: employers[4]._id,
        company: companies[4]._id,
        location: { city: 'Seattle', state: 'WA', region: 'Northwest' },
        salary: 145000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 3, max: 7, level: 'Mid' }
      },
      {
        title: 'Machine Learning Engineer',
        description: 'Deploy ML models at scale. Experience with TensorFlow, PyTorch, and cloud ML platforms required.',
        employer: employers[4]._id,
        company: companies[4]._id,
        location: { city: 'Seattle', state: 'WA', region: 'Northwest' },
        salary: 155000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 4, max: 8, level: 'Senior' }
      },
      {
        title: 'DevOps Engineer',
        description: 'Build and maintain CI/CD pipelines, manage Kubernetes clusters, and automate infrastructure with Terraform.',
        employer: employers[5]._id,
        company: companies[5]._id,
        location: { city: 'Boston', state: 'MA', region: 'East Coast' },
        salary: 135000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 4, max: 7, level: 'Mid' }
      },
      {
        title: 'Junior Software Engineer',
        description: '<p>Launch your tech career with us! We are looking for recent graduates or career changers eager to learn and grow.</p><h3>What You Will Do:</h3><ul><li>Write clean, maintainable code under senior guidance</li><li>Participate in code reviews and pair programming</li><li>Learn our tech stack and development practices</li><li>Contribute to real projects from day one</li></ul><h3>Requirements:</h3><ul><li>Bachelor degree in Computer Science or related field, or bootcamp graduate</li><li>Knowledge of JavaScript, Python, or Java</li><li>Understanding of Git and basic web development</li><li>Strong problem-solving and communication skills</li></ul>',
        employer: employers[5]._id,
        company: companies[5]._id,
        location: { city: 'Boston', state: 'MA', region: 'East Coast' },
        salary: 85000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 0, max: 2, level: 'Entry' }
      },
      // FinTech Solutions Jobs
      {
        title: 'Senior Backend Engineer - FinTech',
        description: '<p>Join our fintech platform processing billions in transactions. Build secure, scalable payment systems using modern technologies.</p><h3>Responsibilities:</h3><ul><li>Design and build high-performance financial APIs</li><li>Ensure PCI DSS compliance and security best practices</li><li>Optimize database queries for million+ TPS</li><li>Mentor junior engineers</li></ul><h3>Requirements:</h3><ul><li>7+ years backend development experience</li><li>Expert in Java/Kotlin or Python</li><li>Experience with financial systems and compliance</li><li>Strong knowledge of distributed systems</li></ul>',
        employer: employers[6]._id,
        company: companies[6]._id,
        location: { city: 'Chicago', state: 'IL', region: 'Midwest' },
        salary: 165000,
        type: 'Full-time',
        category: 'Finance',
        status: 'active',
        experience: { min: 7, max: 12, level: 'Senior' }
      },
      {
        title: 'Digital Marketing Manager',
        description: '<p>Lead our digital marketing efforts to drive user acquisition and engagement. $5M annual budget to manage.</p><h3>Responsibilities:</h3><ul><li>Develop and execute multi-channel marketing campaigns</li><li>Manage SEO/SEM, email, and social media strategies</li><li>Analyze metrics and optimize ROI</li><li>Lead a team of 3-5 marketing specialists</li></ul><h3>Requirements:</h3><ul><li>5+ years in digital marketing</li><li>Proven track record of driving growth</li><li>Expert in Google Analytics, SEMrush, HubSpot</li><li>Experience in FinTech or SaaS preferred</li></ul>',
        employer: employers[6]._id,
        company: companies[6]._id,
        location: { city: 'Chicago', state: 'IL', region: 'Midwest' },
        salary: 110000,
        type: 'Full-time',
        category: 'Marketing',
        status: 'active',
        experience: { min: 5, max: 8, level: 'Senior' }
      },
      {
        title: 'Product Manager - Payments',
        description: '<p>Own the product roadmap for our payments platform. Work with engineering, design, and business teams to ship features used by millions.</p><h3>Responsibilities:</h3><ul><li>Define product strategy and roadmap</li><li>Gather requirements from stakeholders</li><li>Prioritize features and manage backlog</li><li>Work with engineering to ship quality products</li></ul><h3>Requirements:</h3><ul><li>4+ years product management experience</li><li>Technical background preferred</li><li>Experience with payments or fintech</li><li>Strong analytical and communication skills</li></ul>',
        employer: employers[6]._id,
        company: companies[6]._id,
        location: { city: 'Chicago', state: 'IL', region: 'Midwest' },
        salary: 140000,
        type: 'Full-time',
        category: 'Finance',
        status: 'active',
        experience: { min: 4, max: 8, level: 'Mid' }
      },
      // HealthPlus Medical Jobs
      {
        title: 'Healthcare Software Engineer',
        description: '<p>Build EMR and patient management systems that improve healthcare delivery. HIPAA compliant development environment.</p><h3>Responsibilities:</h3><ul><li>Develop healthcare applications using Java/Spring Boot</li><li>Ensure HIPAA compliance in all code</li><li>Integrate with HL7/FHIR standards</li><li>Collaborate with medical professionals</li></ul><h3>Requirements:</h3><ul><li>3+ years software development</li><li>Healthcare IT experience required</li><li>Knowledge of HIPAA, HL7, FHIR</li><li>Java, Spring Boot, SQL expertise</li></ul>',
        employer: employers[7]._id,
        company: companies[7]._id,
        location: { city: 'Atlanta', state: 'GA', region: 'Southeast' },
        salary: 125000,
        type: 'Full-time',
        category: 'Healthcare',
        status: 'active',
        experience: { min: 3, max: 7, level: 'Mid' }
      },
      {
        title: 'Clinical Data Analyst',
        description: '<p>Analyze clinical data to improve patient outcomes and operational efficiency. Work directly with healthcare providers.</p><h3>Responsibilities:</h3><ul><li>Analyze patient data and clinical metrics</li><li>Create dashboards and reports for stakeholders</li><li>Identify trends and improvement opportunities</li><li>Ensure data privacy and HIPAA compliance</li></ul><h3>Requirements:</h3><ul><li>Bachelor degree in Healthcare, Statistics, or related field</li><li>2+ years healthcare data analysis</li><li>Proficient in SQL, Excel, Tableau</li><li>Understanding of clinical workflows</li></ul>',
        employer: employers[7]._id,
        company: companies[7]._id,
        location: { city: 'Atlanta', state: 'GA', region: 'Southeast' },
        salary: 85000,
        type: 'Full-time',
        category: 'Healthcare',
        status: 'active',
        experience: { min: 2, max: 5, level: 'Mid' }
      },
      // Additional Varied Jobs
      {
        title: 'Staff Software Engineer',
        description: '<p>Technical leadership role for experienced engineers. Drive architecture decisions and mentor the engineering team.</p><h3>Responsibilities:</h3><ul><li>Lead technical design for major initiatives</li><li>Mentor senior and mid-level engineers</li><li>Set engineering standards and best practices</li><li>Collaborate with product and executive leadership</li></ul><h3>Requirements:</h3><ul><li>10+ years software engineering experience</li><li>Expert in system design and architecture</li><li>Strong leadership and mentoring skills</li><li>Experience scaling engineering teams</li></ul>',
        employer: employers[0]._id,
        company: companies[0]._id,
        location: { city: 'San Francisco', state: 'CA', region: 'West Coast' },
        salary: 220000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 10, max: 15, level: 'Lead' }
      },
      {
        title: 'QA Engineer (Automation)',
        description: '<p>Build automated testing frameworks to ensure product quality. Work with engineering teams to ship bug-free software.</p><h3>Responsibilities:</h3><ul><li>Design and implement automated test suites</li><li>Develop CI/CD testing pipelines</li><li>Perform manual testing when needed</li><li>Track bugs and work with developers on fixes</li></ul><h3>Requirements:</h3><ul><li>3+ years QA/testing experience</li><li>Strong automation skills (Selenium, Cypress, Jest)</li><li>Knowledge of CI/CD tools (Jenkins, GitLab CI)</li><li>Excellent attention to detail</li></ul>',
        employer: employers[1]._id,
        company: companies[1]._id,
        location: { city: 'Austin', state: 'TX', region: 'Central' },
        salary: 95000,
        type: 'Full-time',
        category: 'Technology',
        status: 'active',
        experience: { min: 3, max: 6, level: 'Mid' }
      },
      {
        title: 'Customer Success Manager',
        description: '<p>Be the voice of our customers. Ensure client satisfaction, retention, and growth through excellent relationship management.</p><h3>Responsibilities:</h3><ul><li>Manage portfolio of enterprise customers</li><li>Conduct onboarding and training sessions</li><li>Monitor customer health and usage metrics</li><li>Identify upsell and expansion opportunities</li></ul><h3>Requirements:</h3><ul><li>3+ years in customer success or account management</li><li>SaaS/B2B experience preferred</li><li>Excellent communication skills</li><li>Data-driven mindset</li></ul>',
        employer: employers[4]._id,
        company: companies[4]._id,
        location: { city: 'Remote', state: '', region: 'Remote' },
        salary: 90000,
        type: 'Full-time',
        category: 'Sales',
        status: 'active',
        experience: { min: 3, max: 6, level: 'Mid' }
      }
    ]);

    console.log('📝 Creating applications...');
    const applications = await Application.create([
      // Alice applies to frontend and UX roles
      {
        job: jobs[0]._id,
        seeker: seekers[0]._id,
        coverLetter: 'I have 6 years of React experience and have led frontend teams at startups. Excited about building scalable web apps.',
        status: 'shortlisted',
        resumeUrl: 'https://example.com/resumes/alice-resume.pdf'
      },
      {
        job: jobs[6]._id,
        seeker: seekers[0]._id,
        coverLetter: 'My frontend skills translate well to UX. I understand design systems and accessibility best practices.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/alice-resume.pdf'
      },
      // Bob applies to backend and full-stack roles
      {
        job: jobs[1]._id,
        seeker: seekers[1]._id,
        coverLetter: 'Python expert with 5 years building APIs at scale. Comfortable with Django, FastAPI, and PostgreSQL.',
        status: 'accepted',
        resumeUrl: 'https://example.com/resumes/bob-resume.pdf'
      },
      {
        job: jobs[3]._id,
        seeker: seekers[1]._id,
        coverLetter: 'Full-stack generalist ready to work on anything. MERN stack is my specialty.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/bob-resume.pdf'
      },
      // Carol applies to mobile and junior roles
      {
        job: jobs[2]._id,
        seeker: seekers[2]._id,
        coverLetter: 'Built 3 React Native apps with 50k+ downloads. Love creating smooth mobile experiences.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/carol-resume.pdf'
      },
      {
        job: jobs[11]._id,
        seeker: seekers[2]._id,
        coverLetter: 'Recent bootcamp grad eager to learn and contribute. Strong foundation in JavaScript and Git.',
        status: 'rejected',
        resumeUrl: 'https://example.com/resumes/carol-resume.pdf'
      },
      // Daniel applies to consulting and BA roles
      {
        job: jobs[4]._id,
        seeker: seekers[3]._id,
        coverLetter: '8 years in strategy consulting. Led digital transformation projects for Fortune 100 clients.',
        status: 'shortlisted',
        resumeUrl: 'https://example.com/resumes/daniel-resume.pdf'
      },
      {
        job: jobs[5]._id,
        seeker: seekers[3]._id,
        coverLetter: 'MBA with strong analytical skills. Experience bridging business and technical teams.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/daniel-resume.pdf'
      },
      // Emma applies to design roles
      {
        job: jobs[7]._id,
        seeker: seekers[4]._id,
        coverLetter: 'Product designer with 7 years experience. Portfolio: dribbble.com/emmawilson. Led design for 2 successful app launches.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/emma-resume.pdf'
      },
      {
        job: jobs[6]._id,
        seeker: seekers[4]._id,
        coverLetter: 'Passionate about user-centered design. Expert in Figma, user research, and design systems.',
        status: 'shortlisted',
        resumeUrl: 'https://example.com/resumes/emma-resume.pdf'
      },
      // Frank applies to data roles
      {
        job: jobs[8]._id,
        seeker: seekers[5]._id,
        coverLetter: 'PhD in Statistics, 4 years building ML models in production. Proficient in Python, SQL, Spark.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/frank-resume.pdf'
      },
      {
        job: jobs[9]._id,
        seeker: seekers[5]._id,
        coverLetter: 'Deployed deep learning models on AWS SageMaker. Experienced with TensorFlow and MLOps practices.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/frank-resume.pdf'
      },
      // Grace applies to DevOps
      {
        job: jobs[10]._id,
        seeker: seekers[6]._id,
        coverLetter: '5 years managing cloud infrastructure. Kubernetes certified, Terraform expert. Built CI/CD for 20+ microservices.',
        status: 'accepted',
        resumeUrl: 'https://example.com/resumes/grace-resume.pdf'
      },
      // Henry applies to junior and full-stack roles
      {
        job: jobs[11]._id,
        seeker: seekers[7]._id,
        coverLetter: 'Computer Science graduate from MIT. Completed internships at Google and Amazon. Ready to contribute!',
        status: 'shortlisted',
        resumeUrl: 'https://example.com/resumes/henry-resume.pdf'
      },
      {
        job: jobs[3]._id,
        seeker: seekers[7]._id,
        coverLetter: 'New grad with strong fundamentals. Built 10+ projects in React, Node, and MongoDB during school.',
        status: 'applied',
        resumeUrl: 'https://example.com/resumes/henry-resume.pdf'
      }
    ]);

    console.log('\n✅ Seeding complete!\n');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${seekers.length} job seekers + ${employers.length} employers = ${seekers.length + employers.length} total`);
    console.log(`   📝 Seeker Profiles: ${seekerProfiles.length}`);
    console.log(`   🏢 Company Profiles: ${companies.length}`);
    console.log(`   💼 Jobs: ${jobs.length} (across Technology, Finance, Healthcare, Design, Operations, Marketing)`);
    console.log(`   📋 Applications: ${applications.length}`);
    console.log('\n🔐 Login credentials (all users):');
    console.log('   Password: password123');
    console.log('\n📧 Sample Job Seeker Accounts:');
    console.log('   - alice.johnson@email.com (Senior Frontend Developer)');
    console.log('   - bob.smith@email.com (Full Stack Engineer)');
    console.log('   - isabella.garcia@email.com (Marketing Manager)');
    console.log('   - jack.chen@email.com (Healthcare Software Engineer)');
    console.log('\n📧 Sample Employer Accounts:');
    console.log('   - hr@techcorp.com (TechCorp Solutions)');
    console.log('   - jobs@innovatelab.com (InnovateLab Inc)');
    console.log('   - jobs@fintech.com (FinTech Solutions)');
    console.log('   - careers@healthplus.com (HealthPlus Medical)');
    console.log('\n💡 Features:');
    console.log('   ✓ Detailed job descriptions with HTML formatting');
    console.log('   ✓ Diverse industries and job types');
    console.log('   ✓ Realistic salary ranges ($85K - $220K)');
    console.log('   ✓ Multiple application statuses (applied, shortlisted, accepted, rejected)');
    console.log('   ✓ Complete seeker profiles with skills and experience');
    console.log();

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
}

run();