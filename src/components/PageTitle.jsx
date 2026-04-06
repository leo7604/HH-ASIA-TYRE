import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    // Define page-specific titles and descriptions
    const pageMeta = {
      '/': {
        title: 'Best Tyre Shop Philippines | HH Asia Auto Service Manila',
        description: 'Premier tyre and auto service center in Metro Manila, Cavite, and Ilocos Norte. Expert oil change, brakes, batteries, and more. Book your appointment online today!'
      },
      '/branches': {
        title: 'Our Branches | HH Asia Tyre Service Centers Philippines',
        description: 'Find HH Asia Tyre branches near you in Alabang, Bicutan, Bacoor, Sucat, and Laoag. Professional auto service centers with certified technicians.'
      },
      '/book': {
        title: 'Book Auto Service Online | HH Asia Tyre Appointment',
        description: 'Schedule your vehicle service appointment online. Fast booking for oil change, tyre installation, brake repair, and more at HH Asia Tyre.'
      },
      '/confirmation': {
        title: 'Booking Confirmed | HH Asia Tyre Service',
        description: 'Your appointment has been confirmed. View your booking details and next steps.'
      }
    };

    const meta = pageMeta[location.pathname] || pageMeta['/'];
    
    // Update document title
    document.title = meta.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = meta.description;

  }, [location.pathname]);

  return null;
}

export default PageTitle;
