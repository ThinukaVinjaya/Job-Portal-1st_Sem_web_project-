// ========== JOB DATABASE ==========
let jobsDatabase = [
    {
        id: 1,
        title: 'Senior Product Designer',
        company: 'Spotify',
        location: 'New York, NY',
        type: 'Remote',
        category: 'Design',
        salary: '$140k - $180k',
        description: 'We are looking for a Senior Product Designer to join our team. You will be responsible for defining the user experience, crafting intuitive and engaging interfaces.',
        fullDescription: 'We are looking for a Senior Product Designer to join our team. You will be responsible for defining the user experience, crafting intuitive and engaging interfaces. You will work closely with product managers, engineers, and stakeholders to deliver world-class user experiences.',
        requirements: ['5+ years of design experience', 'Proficiency in Figma/Sketch', 'Strong portfolio', 'Excellent communication skills', 'User-centered design approach'],
        benefits: ['Competitive salary', 'Remote flexibility', 'Health insurance', '401k matching', 'Stock options', 'Professional development budget'],
        avatar: 'S',
        avatarGradient: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
        posted: '2h ago'
    },
    {
        id: 1,
        title: 'Senior Product Designer',
        company: 'Spotify',
        location: 'New York, NY',
        type: 'Remote',
        category: 'Design',
        salary: '$140k - $180k',
        description: 'We are looking for a Senior Product Designer to join our team. You will be responsible for defining the user experience, crafting intuitive and engaging interfaces.',
        fullDescription: 'We are looking for a Senior Product Designer to join our team. You will be responsible for defining the user experience, crafting intuitive and engaging interfaces. You will work closely with product managers, engineers, and stakeholders to deliver world-class user experiences.',
        requirements: ['5+ years of design experience', 'Proficiency in Figma/Sketch', 'Strong portfolio', 'Excellent communication skills', 'User-centered design approach'],
        benefits: ['Competitive salary', 'Remote flexibility', 'Health insurance', '401k matching', 'Stock options', 'Professional development budget'],
        avatar: 'S',
        avatarGradient: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
        posted: '2h ago'
    },
    {
        id: 2,
        title: 'Lead UX Researcher',
        company: 'Airbnb',
        location: 'San Francisco, CA',
        type: 'On-site',
        category: 'Design',
        salary: '$160k - $220k',
        description: 'Join the team that puts hospitality at the center of everything. We are seeking a Lead UX Researcher.',
        fullDescription: 'Join the team that puts hospitality at the center of everything. We\'re seeking a Lead UX Researcher to drive insights that shape the future of travel. Lead a team of researchers and drive strategic research initiatives across our global platform.',
        requirements: ['8+ years UX research', 'Leadership experience', 'Research methodology expertise', 'Data analysis skills', 'Qualitative & quantitative methods'],
        benefits: ['Competitive salary', 'On-site perks', 'Health insurance', 'Unlimited PTO', 'Professional development'],
        avatar: 'A',
        avatarGradient: 'linear-gradient(135deg, #FF5A5F 0%, #FFA3A5 100%)',
        posted: '5h ago'
    },
    {
        id: 3,
        title: 'UX Design Manager',
        company: 'Google',
        location: 'Mountain View, CA',
        type: 'Remote',
        category: 'Design',
        salary: '$150k - $200k',
        description: 'We\'re looking for a UX Design Manager to lead a team of talented designers and drive strategic design decisions.',
        fullDescription: 'We\'re looking for a UX Design Manager to lead a team of talented designers. You will be responsible for strategic design decisions, mentoring your team, and collaborating with product and engineering teams to create experiences used by billions.',
        requirements: ['6+ years design experience', '3+ years management', 'Team leadership', 'Design thinking', 'Cross-functional collaboration'],
        benefits: ['Top-tier salary', 'Full remote', 'Google benefits', 'Stock options', 'Learning budget', 'Wellness programs'],
        avatar: 'G',
        avatarGradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
        posted: '8h ago'
    },
    {
        id: 4,
        title: 'Visual Designer',
        company: 'Figma',
        location: 'San Francisco, CA',
        type: 'Hybrid',
        category: 'Design',
        salary: '$130k - $170k',
        description: 'Create stunning visual designs for web and mobile applications.',
        fullDescription: 'Create stunning visual designs for web and mobile applications. Work on Figma\'s design system and help shape the future of design tools. Collaborate with product, engineering, and marketing teams.',
        requirements: ['4+ years design', 'Design systems knowledge', 'Prototyping skills', 'Attention to detail', 'Animation expertise'],
        benefits: ['Competitive salary', 'Hybrid work', 'Equity', 'Health insurance', 'Design conference budget'],
        avatar: 'F',
        avatarGradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        posted: '12h ago'
    },
    {
        id: 5,
        title: 'Frontend Engineer',
        company: 'Tech Startup',
        location: 'Remote',
        type: 'Remote',
        category: 'Technology',
        salary: '$120k - $160k',
        description: 'Build amazing web experiences with React and modern JavaScript.',
        fullDescription: 'Build amazing web experiences with React and modern JavaScript. We\'re a fast-growing startup looking for talented frontend engineers to join our team and help scale our platform.',
        requirements: ['3+ years React', 'JavaScript expertise', 'CSS/HTML skills', 'Testing experience', 'Git proficiency'],
        benefits: ['Competitive salary', 'Remote', 'Stock options', 'Flexible hours', 'Wellness benefits'],
        avatar: 'T',
        avatarGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        posted: '1d ago'
    },
    {
        id: 6,
        title: 'Healthcare Administrator',
        company: 'Health Plus',
        location: 'Boston, MA',
        type: 'On-site',
        category: 'Healthcare',
        salary: '$60k - $85k',
        description: 'Manage patient records and administrative tasks in a modern healthcare facility.',
        fullDescription: 'Manage patient records and administrative tasks in a modern healthcare facility. Excellent opportunity for someone passionate about healthcare with strong organizational skills and attention to detail.',
        requirements: ['2+ years healthcare admin', 'EMR software', 'HIPAA knowledge', 'Patient communication', 'Medical terminology'],
        benefits: ['Health insurance', 'On-site', '401k', 'Paid time off', 'Tuition reimbursement'],
        avatar: 'H',
        avatarGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        posted: '3d ago'
    }
];

// Load jobs from localStorage if available (for posted jobs)
const storedJobs = localStorage.getItem('jobsDatabase');
if (storedJobs) {
    const parsedJobs = JSON.parse(storedJobs);
    // Merge with default jobs, avoiding duplicates
    const existingIds = jobsDatabase.map(job => job.id);
    const newJobs = parsedJobs.filter(job => !existingIds.includes(job.id));
    jobsDatabase = [...jobsDatabase, ...newJobs];
}
