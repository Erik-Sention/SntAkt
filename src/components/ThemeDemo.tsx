'use client';

import { useTheme } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

export default function ThemeDemo() {
  const { theme } = useTheme();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
          Tema-demo: {theme === 'light' ? 'Ljust tema' : 'Mörkt tema'}
        </h1>
        
        <div className="flex items-center space-x-4">
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            Ändra tema:
          </span>
          <ThemeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-8">
          {/* Kort för Knappar */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Knappar</h2>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary">Primär</button>
              <button className="btn btn-secondary">Sekundär</button>
              <button className="btn btn-outline">Kontur</button>
              <button className="btn btn-primary" disabled>Inaktiverad</button>
            </div>
          </div>
          
          {/* Kort för Formulärelement */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Formulärelement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">
                  Text input
                </label>
                <input type="text" placeholder="Skriv här..." className="w-full" />
              </div>
              <div>
                <label className="block text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">
                  Urval
                </label>
                <select className="w-full">
                  <option>Alternativ 1</option>
                  <option>Alternativ 2</option>
                  <option>Alternativ 3</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Kort för Färger */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Färgpalett</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded bg-light-primary dark:bg-dark-primary text-white">Primär</div>
              <div className="p-4 rounded bg-light-accent dark:bg-dark-accent text-white">Accent</div>
              <div className="p-4 rounded bg-light-success dark:bg-dark-success text-white">Framgång</div>
              <div className="p-4 rounded bg-light-error dark:bg-dark-error text-white">Fel</div>
              <div className="p-4 rounded bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border">Bakgrund</div>
              <div className="p-4 rounded bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">Yta</div>
            </div>
          </div>
          
          {/* Kort för Text */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Typografi</h2>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Rubrik 1</h1>
              <h2 className="text-xl font-semibold">Rubrik 2</h2>
              <h3 className="text-lg font-medium">Rubrik 3</h3>
              <p className="text-light-text dark:text-dark-text">
                Brödtext med <a href="#" className="text-light-primary dark:text-dark-primary">länk</a>
              </p>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                Sekundär text i mindre storlek
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 