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
    name: "tires",
    icon: "tyre",
    description: "Premium tyre sales, installation, rotation, and repair services",
    link: "/services/tires",
    category: "tires"
  },
  {
    id: 2,
    name: "Oil Change",
    icon: "oil",
    description: "Full synthetic, blend, and conventional oil change services",
    link: "/services/oil-change",
    category: "maintenance"
  },
  {
    id: 3,
    name: "Batteries",
    icon: "battery",
    description: "Battery testing, replacement, and charging system diagnostics",
    link: "/services/batteries",
    category: "maintenance"
  },
  {
    id: 4,
    name: "Brakes",
    icon: "brakes",
    description: "Brake inspection, pad replacement, rotor service, and fluid flush",
    link: "/services/brakes",
    category: "auto-repair"
  },
  {
    id: 5,
    name: "Clutch",
    icon: "clutch",
    description: "Clutch inspection, adjustment, and complete replacement services",
    link: "/services/clutch",
    category: "auto-repair"
  },
  {
    id: 6,
    name: "Maintenance",
    icon: "maintenance",
    description: "Scheduled maintenance, tune-ups, and preventive care",
    link: "/services/maintenance",
    category: "maintenance"
  },
  {
    id: 7,
    name: "Car Aircon",
    icon: "aircon",
    description: "AC inspection, refrigerant recharge, and repair services",
    link: "/services/aircon",
    category: "auto-repair"
  },
  {
    id: 8,
    name: "Suspension",
    icon: "suspension",
    description: "Shock, strut, and suspension system inspection and repair",
    link: "/services/suspension",
    category: "auto-repair"
  },
  {
    id: 9,
    name: "Transmission",
    icon: "transmission",
    description: "Transmission fluid service, diagnostics, and repair",
    link: "/services/transmission",
    category: "auto-repair"
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
    image: "https://images.unsplash.com/photo-1625043484550-df60256f6ea5?w=1200&h=600&fit=crop&q=80"
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
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=600&fit=crop&q=80"
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
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=600&fit=crop&q=80"
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
    image: "https://images.unsplash.com/photo-1552857859-8462d3d17dec?w=1200&h=600&fit=crop&q=80"
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
    image: "https://images.unsplash.com/photo-1597762696664-2c8e71c46f5d?w=1200&h=600&fit=crop&q=80"
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
    image: "https://images.unsplash.com/photo-1530906358829-e84b2769270f?w=1200&h=600&fit=crop&q=80"
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
  // Facility Photos
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop&q=80",
    alt: "Modern Service Bay",
    category: "Facility"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop&q=80",
    alt: "Clean Workshop Area",
    category: "Facility"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1562916172-27f18dc39f6c?w=600&h=400&fit=crop&q=80",
    alt: "Customer Waiting Area",
    category: "Facility"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1552857859-8462d3d17dec?w=600&h=400&fit=crop&q=80",
    alt: "Professional Equipment",
    category: "Facility"
  },
  
  // Service Photos
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1578844251758-2f71da645217?w=600&h=400&fit=crop&q=80",
    alt: "Tyre Installation Service",
    category: "Service"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop&q=80",
    alt: "Oil Change Service",
    category: "Service"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1552857859-8462d3d17dec?w=600&h=400&fit=crop&q=80",
    alt: "Brake Inspection",
    category: "Service"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1504222490245-4c67adbe8729?w=600&h=400&fit=crop&q=80",
    alt: "Battery Replacement",
    category: "Service"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1597762696664-2c8e71c46f5d?w=600&h=400&fit=crop&q=80",
    alt: "Wheel Alignment",
    category: "Service"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1530906358829-e84b2769270f?w=600&h=400&fit=crop&q=80",
    alt: "Suspension Repair",
    category: "Service"
  },
  
  // Team Photos
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop&q=80",
    alt: "Certified Technicians",
    category: "Team"
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&q=80",
    alt: "Expert Mechanics at Work",
    category: "Team"
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop&q=80",
    alt: "Friendly Service Staff",
    category: "Team"
  },
  
  // Products & Brands
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1578844251758-2f71da645217?w=600&h=400&fit=crop&q=80",
    alt: "Premium Tyre Brands",
    category: "Products"
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop&q=80",
    alt: "Quality Motor Oil",
    category: "Products"
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1597762696664-2c8e71c46f5d?w=600&h=400&fit=crop&q=80",
    alt: "Car Parts & Accessories",
    category: "Products"
  },
  
  // Before/After
  {
    id: 17,
    src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop&q=80",
    alt: "Tyre Replacement Before After",
    category: "Before/After"
  },
  {
    id: 18,
    src: "https://images.unsplash.com/photo-1504222490245-4c67adbe8729?w=600&h=400&fit=crop&q=80",
    alt: "Engine Service Results",
    category: "Before/After"
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
