import { Github, Linkedin, Globe, Mail, Code, Shield, Palette, Database, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';

const DEVELOPERS = [
    {
        name: 'Koteshwar Rao Agathamoodi',
        role: 'Fresher Full Stack Developer',
        avatar: './logo.png',
        bio: 'Passionate about building scalable web applications and exploring new technologies. Lead the FoodExpress project architecture.',
        skills: ['Java', 'Spring Boot', 'React', 'MySQL'],
        color: 'primary'
    },
    {
        name: 'Siva kumar',
        role: 'UI/UX Designer',
        avatar: './logo.png',
        bio: 'Crafting beautiful and intuitive user experiences. Focused on making FoodExpress aesthetically pleasing and easy to use.',
        skills: ['Figma', 'Tailwind CSS', 'Adobe XD', 'Prototyping'],
        color: 'pink'
    },
    {
        name: 'Naveen',
        role: 'QA Engineer',
        avatar: './logo.png',
        bio: 'Meticulous tester ensuring every feature works perfectly. Responsible for the robust QR delivery verification system.',
        skills: ['Selenium', 'JUnit', 'API Testing', 'Automation'],
        color: 'blue'
    },
    {
        name: 'Pranith',
        role: 'Backend Developer',
        avatar: './logo.png',
        bio: 'Expert in secure authentication and database optimization. Managed the multi-role security system and real-time cart sync.',
        skills: ['Spring Security', 'JPA', 'PostgreSQL', 'Redis'],
        color: 'primary'
    },
    {
        name: 'Anusha',
        role: 'Frontend Developer',
        avatar: './logo.png',
        bio: 'Turning complex designs into interactive code. Implemented the dynamic dashboards and real-time order tracking UI.',
        skills: ['JavaScript', 'Redux', 'Framer Motion', 'Vite'],
        color: 'orange'
    }
];

export default function Developers() {
    return (
        <div className="max-w-7xl mx-auto py-16 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Meet the Creators 👨‍💻
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    The talented team behind FoodExpress who worked tirelessly to deliver the best food ordering experience.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-primary-600 font-medium">
                    <Heart className="w-5 h-5 fill-current" />
                    <span>Built with passion for Foodies everywhere</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DEVELOPERS.map((dev, index) => (
                    <Card key={index} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none bg-white">
                        <div className={`h-2 bg-${dev.color}-500 w-full`} />
                        <div className="p-8">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-${dev.color}-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                                    <img
                                        src={dev.avatar}
                                        alt={dev.name}
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg relative z-10 object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{dev.name}</h3>
                                    <p className={`text-${dev.color}-600 font-semibold text-sm uppercase tracking-wider`}>
                                        {dev.role}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6 italic">
                                "{dev.bio}"
                            </p>

                            <div className="mb-8">
                                <div className="flex flex-wrap gap-2">
                                    {dev.skills.map((skill, sIdx) => (
                                        <span
                                            key={sIdx}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <div className="flex gap-4">
                                    <a href="https://github.com/koteshwar-agathamoodi" className="text-gray-400 hover:text-gray-900 transition-colors">
                                        <Github className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.linkedin.com/in/agathamoodi-koteshwar-rao-5b04a1231" className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                                <button className={`flex items-center gap-2 text-sm font-bold text-${dev.color}-600 hover:opacity-80 transition-opacity`}>
                                    View Portfolio
                                    <Globe className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-20 p-12 bg-gray-900 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Code className="w-64 h-64 -mr-16 -mt-16 rotate-12" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Want to join our team?</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        We're always looking for brilliant minds to join us in shaping the future of food delivery.
                    </p>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-primary-900/50 transition-all hover:scale-105">
                        View Careers
                    </button>
                </div>
            </div>
        </div>
    );
}
