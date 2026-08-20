'use client';

export default function StickyMobileCta() {
  return (
    <div className="md:hidden fixed bottom-md right-md z-50">
      <a className="bg-secondary text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95" href="/registro">
        <span className="material-symbols-outlined">rocket_launch</span>
      </a>
    </div>
  );
}
