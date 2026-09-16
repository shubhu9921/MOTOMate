import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does doorstep car washing work?",
      answer: "You simply book a slot online. Our trained professionals will arrive at your location with all the necessary equipment, cleaning products, and even water/power supply if needed, to wash your car right where it's parked."
    },
    {
      question: "How long does a wash take?",
      answer: "A standard exterior wash takes about 45-60 minutes. Premium packages involving interior detailing can take anywhere from 1.5 to 3 hours depending on the vehicle's condition."
    },
    {
      question: "Do I need to provide water?",
      answer: "No, our vans are equipped with their own water tanks and generators. However, if you have a tap nearby, it helps us conserve our onboard supply, but it's completely optional."
    },
    {
      question: "Can I reschedule my booking?",
      answer: "Yes! You can easily reschedule your booking up to 2 hours before the scheduled time slot without any penalty directly from your dashboard."
    },
    {
      question: "Which areas do you serve?",
      answer: "Currently, we operate in major metropolitan areas. You can use the 'Check Service Area' feature on our website by entering your pincode to confirm availability."
    },
    {
      question: "What payment methods are supported?",
      answer: "We accept all major credit/debit cards, UPI, and digital wallets. Payment is processed securely online when you book, or you can choose to pay after the service is completed."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 tracking-wide uppercase mb-2">Got Questions?</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-colors ${openIndex === index ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-bold text-slate-900 text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 pt-0">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
