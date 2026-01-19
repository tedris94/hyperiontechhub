import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export const metadata = {
  title: 'Privacy Policy | Hyperion Tech Hub',
  description: 'Read our Privacy Policy to understand how Hyperion Tech Hub collects, uses, and protects your personal information.',
};

const privacySections = [
  {
    icon: FileText,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'We collect information that you provide directly to us, such as when you create an account, make a purchase, request services, or contact us. This may include your name, email address, phone number, billing address, and payment information.',
      },
      {
        subtitle: 'Usage Information',
        text: 'We automatically collect certain information about your device and how you interact with our website, including your IP address, browser type, operating system, pages visited, and time spent on pages.',
      },
      {
        subtitle: 'Cookies and Tracking',
        text: 'We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.',
      },
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Service Delivery',
        text: 'We use your information to provide, maintain, and improve our services, process transactions, and communicate with you about your account and services.',
      },
      {
        subtitle: 'Communication',
        text: 'We may send you updates, newsletters, marketing communications, and important service-related information. You can opt out of marketing communications at any time.',
      },
      {
        subtitle: 'Legal Compliance',
        text: 'We use your information to comply with legal obligations, resolve disputes, and enforce our agreements.',
      },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Security Measures',
        text: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access and Correction',
        text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us.',
      },
      {
        subtitle: 'Data Portability',
        text: 'You may request a copy of your personal data in a structured, machine-readable format.',
      },
      {
        subtitle: 'Deletion',
        text: 'You can request deletion of your personal information, subject to certain legal and contractual obligations.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of marketing communications and certain data processing activities by adjusting your preferences or contacting us.',
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-[#1A2BC2]" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  At Hyperion Tech Hub, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-16">
              {privacySections.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <div key={sectionIndex} className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 rounded-xl bg-[#1A2BC2]/10 flex items-center justify-center mr-4">
                        <Icon className="w-6 h-6 text-[#1A2BC2]" />
                      </div>
                      <h2 className="text-3xl md:text-4xl text-[#1B1C1E] font-semibold">
                        {section.title}
                      </h2>
                    </div>
                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <h3 className="text-xl text-[#1B1C1E] font-semibold mb-3">
                            {item.subtitle}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-8 text-center">
                Third-Party Services
              </h2>
              <div className="bg-gray-50 rounded-xl p-8 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We may use third-party service providers to help us operate our business and administer activities on our behalf, such as payment processing, email delivery, hosting services, and analytics. These third parties have access to your information only to perform specific tasks and are obligated not to disclose or use it for any other purpose.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our website may contain links to external sites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-8 text-center">
                Children's Privacy
              </h2>
              <div className="bg-white rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information from our systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-8 text-center">
                Changes to This Privacy Policy
              </h2>
              <div className="bg-gray-50 rounded-xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-[#1A2BC2] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl mb-6">
                Questions About Privacy?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:info@hyperiontechhub.com"
                  className="inline-flex items-center px-6 py-3 bg-white text-[#1A2BC2] rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

