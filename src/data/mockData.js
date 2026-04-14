export const promotions = [
  {
    id: 1,
    title: "SPRING INTO TYRE SAVINGS",
    subtitle: "FREE 4TH TYRE + FREE INSTALLATION",
    description: "Save up to ₱2,100 instantly when you buy & install 4 Cooper Adventurer All-Season tires",
    validity: "Valid until April 30, 2026",
    image: "https://images.unsplash.com/photo-1578844251758-2f71da645217?w=1200&h=500&fit=crop",
    cta: "Book Now",
    highlight: "FREE 4TH TYRE"
  },
  {
    id: 2,
    title: "BRAKE SERVICE SPECIAL",
    subtitle: "SAVE UP TO ₱5,000",
    description: "On select brake service packages with coupon. Includes free inspection.",
    validity: "Valid until March 31, 2026",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=500&fit=crop",
    cta: "Make Appointment",
    highlight: "SAVE ₱5,000"
  },
  {
    id: 3,
    title: "BATTERY REPLACEMENT",
    subtitle: "SAVE UP TO ₱1,000",
    description: "On free battery test & installation with coupon. All major brands available.",
    validity: "Valid until April 15, 2026",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=500&fit=crop",
    cta: "Learn More",
    highlight: "FREE TEST"
  }
];

export const services = [
  {
    id: 1,
    name: "Tire Installation",
    icon: "tyre",
    description: "Premium tyre sales and professional installation services",
    link: "/services/tires",
    category: "tires",
    duration: "1-2 hours",
    priceRange: "₱2,500 - ₱8,000"
  },
  {
    id: 2,
    name: "Tire Rotation",
    icon: "tyre",
    description: "Rotate tires for even wear and extended tire life",
    link: "/services/tire-rotation",
    category: "tires",
    duration: "30-45 min",
    priceRange: "₱500 - ₱1,000"
  },
  {
    id: 3,
    name: "Wheel Alignment",
    icon: "tyre",
    description: "Precision wheel alignment for better handling and tire life",
    link: "/services/wheel-alignment",
    category: "tires",
    duration: "45-60 min",
    priceRange: "₱1,500 - ₱3,000"
  },
  {
    id: 4,
    name: "Wheel Balancing",
    icon: "tyre",
    description: "Balance wheels to eliminate vibration and ensure smooth ride",
    link: "/services/wheel-balancing",
    category: "tires",
    duration: "30-45 min",
    priceRange: "₱800 - ₱1,500"
  },
  {
    id: 5,
    name: "Brake Service",
    icon: "brakes",
    description: "Complete brake inspection, pad replacement, and fluid service",
    link: "/services/brakes",
    category: "auto-repair",
    duration: "1-3 hours",
    priceRange: "₱2,000 - ₱6,000"
  },
  {
    id: 6,
    name: "Oil Change",
    icon: "oil",
    description: "Full synthetic, blend, and conventional oil change services",
    link: "/services/oil-change",
    category: "maintenance",
    duration: "30-45 min",
    priceRange: "₱800 - ₱2,500"
  },
  {
    id: 7,
    name: "Battery Replacement",
    icon: "battery",
    description: "Battery testing, replacement, and charging system diagnostics",
    link: "/services/batteries",
    category: "maintenance",
    duration: "30-60 min",
    priceRange: "₱3,500 - ₱8,000"
  },
  {
    id: 8,
    name: "Aircon Service",
    icon: "aircon",
    description: "AC inspection, refrigerant recharge, and repair services",
    link: "/services/aircon",
    category: "auto-repair",
    duration: "1-2 hours",
    priceRange: "₱1,500 - ₱4,500"
  },
  {
    id: 9,
    name: "Engine Tune-up",
    icon: "maintenance",
    description: "Complete engine tune-up for optimal performance and efficiency",
    link: "/services/tune-up",
    category: "maintenance",
    duration: "1-2 hours",
    priceRange: "₱2,000 - ₱5,000"
  },
  {
    id: 10,
    name: "Suspension Repair",
    icon: "suspension",
    description: "Shock, strut, and suspension system inspection and repair",
    link: "/services/suspension",
    category: "auto-repair",
    duration: "2-4 hours",
    priceRange: "₱3,000 - ₱12,000"
  },
  {
    id: 11,
    name: "Puncture Repair",
    icon: "tyre",
    description: "Professional tire puncture repair and patching",
    link: "/services/puncture-repair",
    category: "tires",
    duration: "30-45 min",
    priceRange: "₱300 - ₱800"
  },
  {
    id: 12,
    name: "Nitrogen Inflation",
    icon: "tyre",
    description: "Nitrogen tire inflation for better pressure retention",
    link: "/services/nitrogen",
    category: "tires",
    duration: "15-20 min",
    priceRange: "₱200 - ₱500"
  },
  {
    id: 13,
    name: "TPMS Service",
    icon: "tyre",
    description: "Tire Pressure Monitoring System diagnostics and service",
    link: "/services/tpms",
    category: "tires",
    duration: "30-45 min",
    priceRange: "₱500 - ₱1,500"
  },
  {
    id: 14,
    name: "Multi-point Inspection",
    icon: "maintenance",
    description: "Comprehensive vehicle inspection covering all major systems",
    link: "/services/inspection",
    category: "maintenance",
    duration: "45-60 min",
    priceRange: "₱500 - ₱1,000"
  },
  {
    id: 15,
    name: "General Check-up",
    icon: "maintenance",
    description: "General vehicle health assessment and diagnostics",
    link: "/services/checkup",
    category: "maintenance",
    duration: "30-60 min",
    priceRange: "₱500 - ₱1,500"
  }
];

