/**
 * Centralized Icon Component
 * Provides consistent icon styling across the entire application
 * Uses Lucide React for clean, modern icons
 */

import {
  Calendar,
  MapPin,
  Tag,
  CreditCard,
  Target,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Star,
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Wrench,
  Car,
  Disc,
  Wind,
  Settings,
  Gauge,
  Shield,
  Zap,
  Truck,
  User,
  Users,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Home,
  Building,
  BadgeCheck,
  Award,
  TrendingUp,
  DollarSign,
  BarChart3,
  CalendarDays,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Download,
  Upload,
  Camera,
  Image,
  Video,
  FileText,
  Clipboard,
  Bell,
  Settings as SettingsIcon,
  LogIn,
  UserPlus,
  CheckSquare,
  Square,
  Minus,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Share2,
  Heart,
  Bookmark,
  Flag,
  HelpCircle,
  CircleHelp,
} from 'lucide-react';

// Icon size presets
const SIZE_PRESETS = {
  xs: { size: 12, strokeWidth: 2.5 },
  sm: { size: 16, strokeWidth: 2 },
  md: { size: 20, strokeWidth: 2 },
  lg: { size: 24, strokeWidth: 1.5 },
  xl: { size: 32, strokeWidth: 1.5 },
  '2xl': { size: 40, strokeWidth: 1.5 },
  '3xl': { size: 48, strokeWidth: 1 },
};

/**
 * Icon Component
 * 
 * @param {string} name - Icon name (e.g., 'calendar', 'mapPin', 'phone')
 * @param {string|number} size - Icon size in pixels or preset (xs, sm, md, lg, xl, 2xl, 3xl)
 * @param {string} color - Icon color (Tailwind class or hex)
 * @param {number} strokeWidth - Stroke width override
 * @param {string} className - Additional CSS classes
 * @param {boolean} animated - Whether to add hover animation
 */
function Icon({ 
  name, 
  size = 'md', 
  color = 'currentColor', 
  strokeWidth,
  className = '', 
  animated = false,
  ...props 
}) {
  // Get size configuration
  const sizeConfig = typeof size === 'string' ? SIZE_PRESETS[size] : { size, strokeWidth: strokeWidth || 2 };
  const finalStrokeWidth = strokeWidth || sizeConfig.strokeWidth;
  
  // Icon map
  const iconMap = {
    calendar: Calendar,
    calendarDays: CalendarDays,
    mapPin: MapPin,
    tag: Tag,
    creditCard: CreditCard,
    target: Target,
    clock: Clock,
    phone: Phone,
    mail: Mail,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    menu: Menu,
    x: X,
    star: Star,
    check: Check,
    checkCircle: CheckCircle,
    alertCircle: AlertCircle,
    alertTriangle: AlertTriangle,
    info: Info,
    wrench: Wrench,
    car: Car,
    disc: Disc,
    wind: Wind,
    settings: Settings,
    gauge: Gauge,
    shield: Shield,
    zap: Zap,
    truck: Truck,
    user: User,
    users: Users,
    logOut: LogOut,
    plus: Plus,
    edit: Edit,
    trash: Trash2,
    trash2: Trash2,
    search: Search,
    filter: Filter,
    eye: Eye,
    eyeOff: EyeOff,
    arrowRight: ArrowRight,
    arrowLeft: ArrowLeft,
    home: Home,
    building: Building,
    badgeCheck: BadgeCheck,
    award: Award,
    trendingUp: TrendingUp,
    dollarSign: DollarSign,
    barChart: BarChart3,
    barChart3: BarChart3,
    message: MessageSquare,
    messageSquare: MessageSquare,
    thumbsUp: ThumbsUp,
    thumbsDown: ThumbsDown,
    refresh: RefreshCw,
    refreshCw: RefreshCw,
    download: Download,
    upload: Upload,
    camera: Camera,
    image: Image,
    video: Video,
    fileText: FileText,
    clipboard: Clipboard,
    bell: Bell,
    settingsIcon: SettingsIcon,
    login: LogIn,
    logIn: LogIn,
    userPlus: UserPlus,
    checkSquare: CheckSquare,
    square: Square,
    minus: Minus,
    maximize: Maximize2,
    maximize2: Maximize2,
    minimize: Minimize2,
    minimize2: Minimize2,
    externalLink: ExternalLink,
    copy: Copy,
    share: Share2,
    share2: Share2,
    heart: Heart,
    bookmark: Bookmark,
    flag: Flag,
    help: HelpCircle,
    helpCircle: HelpCircle,
    circleHelp: CircleHelp,
    wrench: Wrench,
  };

  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  // Build className
  const iconClassName = `${animated ? 'transition-transform hover:scale-110' : ''} ${className}`.trim();

  return (
    <LucideIcon
      size={sizeConfig.size}
      strokeWidth={finalStrokeWidth}
      color={color}
      className={iconClassName}
      {...props}
    />
  );
}

export default Icon;
export { SIZE_PRESETS };
