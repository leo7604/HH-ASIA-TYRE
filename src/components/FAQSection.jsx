import { useState } from 'react';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What tire brands do you carry?",
      answer: "We carry premium tire brands including Cooper, Goodyear, Michelin, GT Radial, and other leading manufacturers. Each branch has different stock availability, so we recommend calling ahead or booking an appointment to ensure we have your desired tires in stock."
    },
    {
      question: "Do I need an appointment for service?",
      answer: "While we accept walk-ins, we highly recommend booking an appointment to minimize wait times. Our online booking system makes it easy to schedule your preferred date and time. Same-day appointments may be available depending on branch capacity."
    },
    {
      question: "How long does a typical oil change take?",
      answer: "A standard oil change typically takes 30-45 minutes. However, this may vary depending on your vehicle type and current workload. We offer complimentary waiting areas with WiFi, or you can drop off your vehicle and return later."
    },
    {
      question: "Do you offer warranties on your services?",
      answer: "Yes! All our services come with warranties. Tire installations include free rotation and balancing for life. Parts and labor warranties vary by service type - typically ranging from 12 months/12,000 miles to 24 months/24,000 miles. Ask your service advisor for specific warranty details."
    },
    {
      question: "Can I watch my service being performed?",
      answer: "Absolutely! We have comfortable viewing areas where you can watch our technicians work on your vehicle. For safety reasons, you'll need to remain in the designated customer area, but you're welcome to observe the entire process."
    },
    {
      question: "Do you provide shuttle service or have alternative transportation options?",
      answer: "Select branches offer complimentary shuttle service within a 5-mile radius. We also have partnerships with local ride-share companies for discounted rates. Please check with your specific branch about available transportation options."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payments (GCash, Maya). We also offer financing options through our partner banks for larger repairs and purchases."
    },
    {
      question: "Do you service all vehicle makes and models?",
      answer: "Yes, our certified technicians are trained to work on all domestic and imported vehicles, including cars, SUVs, trucks, and light commercial vehicles. We have the equipment and expertise for Asian, European, and American vehicles."
    },
    {
      question: "How often should I rotate my tires?",
      answer: "We recommend rotating your tires every 5,000 to 8,000 kilometers, or with every other oil change. Regular rotation ensures even tire wear, extends tire life, and improves vehicle handling. Check your owner's manual for manufacturer-specific recommendations."
    },
    {
      question: "Do you offer fleet or corporate discounts?",
      answer: "Yes! We offer special pricing for fleet accounts, corporate clients, and bulk service orders. Our fleet program includes dedicated account management, priority scheduling, detailed reporting, and volume discounts. Contact our business development team for a customized quote."
    },
    {
      question: "What should I do if my car breaks down near one of your locations?",
      answer: "Call our 24/7 emergency hotline at 1-800-HH-ASIA. We offer roadside assistance including tire changes, battery jump-starts, fuel delivery, and towing to our nearest branch. HH Asia members receive priority dispatch and discounted rates."
    },
    {
      question: "How do I know if I need new brakes?",
      answer: "Common signs include squeaking or grinding noises, vibration when braking, longer stopping distances, or the brake warning light on your dashboard. We offer free brake inspections and will show you exactly what needs attention before any work begins."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-gradient-to-b from-brand-black to-brand-card">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-3">
            Common Questions
          </div>
          <h2 className="font-display font-bold uppercase text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Frequently Asked <span className="text-brand-yellow">Questions</span>
          </h2>
          <p className="text-brand-textMuted text-lg max-w-2xl mx-auto">
            Find quick answers to the most common questions about our services.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-[1100px] mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-brand-card border border-brand-border rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-yellow/40"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-start justify-between gap-4 group"
              >
                <div className="flex-1">
                  <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-brand-yellow transition-colors">
                    {faq.question}
                  </h3>
                </div>
                <div className={`w-8 h-8 rounded-full bg-brand-yellow/10 border border-brand-yellow/25 flex items-center justify-center flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <svg className="w-4 h-4 text-brand-yellow" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Expanded Answer */}
              {openIndex === index && (
                <div className="px-6 pb-6 animate-fade-up">
                  <div className="pt-4 border-t border-brand-border">
                    <p className="text-brand-textMuted leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-brand-textMuted mb-6">
            Still have questions? We're here to help!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-brand-yellow text-black px-8 py-3.5 rounded-md font-display font-bold uppercase tracking-wider text-sm hover:bg-yellow-400 transition-all shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:-translate-y-0.5"
            >
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="tel:18004427421"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-brand-yellow text-brand-yellow px-8 py-3 rounded-md font-display font-bold uppercase tracking-wider text-sm hover:bg-brand-yellow/10 transition-all"
            >
              📞 1-800-HH-ASIA
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
