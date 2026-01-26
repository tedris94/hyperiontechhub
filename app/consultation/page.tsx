'use client';

import { useState } from 'react';
import { Calendar, Clock, Mail, Phone, MessageSquare, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSiteContent } from '@/contexts/SiteContentContext';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  general?: string;
}

export default function ConsultationPage() {
  const siteContent = useSiteContent();
  const { consultation } = siteContent;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateDate = (date: string): boolean => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!validatePhone(value)) return 'Please enter a valid phone number';
        break;
      case 'service':
        if (!value) return 'Please select a service';
        break;
      case 'preferredDate':
        if (!value) return 'Preferred date is required';
        if (!validateDate(value)) return 'Date cannot be in the past';
        break;
      case 'preferredTime':
        if (!value) return 'Preferred time is required';
        break;
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.length > 1000) return 'Message must not exceed 1000 characters';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'company') { // Company is optional
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store in localStorage for dashboard access
        if (typeof window !== 'undefined') {
          const consultations = JSON.parse(localStorage.getItem('hyperion_consultations') || '[]');
          consultations.push(result.consultation);
          localStorage.setItem('hyperion_consultations', JSON.stringify(consultations));
        }

        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          preferredDate: '',
          preferredTime: '',
          message: '',
        });
        setErrors({});
        setTouched({});
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
        setErrors({ general: result.error || 'An unexpected error occurred.' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrors({ general: 'Failed to submit consultation request. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = consultation.services;
  const timeSlots = consultation.timeSlots;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-[#1A2BC2]/5 via-white to-[#0D0D52]/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-[#1A2BC2]" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1B1C1E] mb-6">
                {consultation.hero.title}{' '}
                <span className="text-[#1A2BC2]">{consultation.hero.highlight}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {consultation.hero.description}
              </p>
            </div>
          </div>
        </section>

        {/* Consultation Form Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {submitStatus === 'success' ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl text-[#1B1C1E] mb-4">{consultation.success.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {consultation.success.message}
                  </p>
                  <Link
                    href={consultation.success.ctaHref}
                    className="inline-flex items-center px-6 py-3 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors font-semibold"
                  >
                    {consultation.success.ctaLabel}
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus === 'error' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{consultation.error.title}</AlertTitle>
                        <AlertDescription>
                          {errors.general || consultation.error.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                        {consultation.form.labels.name} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        placeholder={consultation.form.placeholders.name}
                          className={errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && touched.name && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                        {consultation.form.labels.email} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        placeholder={consultation.form.placeholders.email}
                          className={
                            errors.email && touched.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                              : touched.email && formData.email && !errors.email && validateEmail(formData.email)
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20 shadow-md shadow-green-500/20'
                              : ''
                          }
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && touched.email && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {consultation.form.labels.phone} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={consultation.form.placeholders.phone}
                          className={errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && touched.phone && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">{consultation.form.labels.company}</Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder={consultation.form.placeholders.company}
                        />
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="service">
                        {consultation.form.labels.service} <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2BC2] focus:border-[#1A2BC2] ${
                          errors.service ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                        }`}
                        aria-invalid={!!errors.service}
                      >
                        <option value="">{consultation.form.servicePlaceholder}</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      {errors.service && touched.service && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Preferred Date & Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">
                          {consultation.form.labels.preferredDate} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min={new Date().toISOString().split('T')[0]}
                          className={errors.preferredDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                          aria-invalid={!!errors.preferredDate}
                        />
                        {errors.preferredDate && touched.preferredDate && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.preferredDate}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">
                          {consultation.form.labels.preferredTime} <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2BC2] focus:border-[#1A2BC2] ${
                            errors.preferredTime ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                          }`}
                          aria-invalid={!!errors.preferredTime}
                        >
                          <option value="">{consultation.form.timePlaceholder}</option>
                          {timeSlots.map((time, index) => (
                            <option key={index} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        {errors.preferredTime && touched.preferredTime && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.preferredTime}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {consultation.form.labels.message} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={consultation.form.placeholders.message}
                        className={errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                        aria-invalid={!!errors.message}
                      />
                      <div className="flex justify-between text-xs">
                        {errors.message && touched.message && (
                          <p className="text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.message}
                          </p>
                        )}
                        {!errors.message && (
                          <p className="text-gray-500">
                            {formData.message.length}/1000 characters
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1A2BC2] hover:bg-[#0D0D52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-lg transition-colors font-semibold flex items-center justify-center group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 w-5 h-5" />
                          {consultation.form.submitLabel}
                          <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
                  Other Ways to Reach Us
                </h2>
                <p className="text-xl text-gray-600">
                  Prefer to contact us directly? Use any of these methods
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-[#1A2BC2]/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#1A2BC2]" />
                  </div>
                  <h3 className="text-xl text-[#1B1C1E] font-semibold mb-2">Email Us</h3>
                  <a
                    href="mailto:info@hyperiontechhub.com"
                    className="text-[#1A2BC2] hover:text-[#0D0D52] transition-colors"
                  >
                    info@hyperiontechhub.com
                  </a>
                </div>
                <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-[#1A2BC2]/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-[#1A2BC2]" />
                  </div>
                  <h3 className="text-xl text-[#1B1C1E] font-semibold mb-2">Call Us</h3>
                  <a
                    href="tel:+2349064951938"
                    className="text-[#1A2BC2] hover:text-[#0D0D52] transition-colors"
                  >
                    (+234) 906 4951 938
                  </a>
                </div>
                <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-[#1A2BC2]/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-[#1A2BC2]" />
                  </div>
                  <h3 className="text-xl text-[#1B1C1E] font-semibold mb-2">Contact Form</h3>
                  <Link
                    href="/#contact"
                    className="text-[#1A2BC2] hover:text-[#0D0D52] transition-colors"
                  >
                    Visit Contact Page
                  </Link>
                </div>
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