export const serviceCategories = [
  {
    id: "all",
    name: "All Services",
    icon: "grid",
    description: "View all available services"
  },
  {
    id: "tires",
    name: "tires & Wheels",
    icon: "tyre",
    description: "Tyre sales, installation, balancing, and alignment",
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/30"
  },
  {
    id: "auto-repair",
    name: "Auto Repair",
    icon: "wrench",
    description: "Brakes, clutch, suspension, and transmission services",
    color: "from-red-500/20 to-red-600/10",
    borderColor: "border-red-500/30"
  },
  {
    id: "maintenance",
    name: "Maintenance",
    icon: "calendar",
    description: "Oil changes, batteries, and scheduled maintenance",
    color: "from-green-500/20 to-green-600/10",
    borderColor: "border-green-500/30"
  }
];

export const specialServices = [
  "Disc Brake Reface",
  "ATF Dialysis",
  "Coolant Dialysis",
  "Aircon Recovery",
  "Engine Scanning",
  "Sludgenizer",
  "EGR Cleaning",
  "Carbon Cleaning"
];

export const locations = [
  {
    id: 1,
    name: "Goodyear High Performance Center",
    area: "Alabang",
    city: "Metro Manila",
    address: "Alabang-Zapote Rd, Las Piñas City, Metro Manila",
    phone: "8842-9148",
    mobile: "0917 623 5362",
    status: "open",
    hours: "Mon-Sat: 8AM-6PM",
    services: ["Tires", "Oil Change", "Batteries", "Brakes", "Maintenance"],
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Alabang-Zapote+Rd+Las+Piñas+City+Metro+Manila",
    image: "/images/alabang_branch_card.jpg",
    rating: 4.8,
    reviewCount: 342,
    serviceBays: [
      { id: 1, name: "Bay 1", type: "General Service", available: true },
      { id: 2, name: "Bay 2", type: "Tire Service", available: true },
      { id: 3, name: "Bay 3", type: "Oil & Lube", available: true }
    ]
  },
  {
    id: 2,
    name: "Goodyear Autocare Bicutan",
    area: "Bicutan",
    city: "Metro Manila",
    address: "118 Doña Soledad Avenue, Don Bosco, Parañaque City",
    phone: "8334-2858",
    mobile: "0917 135 8020",
    status: "coming-soon",
    hours: "Mon-Sat: 8AM-6PM",
    services: ["Tires", "Oil Change", "Batteries"],
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=118+Doña+Soledad+Avenue+Don+Bosco+Parañaque+City",
    image: "/images/bicutan_branchj_card.jpg",
    rating: 4.6,
    reviewCount: 218,
    serviceBays: [
      { id: 1, name: "Bay 1", type: "General Service", available: true },
      { id: 2, name: "Bay 2", type: "Tire Service", available: true }
    ]
  },
  {
    id: 3,
    name: "Goodyear Autocare Bacoor",
    area: "Bacoor",
    city: "Cavite",
    address: "Aguinaldo Highway Nlog II, 4102 Bacoor, Cavite",
    phone: "(046) 417-8415 to 16",
    mobile: "0917 8797 961",
    status: "coming-soon",
    hours: "Mon-Sat: 8AM-6PM",
    services: ["Tires", "Oil Change", "Brakes", "Maintenance"],
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Aguinaldo+Highway+Nlog+II+4102+Bacoor+Cavite",
    image: "/images/bacoor_branch_card.jpg",
    rating: 4.7,
    reviewCount: 289,
    serviceBays: [
      { id: 1, name: "Bay 1", type: "General Service", available: true },
      { id: 2, name: "Bay 2", type: "Oil & Lube", available: true },
      { id: 3, name: "Bay 3", type: "Tire Service", available: true }
    ]
  },
  {
    id: 4,
    name: "Goodyear Autocare Sucat",
    area: "Sucat",
    city: "Metro Manila",
    address: "8277 Dr. A. Santos Avenue, San Isidro, Parañaque",
    phone: "8828-8050",
    mobile: "0977 814 6913",
    status: "coming-soon",
    hours: "Mon-Sat: 8AM-6PM",
    services: ["Tires", "Batteries", "Brakes"],
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=8277+Dr+A+Santos+Avenue+San+Isidro+Parañaque",
    image: "/images/sucat_branch_card.png",
    rating: 4.5,
    reviewCount: 195,
    serviceBays: [
      { id: 1, name: "Bay 1", type: "General Service", available: true },
      { id: 2, name: "Bay 2", type: "Tire Service", available: true }
    ]
  },
  {
    id: 5,
    name: "Tire Asia - GT Radial Sucat",
    area: "Sucat",
    city: "Metro Manila",
    address: "8277 Dr. A. Santos Avenue, San Isidro, Parañaque",
    phone: "8828-8050",
    mobile: "0960 0980 726",
    status: "coming-soon",
    hours: "Mon-Sat: 8AM-6PM",
    services: ["Tires", "Oil Change", "Batteries", "Brakes", "Maintenance"],
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=8277+Dr+A+Santos+Avenue+San+Isidro+Parañaque",
    image: "/images/sucat2_branch_card.png",
    rating: 4.6,
    reviewCount: 167,
    serviceBays: [
      { id: 1, name: "Bay 1", type: "General Service", available: true },
      { id: 2, name: "Bay 2", type: "Tire Service", available: true }
    ]
  },
  {
    id: 6,
    name: "Goodyear Servitek - HH Astro Sales Corporation",
    area: "Laoag City",
    city: "Ilocos Norte",
    address: "John Henry Car Care Center, Bacarra Road, Laoag City, 2900 Ilocos Norte",
    phone: "(077) 772-3456",
    mobile: "0917 123 4567",
    status: "open",
    hours: "Mon-Sat: 8AM-5PM",
    services: ["Tires", "Oil Change", "Batteries", "Brakes", "Maintenance", "Suspension"],
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=18.206733865804356,120.60029019113064",
    image: "/images/laoag_branch card.jpg",
    rating: 4.9,
    reviewCount: 412,
    serviceBays: [
      { id: 1, name: "Bay 1", type: "General Service", available: true },
      { id: 2, name: "Bay 2", type: "Tire Service", available: true },
      { id: 3, name: "Bay 3", type: "Oil & Lube", available: true },
      { id: 4, name: "Bay 4", type: "Brake Service", available: true }
    ]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Michael Santos",
    location: "Alabang",
    rating: 5,
    text: "Excellent service! My Toyota Fortuner got a full tyre replacement and the team was professional and efficient. Highly recommended!",
    date: "March 2026",
    source: "Google Reviews",
    avatar: "MS"
  },
  {
    id: 2,
    name: "Jennifer Reyes",
    location: "Bacoor",
    rating: 5,
    text: "Best auto shop in Cavite! They fixed my car's aircon problem that other shops couldn't diagnose. Fair pricing and honest service.",
    date: "February 2026",
    source: "Facebook",
    avatar: "JR"
  },
  {
    id: 3,
    name: "Carlos Mendoza",
    location: "Laoag",
    rating: 5,
    text: "Finally a reliable tyre shop in Ilocos! Great selection of brands and the installation was quick. Will definitely come back.",
    date: "March 2026",
    source: "Google Reviews",
    avatar: "CM"
  },
  {
    id: 4,
    name: "Anna Lim",
    location: "Sucat",
    rating: 4,
    text: "Good service overall. Had my brakes checked and replaced. Staff was friendly and explained everything clearly.",
    date: "January 2026",
    source: "Google Reviews",
    avatar: "AL"
  },
  {
    id: 5,
    name: "Robert Cruz",
    location: "Bicutan",
    rating: 5,
    text: "Been coming here for 3 years now. Consistent quality service and they always finish on time. The loyalty card perks are great too!",
    date: "February 2026",
    source: "Facebook",
    avatar: "RC"
  }
];

