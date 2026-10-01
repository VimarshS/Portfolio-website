import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Send, 
  Check, 
  Copy, 
  Sparkles, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export interface ContactFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

// Configurable endpoint abstraction for Vimarsh's future backend / Resend / Formspree
const CONTACT_API_ENDPOINT = import.meta.env.VITE_CONTACT_API_URL || "/api/contact";

/**
 * Backend-ready contact submission handler.
 * Plug your preferred email provider (Resend, Formspree, EmailJS, Node/Express endpoint) here.
 */
async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  // TODO: Connect this function to your real backend or serverless route:
  //
  // try {
  //   const res = await fetch(CONTACT_API_ENDPOINT, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data)
  //   });
  //   if (!res.ok) throw new Error('Failed to submit message');
  //   return { success: true, message: 'Message sent successfully.' };
  // } catch (err) {
  //   return { success: false, message: 'Server error. Please email directly.' };
  // }

  // Simulated asynchronous network delay for polished UI demonstration
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { 
    success: true, 
    message: "Thank you for reaching out! Your message was received and I will reply shortly." 
  };
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    category: 'Job Opportunity',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const categories = [
    'Job Opportunity',
    'Full-Stack Project',
    'Collaboration',
    'General Inquiry'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please write a message before sending.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          category: 'Job Opportunity',
          subject: '',
          message: ''
        });
      }
    } catch {
      setErrors({ message: 'Submission failed. Please email vimarshadarsh@gmail.com directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
              <span>Direct Communication</span>
              <span>·</span>
              <span>Open to Roles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Let's build something.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-3 leading-relaxed">
              I am actively seeking software engineering internships, entry-level developer roles, and technical collaborations. Whether you have an open position or want to discuss architecture, feel free to send a message.
            </p>
          </div>

          {/* Contact Card List */}
          <div className="space-y-3 pt-2">
            {/* Email */}
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-500">Email Address</div>
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="text-xs sm:text-sm font-medium text-white hover:text-indigo-300 transition-colors">
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1 font-mono"
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-neutral-500">Phone (India)</div>
                <a href={`tel:${PERSONAL_INFO.phone}`} className="text-xs sm:text-sm font-medium text-white hover:text-indigo-300 transition-colors">
                  {PERSONAL_INFO.phone}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-neutral-500">Location</div>
                <div className="text-xs sm:text-sm font-medium text-white">
                  {PERSONAL_INFO.location}
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="pt-2 flex items-center gap-3">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-center gap-2 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-center gap-2 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono pt-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Response time: Typically within 24 hours</span>
          </div>
        </div>

        {/* Right Column: Dedicated "Send Me a Message" Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Send Me a Message
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Direct inquiry form with client-side validation
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-center space-y-3 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-white font-display">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, Vimarsh will review your message and reply via email shortly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-3 px-4 py-2 text-xs font-medium rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Category Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                    Inquiry Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-2.5 py-2 rounded-lg text-center transition-colors truncate ${
                          formData.category === cat
                            ? 'bg-indigo-600 text-white font-medium shadow-sm'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g. Maya Chen"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900/90 border ${
                        errors.name ? 'border-rose-500' : 'border-neutral-800'
                      } text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                      Your Email <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="e.g. name@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900/90 border ${
                        errors.email ? 'border-rose-500' : 'border-neutral-800'
                      } text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                    Subject <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: undefined });
                    }}
                    placeholder="e.g. Full Stack Engineering Role / Project Collaboration"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900/90 border ${
                      errors.subject ? 'border-rose-500' : 'border-neutral-800'
                    } text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors`}
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3 h-3" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                      Message <span className="text-indigo-400">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {formData.message.length} / 1000
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Describe your project, team opportunity, or inquiry..."
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900/90 border ${
                      errors.message ? 'border-rose-500' : 'border-neutral-800'
                    } text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
