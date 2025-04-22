import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Check, Edit, Mail, Download, X } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSection: (section: string) => void;
  formData: {
    company: {
      name: string;
      email: string;
      industry: string;
      region: string;
    };
    employees: {
      coverage: number;
      ageRange: [number, number];
      salaryRange: {
        min: number;
        max: number;
      };
    };
    insurance: {
      coverageLevel: string;
      calculationMethod: string;
      multiplier: string;
      addOns: {
        accidentalDeath: boolean;
        criticalIllness: boolean;
        waiverOfPremium: boolean;
      };
    };
  };
}

const QuotationDialog: React.FC<QuotationDialogProps> = ({
  isOpen,
  onClose,
  onEditSection,
  formData
}) => {
  const calculatePremium = () => {
    // Basic calculation logic
    const basePremium = formData.insurance.coverageLevel === 'basic' ? 1000 : 2000;
    const employeeMultiplier = formData.employees.coverage;
    
    // Calculate add-on costs
    const addOnCost = 
      (formData.insurance.addOns.accidentalDeath ? 0.15 : 0) +
      (formData.insurance.addOns.criticalIllness ? 0.30 : 0) +
      (formData.insurance.addOns.waiverOfPremium ? 0.10 : 0);
    
    const totalAddOnCost = addOnCost * employeeMultiplier;
    
    return basePremium + totalAddOnCost;
  };

  const premium = calculatePremium();
  
  const handleSendEmail = () => {
    toast.success("Quote sent to " + formData.company.email);
    onClose();
  };
  
  // Handles section editing and closes the dialog
  const handleEditSection = (sectionId: string) => {
    onEditSection(sectionId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-lg w-full max-h-[90vh] p-0 overflow-hidden m-auto">
        <DialogHeader className="p-6 pb-2 text-left">
          <DialogTitle className="text-xl font-semibold text-primary">Insurance Quotation</DialogTitle>
          <DialogDescription>
            Here's your customized group life insurance quote for {formData.company.name}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-12rem)] px-6">
          <div className="grid gap-6 py-4">
            {/* Company Details Section */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Company Details</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/90"
                  onClick={() => handleEditSection('company-details')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-muted-foreground">Company Name</div>
                <div>{formData.company.name || "Not specified"}</div>
                
                <div className="text-muted-foreground">Email</div>
                <div>{formData.company.email || "Not specified"}</div>
                
                <div className="text-muted-foreground">Industry</div>
                <div>
                  {formData.company.industry === 'tech' ? 'Technology' : 
                   formData.company.industry === 'finance' ? 'Finance' :
                   formData.company.industry === 'healthcare' ? 'Healthcare' :
                   formData.company.industry === 'retail' ? 'Retail' : 
                   formData.company.industry || "Not specified"}
                </div>
                
                <div className="text-muted-foreground">Region</div>
                <div>
                  {formData.company.region === 'north' ? 'North America' : 
                   formData.company.region === 'europe' ? 'Europe' :
                   formData.company.region === 'asia' ? 'Asia' :
                   formData.company.region === 'oceania' ? 'Oceania' : 
                   formData.company.region || "Not specified"}
                </div>
              </div>
            </div>
            
            {/* Employee Demographics Section */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Employee Demographics</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/90"
                  onClick={() => handleEditSection('employee-demographic')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-muted-foreground">Total Employees</div>
                <div>{formData.employees.coverage || "Not specified"}</div>
                
                <div className="text-muted-foreground">Age Range</div>
                <div>
                  {formData.employees.ageRange[0]} - {formData.employees.ageRange[1]} years
                </div>
                
                <div className="text-muted-foreground">Salary Range</div>
                <div>
                  {formData.employees.salaryRange.min ? `$${formData.employees.salaryRange.min.toLocaleString()}` : "$0"} - 
                  {formData.employees.salaryRange.max ? `$${formData.employees.salaryRange.max.toLocaleString()}` : "$0"} per year
                </div>
              </div>
            </div>
            
            {/* Insurance Plan Section */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Insurance Plan</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/90"
                  onClick={() => handleEditSection('insurance-plan')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-muted-foreground">Coverage Level</div>
                <div>
                  {formData.insurance.coverageLevel === 'basic' ? 'Basic Plan (1x salary death benefit)' : 
                   formData.insurance.coverageLevel === 'comprehensive' ? 'Comprehensive Plan (2x salary death benefit + extras)' :
                   "Not selected"}
                </div>
                
                <div className="text-muted-foreground">Calculation Method</div>
                <div>
                  {formData.insurance.calculationMethod === 'salary-linked' ? 'Salary-Linked' : 
                   formData.insurance.calculationMethod === 'fixed' ? 'Fixed Amount' :
                   "Not selected"}
                </div>
                
                <div className="text-muted-foreground">Salary Multiplier</div>
                <div>{formData.insurance.multiplier || "Not specified"}</div>
                
                <div className="text-muted-foreground">Add-ons</div>
                <div>
                  <ul className="list-none">
                    <li className="flex items-center gap-1">
                      {formData.insurance.addOns.accidentalDeath ? 
                        <Check className="h-4 w-4 text-primary" /> : 
                        <X className="h-4 w-4 text-muted-foreground" />} 
                      Accidental Death (AD&D)
                    </li>
                    <li className="flex items-center gap-1">
                      {formData.insurance.addOns.criticalIllness ? 
                        <Check className="h-4 w-4 text-primary" /> : 
                        <X className="h-4 w-4 text-muted-foreground" />} 
                      Critical Illness
                    </li>
                    <li className="flex items-center gap-1">
                      {formData.insurance.addOns.waiverOfPremium ? 
                        <Check className="h-4 w-4 text-primary" /> : 
                        <X className="h-4 w-4 text-muted-foreground" />} 
                      Waiver of Premium
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Premium Summary */}
            <div className="bg-green-50/70 border border-primary/20 rounded-lg p-4">
              <h3 className="text-lg font-medium text-primary mb-2">Premium Summary</h3>
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Monthly Premium:</span>
                <span className="font-bold text-primary">${premium.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This premium is based on the information provided and is subject to final underwriting approval.
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 py-3 border-t border-border ">
          <div className="w-full flex flex-wrap gap-3 justify-between">
            <Button 
              variant="outline" 
              onClick={onClose}
              size="sm"
            >
              Close
            </Button>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleSendEmail}
                className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                size="sm"
              >
                <Mail className="h-4 w-4" />
                Email Full Qutation
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationDialog;