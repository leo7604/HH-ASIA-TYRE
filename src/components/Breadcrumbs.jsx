import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  
  // Define breadcrumb mapping
  const breadcrumbMap = {
    '/': { label: 'Home', path: '/' },
    '/branches': { label: 'Our Branches', path: '/branches' },
    '/book': { label: 'Book Service', path: '/book' },
    '/confirmation': { label: 'Confirmation', path: '/confirmation' }
  };

  // Build breadcrumbs array
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs = [breadcrumbMap['/']];
  
  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    if (breadcrumbMap[currentPath]) {
      breadcrumbs.push(breadcrumbMap[currentPath]);
    }
  });

  // Don't show on homepage
  if (location.pathname === '/') return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="py-3 px-6 bg-brand-black border-b border-brand-border sticky top-0 z-30"
      style={{ backgroundColor: '#000000' }}
    >
      <ol className="flex items-center gap-2 max-w-[1280px] mx-auto text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {index > 0 && (
              <svg 
                className="w-4 h-4 text-brand-textMuted flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <Link 
              to={crumb.path}
              className={`${
                index === breadcrumbs.length - 1 
                  ? 'text-brand-yellow font-semibold' 
                  : 'text-brand-textMuted hover:text-white transition-colors'
              }`}
              aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
            >
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