export const galleryImages = [
  // Your Actual Service Photos
  {
    id: 1,
    src: '/images/tire_change.jpg',
    alt: 'Professional Tire Change Service',
    category: 'Service'
  },
  {
    id: 2,
    src: '/images/battery_replacement.jpg',
    alt: 'Battery Replacement Service',
    category: 'Service'
  },
  {
    id: 3,
    src: '/images/brake_inspection.jpg',
    alt: 'Comprehensive Brake Inspection',
    category: 'Service'
  },
  {
    id: 4,
    src: '/images/oil_maintenance.jpg',
    alt: 'Oil Change Maintenance',
    category: 'Service'
  },
  {
    id: 5,
    src: '/images/car_maintenance.jpg',
    alt: 'Complete Car Maintenance',
    category: 'Service'
  },
  {
    id: 6,
    src: '/images/transmission_change.jpg',
    alt: 'Transmission Service',
    category: 'Service'
  }
];

export const advantages = [
  {
    id: 1,
    title: "FREE Vehicle Inspection",
    description: "Comprehensive 21-point inspection with every service to keep your vehicle safe",
    icon: "inspection"
  },
  {
    id: 2,
    title: "Transparent Pricing",
    description: "Written estimates and recommendations before any work begins. No surprises.",
    icon: "pricing"
  },
  {
    id: 3,
    title: "Mobile Appointment Updates",
    description: "Real-time status updates via SMS. Track your service progress from anywhere.",
    icon: "mobile"
  },
  {
    id: 4,
    title: "Certified Technicians",
    description: "ASE-certified professionals with years of experience on all vehicle makes",
    icon: "certified"
  }
];

export const vehicleMakes = [
  "Toyota", "Honda", "Mitsubishi", "Nissan", "Mazda", "Suzuki", 
  "Isuzu", "Ford", "Chevrolet", "Hyundai", "Kia", "Volkswagen",
  "BMW", "Mercedes-Benz", "Audi", "Lexus", "Subaru"
];

export const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM"
];
