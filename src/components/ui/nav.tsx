import { Building2, Heart, Users, Menu, X } from "lucide-react";
import ProgressItem from "./progressItem";
import Logo from "./logo";
import { useState, useEffect } from 'react';

// Define the types of sections for better type safety
type SectionType = 'company-details' | 'employee-demographic' | 'insurance-plan';

interface NavProps {
  sectionValidation: {
    'company-details': boolean;
    'employee-demographic': boolean;
    'insurance-plan': boolean;
  };
  activeSection: SectionType;
  onSectionClick: (sectionId: string) => void;
}

function Nav({ sectionValidation, activeSection, onSectionClick }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleNavClick = (sectionId: string) => {
    onSectionClick(sectionId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Desktop sidebar
  const navigationItems = (
    <div className='space-y-6'>
      <div 
        onClick={() => handleNavClick('company-details')}
        className="cursor-pointer transition-all duration-200 hover:translate-x-1"
      >
        <ProgressItem
          icon={<Building2 />}
          label="Company Details"
          state={activeSection === 'company-details' ? 'active' : 'inactive'} 
        />
      </div>
      
      <div 
        onClick={() => handleNavClick('employee-demographic')}
        className={`transition-all duration-200 hover:translate-x-1 ${!sectionValidation['company-details'] ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      >
        <ProgressItem
          icon={<Users />}
          label="Employee Demographic"
          state={activeSection === 'employee-demographic' ? 'active' : 'inactive'} 
        />
      </div>
      
      <div 
        onClick={() => handleNavClick('insurance-plan')}
        className={`transition-all duration-200 hover:translate-x-1 ${!sectionValidation['employee-demographic'] || !sectionValidation['company-details'] ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
      >
        <ProgressItem
          icon={<Heart />}
          label="Group Life Insurance Plan"
          state={activeSection === 'insurance-plan' ? 'active' : 'inactive'} 
        />
      </div>
    </div>
  );

  // Mobile version
  if (isMobile) {
    return (
      <>
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 py-6 bg-background border-b border-border z-50 flex items-center justify-between px-4">
          <Logo />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background z-40 pt-24 p-4">
            <div className="mt-4">
              {navigationItems}
            </div>
            <div className="absolute bottom-6 left-0 right-0 pt-4 pb-2 text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} LifeHack by Mario Jere
            </div>
          </div>
        )}

        {/* Spacer for content to start below header */}
        <div className="h-16"></div>
      </>
    );
  }

  // Desktop version
  return (
    <div className='fixed top-0 bottom-0 left-0 pl-8 pr-4 w-1/4 py-[32px] bg-sidebar border-r border-sidebar-border shadow-sm hidden md:flex flex-col'>
      <Logo />
      
      <div className='mt-12 flex-1'>
        {navigationItems}
      </div>
      
      <div className="pt-4 pb-2 text-xs text-sidebar-foreground/60 text-center">
        © {new Date().getFullYear()} LifeHack by Mario Jere
      </div>
    </div>
  );
}

export default Nav;