import { useLocation } from 'react-router-dom';
import { Shield, FileText, RefreshCcw, Cookie, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

const POLICY_CONTENT = {
    '/terms': {
        title: 'Terms of Service',
        icon: FileText,
        lastUpdated: 'February 6, 2026',
        sections: [
            {
                heading: '1. Acceptance of Terms',
                content: 'By accessing and using FoodExpress ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.'
            },
            {
                heading: '2. Description of Service',
                content: 'FoodExpress provides a platform connecting customers with restaurants and delivery partners for the ordering and delivery of food items.'
            },
            {
                heading: '3. User Accounts',
                content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
            },
            {
                heading: '4. Ordering and Payments',
                content: 'All orders are subject to availability. Prices are set by restaurants and are subject to change. Delivery fees are calculated based on distance.'
            }
        ]
    },
    '/privacy': {
        title: 'Privacy Policy',
        icon: Shield,
        lastUpdated: 'February 6, 2026',
        sections: [
            {
                heading: '1. Information We Collect',
                content: 'We collect information you provide directly to us (name, email, address, phone number) and information automatically collected when using our service.'
            },
            {
                heading: '2. How We Use Information',
                content: 'We use your information to process orders, facilitate deliveries, communicate with you, and improve our services.'
            },
            {
                heading: '3. Data Sharing',
                content: 'We share necessary information with restaurants and delivery partners to complete your orders. We do not sell your personal data to third parties.'
            }
        ]
    },
    '/refund': {
        title: 'Refund Policy',
        icon: RefreshCcw,
        lastUpdated: 'February 6, 2026',
        sections: [
            {
                heading: '1. Order Cancellation',
                content: 'Orders can be cancelled within 1 minute of placement for a full refund. Once the restaurant begins preparation, cancellation is not possible.'
            },
            {
                heading: '2. Eligibility for Refunds',
                content: 'Refunds may be issued for missing items, incorrect items, or orders never delivered. Quality issues are handled on a case-by-case basis.'
            },
            {
                heading: '3. Refund Process',
                content: 'Approved refunds are processed to the original payment method within 5-7 business days.'
            }
        ]
    },
    '/cookie': {
        title: 'Cookie Policy',
        icon: Cookie,
        lastUpdated: 'February 6, 2026',
        sections: [
            {
                heading: '1. What are Cookies?',
                content: 'Cookies are small text files stored on your device that help us provide and improve our service.'
            },
            {
                heading: '2. Type of Cookies Used',
                content: 'We use essential cookies for authentication and performance cookies to understand how you interact with our platform.'
            },
            {
                heading: '3. Managing Cookies',
                content: 'You can control cookie settings through your browser, but disabling essential cookies may impact service functionality.'
            }
        ]
    }
};

export default function Legal() {
    const location = useLocation();
    const policy = POLICY_CONTENT[location.pathname] || POLICY_CONTENT['/terms'];
    const Icon = policy.icon;

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{policy.title}</h1>
                    <p className="text-gray-500 text-sm mt-1">Last Updated: {policy.lastUpdated}</p>
                </div>
            </div>

            <Card className="p-8 space-y-8">
                {policy.sections.map((section, index) => (
                    <section key={index} className="space-y-3">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <ChevronRight className="w-5 h-5 text-primary-500" />
                            {section.heading}
                        </h2>
                        <p className="text-gray-600 leading-relaxed pl-7">
                            {section.content}
                        </p>
                    </section>
                ))}
            </Card>

            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Have questions about our policies?</h3>
                <p className="text-gray-600 text-sm mb-4">
                    If you have any questions regarding these terms, please contact our support team.
                </p>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-primary-600">
                    <span>Email: kagathamoodi@gmail.com</span>
                    <span className="text-gray-300">|</span>
                    <span>Helpline: +91 94158 49521</span>
                </div>
            </div>
        </div>
    );
}
