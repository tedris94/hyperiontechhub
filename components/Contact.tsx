'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Allow various phone formats: +234 906 4951938, (234) 906-4951-938, etc.
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phone === '' || phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Full name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          return 'Email address is required';
        }
        if (!validateEmail(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          return 'Please enter a valid phone number';
        }
        break;
      case 'service':
        if (!value) {
          return 'Please select a service';
        }
        break;
      case 'message':
        if (!value.trim()) {
          return 'Message is required';
        }
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters';
        }
        if (value.length > 500) {
          return 'Message must not exceed 500 characters';
        }
        break;
    }
    return undefined;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const fieldName = e.target.name;
    setTouched({ ...touched, [fieldName]: true });
    
    const error = validateField(fieldName, e.target.value);
    setErrors({ ...errors, [fieldName]: error });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const fieldName = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });

    // Clear error when user starts typing
    if (errors[fieldName as keyof FormErrors] && touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors({ ...errors, [fieldName]: error });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      service: true,
      message: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Store submission in localStorage for admin dashboards
      if (data.submission) {
        const existingSubmissions = JSON.parse(
          localStorage.getItem('hyperion_contact_submissions') || '[]'
        );
        existingSubmissions.unshift(data.submission);
        // Keep only last 100 submissions
        const limitedSubmissions = existingSubmissions.slice(0, 100);
        localStorage.setItem(
          'hyperion_contact_submissions',
          JSON.stringify(limitedSubmissions)
        );
      }

      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
        });
        setErrors({});
        setTouched({});
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600">
            Ready to transform your technology experience? Let's start a conversation.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* LEFT COLUMN - Contact Info */}
          <div className="space-y-8">
            {/* Intro Text */}
            <div>
              <h3 className="text-2xl text-[#1B1C1E] mb-4">
                Let's Connect
              </h3>
              <p className="text-gray-600 mb-8">
                Whether you have a question about our services, pricing, or anything else, 
                our team is ready to answer all your questions.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-6">
              {/* Email Card */}
              <div className="border-none shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg">
                <div className="p-6">
                  <a href="mailto:info@hyperiontechhub.com" className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 rounded-lg bg-[#1A2BC2]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A2BC2] transition-colors">
                      <Mail className="w-6 h-6 text-[#1A2BC2] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-[#1B1C1E] mb-1 font-semibold">Email Us</h4>
                      <p className="text-gray-600">info@hyperiontechhub.com</p>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Phone Card */}
              <div className="border-none shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg">
                <div className="p-6">
                  <a href="tel:+2349064951938" className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 rounded-lg bg-[#1A2BC2]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A2BC2] transition-colors">
                      <Phone className="w-6 h-6 text-[#1A2BC2] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-[#1B1C1E] mb-1 font-semibold">Call Us</h4>
                      <p className="text-gray-600">(+234) 906 4951 938</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="border-none shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-[#1A2BC2]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#1A2BC2]" />
                    </div>
                    <div>
                      <h4 className="text-[#1B1C1E] mb-1 font-semibold">Visit Us</h4>
                      <p className="text-gray-600">
                        Plot 624, No. 9 Clifford Omozeghian Ave., Gbazango Extension II, Arab Road, Arab Junction by Kubwa Express, Kubwa, FCT-Abuja
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us Box */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg text-[#1B1C1E] mb-4 font-semibold">
                Why Choose Us?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3"></div>
                  24/7 Customer Support
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3"></div>
                  Expert Technical Team
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3"></div>
                  Competitive Pricing
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#1A2BC2] mr-3"></div>
                  Custom Solutions
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN - Contact Form */}
          <div className="border-none shadow-xl bg-white rounded-lg">
            <div className="p-8">
              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-800 font-semibold mb-1">Message Sent Successfully!</h4>
                    <p className="text-green-700 text-sm">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-800 font-semibold mb-1">Failed to Send Message</h4>
                    <p className="text-red-700 text-sm">
                      Please try again later or contact us directly via email or phone.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[#1B1C1E] font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      errors.name && touched.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]/20'
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[#1B1C1E] font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      errors.email && touched.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]/20'
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[#1B1C1E] font-medium">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+234 906 4951938"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      errors.phone && touched.phone
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]/20'
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Service Select */}
                <div className="space-y-2">
                  <label htmlFor="service" className="text-[#1B1C1E] font-medium">
                    Service Interested In <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      errors.service && touched.service
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]/20'
                    }`}
                  >
                    <option value="">Select a service</option>
                    <option value="ai-coding">AI & Native Coding</option>
                    <option value="wordpress">WordPress & Web Development</option>
                    <option value="cloud">Cloud Services</option>
                    <option value="android">Android Development</option>
                    <option value="training">Corporate Training</option>
                    <option value="courses">Online Courses</option>
                    <option value="repairs">Computer & Laptop Repairs</option>
                    <option value="design">Graphic Design & Printing</option>
                    <option value="cybersecurity">Cybersecurity</option>
                  </select>
                  {errors.service && touched.service && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[#1B1C1E] font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project or inquiry..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={500}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.message && touched.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#1A2BC2] focus:ring-[#1A2BC2]/20'
                    }`}
                  />
                  {errors.message && touched.message && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                  <p className={`text-xs ${formData.message.length > 450 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {formData.message.length} / 500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center bg-[#1A2BC2] hover:bg-[#0D0D52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors duration-300 group font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
