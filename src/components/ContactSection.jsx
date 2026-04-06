import { useState } from 'react';

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', location: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-gradient-to-b from-brand-black to-brand-card">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-3">
            Get In Touch
          </div>
          <h2 className="font-display font-bold uppercase text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Contact <span className="text-brand-yellow">Us</span>
          </h2>
          <p className="text-brand-textMuted text-lg max-w-2xl mx-auto">
            Have questions? Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 max-w-[1100px] mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-brand-card border border-brand-border rounded-xl p-8">
              <h3 className="font-display font-bold text-white text-xl mb-6">Send Us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[0.78rem] font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Full Name <span className="text-brand-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Dela Cruz"
                    className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.78rem] font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                      Email <span className="text-brand-yellow">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.78rem] font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0917 123 4567"
                      className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.78rem] font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Preferred Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white focus:outline-none focus:border-brand-yellow transition-colors"
                  >
                    <option value="">Select a location</option>
                    <option value="alabang">Alabang</option>
                    <option value="bicutan">Bicutan</option>
                    <option value="bacoor">Bacoor</option>
                    <option value="sucat">Sucat</option>
                    <option value="laoag">Laoag</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.78rem] font-bold uppercase tracking-wider text-brand-textMuted mb-2">
                    Message <span className="text-brand-yellow">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-brand-raised border border-brand-border text-white placeholder-brand-textDim focus:outline-none focus:border-brand-yellow transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-yellow text-black py-4 rounded-lg font-display font-bold uppercase tracking-wider hover:bg-yellow-400 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {/* Call Card */}
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <div className="w-10 h-10 bg-brand-yellow/10 border border-brand-yellow/25 rounded-lg flex items-center justify-center text-brand-yellow mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <h4 className="font-display font-bold text-white mb-1">Call Us</h4>
              <a href="tel:18004427421" className="text-lg font-semibold text-brand-yellow hover:underline">
                1-800-HH-ASIA
              </a>
              <p className="text-sm text-brand-textDim">(442-7421)</p>
            </div>

            {/* Email Card */}
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <div className="w-10 h-10 bg-brand-yellow/10 border border-brand-yellow/25 rounded-lg flex items-center justify-center text-brand-yellow mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </div>
              <h4 className="font-display font-bold text-white mb-1">Email Us</h4>
              <a href="mailto:info@hhasia.com" className="text-lg font-semibold text-brand-yellow hover:underline">
                info@hhasia.com
              </a>
              <p className="text-sm text-brand-textDim">We reply within 24 hours</p>
            </div>

            {/* Hours Card */}
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <div className="w-10 h-10 bg-brand-yellow/10 border border-brand-yellow/25 rounded-lg flex items-center justify-center text-brand-yellow mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              </div>
              <h4 className="font-display font-bold text-white mb-1">Business Hours</h4>
              <p className="text-brand-textMuted text-sm">
                <strong className="text-white">Metro Manila & Cavite:</strong><br />
                Monday - Saturday: 8:00 AM - 6:00 PM
              </p>
              <p className="text-brand-textMuted text-sm mt-2">
                <strong className="text-white">Laoag:</strong><br />
                Monday - Saturday: 8:00 AM - 5:00 PM
              </p>
            </div>

            {/* Emergency Banner */}
            <div className="bg-gradient-to-br from-brand-yellow/12 to-brand-yellow/6 border border-brand-yellow/25 rounded-xl p-6 text-center">
              <div className="text-[0.72rem] font-bold uppercase tracking-widest text-brand-yellow mb-2">
                Emergency?
              </div>
              <a href="tel:18004427421" className="font-display font-black text-2xl text-white hover:text-brand-yellow transition-colors">
                1-800-HH-ASIA
              </a>
            </div>

            {/* Map Card */}
            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-brand-border">
                <h4 className="font-display font-bold text-white">Our Locations</h4>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.1234567890123!2d121.12345678901234!3d14.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDA3JzI0LjQiTiAxMjHCsDA3JzI0LjQiRQ!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="HH Asia Tyre Locations"
              />
              <div className="p-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-yellow text-sm font-semibold hover:underline"
                >
                  View on Google Maps
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
