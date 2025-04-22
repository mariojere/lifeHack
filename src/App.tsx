import React, { useState, useEffect, useRef } from 'react';
import Nav from './components/ui/nav';
import CompanyDetails from './pages/CompanyDetails';
import EmployeeDemographic from './pages/EmployeeDemographic';
import GroupLifeInsurancePlan from './pages/GroupLifeInsurancePlan';
import { Toaster, toast } from 'sonner';

const ProgressExample = () => {
  // Track current active section
  const [activeSection, setActiveSection] = useState<'company-details' | 'employee-demographic' | 'insurance-plan'>('company-details');
  
  // References to each section for scrolling
  const companyDetailsRef = useRef<HTMLElement>(null);
  const employeeDemographicRef = useRef<HTMLElement>(null);
  const insurancePlanRef = useRef<HTMLElement>(null);
  
  // Track if each section should be visible (only show sections that are active or have been completed)
  const [sectionsVisible, setSectionsVisible] = useState({
    'company-details': true,
    'employee-demographic': false,
    'insurance-plan': false
  });
  
  // Form data
  const [companyData, setCompanyData] = useState({
    name: "",
    email: "",
    industry: "",
    region: ""
  });
  
  const [employeeData, setEmployeeData] = useState({
    coverage: 0,
    ageRange: [25, 45] as [number, number],
    salaryRange: {
      min: 0,
      max: 0
    }
  });
  
  // Form validation state
  const [formValidation, setFormValidation] = useState({
    'company-details': false,
    'employee-demographic': false,
    'insurance-plan': false
  });
  
  // Function to update form validation state
  const updateFormValidation = (sectionId: string, isValid: boolean) => {
    setFormValidation(prev => ({
      ...prev,
      [sectionId]: isValid
    }));
  };
  
  // Function to update company data
  const updateCompanyData = (data: typeof companyData) => {
    setCompanyData(data);
  };
  
  // Function to update employee data
  const updateEmployeeData = (data: typeof employeeData) => {
    setEmployeeData(data);
  };
  
  // Get ref for a section by ID
  const getSectionRef = (sectionId: string) => {
    switch(sectionId) {
      case 'company-details':
        return companyDetailsRef;
      case 'employee-demographic':
        return employeeDemographicRef;
      case 'insurance-plan':
        return insurancePlanRef;
      default:
        return null;
    }
  };
  
  // Function to scroll to a section with animation
  const scrollToSection = (sectionId: string) => {
    const ref = getSectionRef(sectionId);
    if (ref?.current) {
      // On mobile, need to account for the fixed header
      const isMobile = window.innerWidth < 768;
      const headerOffset = isMobile ? 64 : 0; // 64px is height of mobile header
      
      // Get current scroll position
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Scroll to the element with offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // Update visibility of sections when validation state changes
  useEffect(() => {
    const newSectionsVisible = {
      'company-details': true,
      'employee-demographic': formValidation['company-details'],
      'insurance-plan': formValidation['company-details'] && formValidation['employee-demographic']
    };
    
    setSectionsVisible(newSectionsVisible);
  }, [formValidation]);
  
  // Scroll to active section when it changes
  useEffect(() => {
    // Small delay to ensure DOM updates before scrolling
    const timer = setTimeout(() => {
      scrollToSection(activeSection);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeSection]);
  
  // Handle continue button clicks - show next section if validation passes
  const handleContinue = (currentSection: string, nextSection: string) => {
    // Check if the current form is valid
    if (formValidation[currentSection as keyof typeof formValidation]) {
      setActiveSection(nextSection as 'company-details' | 'employee-demographic' | 'insurance-plan');
    } else {
      // Trigger form validation by simulating a form submission
      const event = new Event('submit', { bubbles: true });
      const currentForm = document.querySelector(`#${currentSection} form`);
      if (currentForm) {
        currentForm.dispatchEvent(event);
      }
      
      // Show toast notification
      toast.error(`Please complete the ${currentSection.replace('-', ' ')} form before proceeding.`);
    }
  };
  
  // Handle previous button clicks - show previous section
  const handlePrevious = (previousSection: string) => {
    setActiveSection(previousSection as 'company-details' | 'employee-demographic' | 'insurance-plan');
  };
  
  // Handle navigation from sidebar
  const handleNavClick = (sectionId: string) => {
    // Only allow navigation to previous sections or sections where previous forms are valid
    if (sectionId === 'company-details' || 
        (sectionId === 'employee-demographic' && formValidation['company-details']) ||
        (sectionId === 'insurance-plan' && formValidation['company-details'] && formValidation['employee-demographic'])) {
      setActiveSection(sectionId as 'company-details' | 'employee-demographic' | 'insurance-plan');
    } else {
      // Show toast notification
      toast.error("Please complete current sections first.");
    }
  };
  
  // Handle edit section from quotation dialog
  const handleEditSection = (sectionId: string) => {
    setActiveSection(sectionId as 'company-details' | 'employee-demographic' | 'insurance-plan');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Nav 
        sectionValidation={formValidation} 
        activeSection={activeSection}
        onSectionClick={handleNavClick}
      />
      <div className="md:pl-[25%] lg:pl-[25%] w-full">
        {/* Section 1: Company Details - Always visible */}
        <section 
          id="company-details" 
          className="min-h-screen pt-10 md:pt-32 pb-12"
          ref={companyDetailsRef}
        >
          <CompanyDetails 
            onContinue={() => handleContinue('company-details', 'employee-demographic')}
            setFormValid={updateFormValidation}
            updateData={updateCompanyData}
          />
        </section>
        
        {/* Section 2: Employee Demographic - Only visible after company details is validated */}
        {sectionsVisible['employee-demographic'] && (
          <section 
            id="employee-demographic" 
            className="min-h-screen pt-10 md:pt-32 pb-12"
            ref={employeeDemographicRef}
          >
            <EmployeeDemographic 
              onContinue={() => handleContinue('employee-demographic', 'insurance-plan')}
              onPrevious={() => handlePrevious('company-details')}
              setFormValid={updateFormValidation}
              updateData={updateEmployeeData}
            />
          </section>
        )}
        
        {/* Section 3: Group Life Insurance Plan - Only visible after employee demographic is validated */}
        {sectionsVisible['insurance-plan'] && (
          <section 
            id="insurance-plan" 
            className="min-h-screen pt-10 md:pt-32 pb-12"
            ref={insurancePlanRef}
          >
            <GroupLifeInsurancePlan 
              onPrevious={() => handlePrevious('employee-demographic')}
              setFormValid={updateFormValidation}
              companyData={companyData}
              employeeData={employeeData}
              onEditSection={handleEditSection}
            />
          </section>
        )}
      </div>
      
      {/* Sonner Toaster component */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default ProgressExample;