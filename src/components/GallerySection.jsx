import { useState } from 'react';
import { galleryImages } from '../data/mockData';

function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Facility', 'Service', 'Team', 'Products', 'Before/After'];

  const filteredImages = filter === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === filter);

  return (
    <section id="gallery" className="py-24 px-6 bg-gradient-to-b from-brand-black to-brand-card">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-brand-yellow mb-3">
            Our Work
          </div>
          <h2 className="font-display font-bold uppercase text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Photo <span className="text-brand-yellow">Gallery</span>
          </h2>
          <p className="text-brand-textMuted max-w-[520px] mx-auto leading-relaxed">
            Take a look at our facilities, services, and satisfied customers.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2 rounded-md font-medium transition-all text-sm ${
                filter === category
                  ? 'bg-brand-yellow text-black shadow-[0_0_24px_rgba(255,215,0,0.3)]'
                  : 'bg-brand-raised text-brand-textMuted hover:bg-brand-overlay border border-brand-border hover:border-brand-yellow/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-[1100px] mx-auto">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-brand-card border border-brand-border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-brand-yellow/40"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display font-bold text-white text-sm uppercase">{image.alt}</p>
                  <p className="text-brand-textMuted text-xs">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-up"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-brand-textMuted hover:text-white p-2"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="font-display font-bold text-white text-lg uppercase">{selectedImage.alt}</p>
              <p className="text-brand-textMuted text-sm">{selectedImage.category}</p>
            </div>

            {/* Navigation */}
            <button
              className="absolute left-6 text-brand-textMuted hover:text-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
                const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                setSelectedImage(galleryImages[prevIndex]);
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-6 text-brand-textMuted hover:text-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
                const nextIndex = (currentIndex + 1) % galleryImages.length;
                setSelectedImage(galleryImages[nextIndex]);
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default GallerySection;
