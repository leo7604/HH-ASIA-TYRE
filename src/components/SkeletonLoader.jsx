function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-brand-card border border-brand-border rounded-xl p-6 animate-pulse">
            <div className="w-14 h-14 bg-brand-raised rounded-xl mb-4"></div>
            <div className="h-4 bg-brand-raised rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-brand-raised rounded w-full mb-2"></div>
            <div className="h-3 bg-brand-raised rounded w-2/3"></div>
          </div>
        );
      
      case 'table-row':
        return (
          <tr className="animate-pulse">
            <td className="px-6 py-4">
              <div className="h-4 bg-brand-raised rounded w-32 mb-2"></div>
              <div className="h-3 bg-brand-raised rounded w-24"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 bg-brand-raised rounded w-40"></div>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <div className="h-6 bg-brand-raised rounded w-20"></div>
                <div className="h-6 bg-brand-raised rounded w-20"></div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 bg-brand-raised rounded w-24 mb-1"></div>
              <div className="h-3 bg-brand-raised rounded w-16"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-6 bg-brand-raised rounded-full w-20"></div>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <div className="h-8 bg-brand-raised rounded w-16"></div>
                <div className="h-8 bg-brand-raised rounded w-16"></div>
              </div>
            </td>
          </tr>
        );
      
      case 'service-card':
        return (
          <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden animate-pulse">
            <div className="p-6 pb-4">
              <div className="w-14 h-14 bg-brand-raised rounded-xl mb-4"></div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 bg-brand-raised rounded-full w-20"></div>
                <div className="h-5 bg-brand-raised rounded-full w-24"></div>
              </div>
              <div className="h-6 bg-brand-raised rounded w-32 mb-2"></div>
              <div className="h-3 bg-brand-raised rounded w-full mb-2"></div>
              <div className="h-3 bg-brand-raised rounded w-2/3"></div>
            </div>
            <div className="px-6 pb-6">
              <div className="h-4 bg-brand-raised rounded w-32"></div>
            </div>
          </div>
        );
      
      case 'branch-card':
        return (
          <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-brand-raised"></div>
            <div className="p-6">
              <div className="h-6 bg-brand-raised rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-brand-raised rounded w-1/2 mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-brand-raised rounded w-full"></div>
                <div className="h-3 bg-brand-raised rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-brand-raised rounded-lg"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-brand-raised rounded w-full"></div>
            <div className="h-4 bg-brand-raised rounded w-5/6"></div>
            <div className="h-4 bg-brand-raised rounded w-4/6"></div>
          </div>
        );
      
      case 'image':
        return (
          <div className="bg-brand-raised animate-pulse rounded-lg" style={{ minHeight: '200px' }}></div>
        );
      
      default:
        return (
          <div className="h-20 bg-brand-raised rounded animate-pulse"></div>
        );
    }
  };

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            {renderSkeleton()}
          </div>
        ))}
      </>
    );
  }

  return renderSkeleton();
}

export default SkeletonLoader;
