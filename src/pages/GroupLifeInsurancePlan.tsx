import ProgressItem from '@/components/ui/progressItem';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';
import QuotationDialog from '@/components/ui/QuotationDialog';


interface GroupLifeInsurancePlanProps {
  onContinue?: () => void;
  onPrevious?: () => void;
  setFormValid?: (sectionId: string, isValid: boolean) => void;
  companyData?: {
    name: string;
    email: string;
    industry: string;
    region: string;
  };
  employeeData?: {
    coverage: number;
    ageRange: [number, number];
    salaryRange: {
      min: number;
      max: number;
    };
  };
  onEditSection?: (section: string) => void;
}

interface FormErrors {
  coverageLevel?: string;
  calculationMethod?: string;
  multiplier?: string;
}

const GroupLifeInsurancePlan: React.FC<GroupLifeInsurancePlanProps> = ({ 
  onPrevious,
  setFormValid = () => {},
  companyData = {
    name: "Acme Corp",
    email: "contact@acmecorp.com",
    industry: "tech",
    region: "north"
  },
  employeeData = {
    coverage: 25,
    ageRange: [25, 45],
    salaryRange: {
      min: 50000,
      max: 120000
    }
  },
  onEditSection = () => {}
}) => {
    // Form state
    const [coverageLevel, setCoverageLevel] = useState("");
    const [calculationMethod, setCalculationMethod] = useState("");
    const [multiplier, setMultiplier] = useState("x2");
    const [addOns, setAddOns] = useState({
      accidentalDeath: false,
      criticalIllness: false,
      waiverOfPremium: false
    });
    
    // Quotation dialog state
    const [showQuotation, setShowQuotation] = useState(false);
    
    // Validation state
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState({
      coverageLevel: false,
      calculationMethod: false,
      multiplier: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Validate form fields
    const validateForm = () => {
      const newErrors: FormErrors = {};
      
      if (!coverageLevel) {
        newErrors.coverageLevel = "Please select a coverage level";
      }
      
      if (!calculationMethod) {
        newErrors.calculationMethod = "Please select a calculation method";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    // Check form validity whenever inputs change
    useEffect(() => {
      if (isSubmitting || Object.values(touched).some(t => t)) {
        const isValid = validateForm();
        setFormValid("insurance-plan", isValid);
      }
    }, [coverageLevel, calculationMethod, multiplier, touched, isSubmitting]);
    
    // Mark field as touched when user interacts with it
    const handleBlur = (field: keyof typeof touched) => {
      setTouched(prev => ({ ...prev, [field]: true }));
    };
    
    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Mark all fields as touched
      const allTouched = Object.keys(touched).reduce((acc, key) => {
        acc[key as keyof typeof touched] = true;
        return acc;
      }, {} as typeof touched);
      setTouched(allTouched);
      
      const isValid = validateForm();
      
      if (isValid) {
        setShowQuotation(true);
      }
    };
    
    // Handle section editing from the quotation dialog
    const handleEditSection = (sectionId: string) => {
      // Close the dialog
      setShowQuotation(false);
      
      // Call the parent's onEditSection method
      onEditSection(sectionId);
    };

    // Combined data for quotation dialog
    const formData = {
      company: companyData,
      employees: employeeData,
      insurance: {
        coverageLevel,
        calculationMethod,
        multiplier,
        addOns
      }
    };
    
    return (
        <div className="w-full md:w-[80%] lg:w-[70%] xl:w-[50%] mx-auto px-4 md:px-0 mt-4 md:mt-0">
            <div className="mb-6 md:mb-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <ProgressItem
                        icon={<Heart />}
                        label='Group Life Insurance Plan'
                        hint='Tailor coverage to match your teams needs'
                        variant='step'
                        state='active'
                    />
                    <Button 
                        variant="outline"
                        onClick={onPrevious}
                        disabled={!onPrevious}
                        className="self-end sm:self-auto"
                    >
                        Previous
                    </Button>
                </div>
            </div>

            <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-8">
                            <div className="space-y-4">
                                <h2 className={`text-lg font-medium ${errors.coverageLevel && touched.coverageLevel ? "text-destructive" : "text-foreground"}`}>
                                  1. Choose Your Coverage Level
                                </h2>
                                
                                <RadioGroup 
                                  value={coverageLevel} 
                                  onValueChange={(value) => {
                                    setCoverageLevel(value);
                                    handleBlur('coverageLevel');
                                  }}
                                >
                                    <div className={`border rounded-md p-4 mb-3 ${errors.coverageLevel && touched.coverageLevel ? "border-destructive" : "border-border hover:border-primary"}`}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="basic" id="basic" />
                                            <Label htmlFor="basic" className="font-medium">Basic Plan</Label>
                                        </div>
                                        <div className="ml-6 mt-2">
                                            <p>1x salary death benefit</p>
                                            <p className="text-sm text-muted-foreground">Ideal for lean budgets</p>
                                            <p className="font-medium mt-1">Premium: $1,000/month</p>
                                        </div>
                                    </div>
                                    
                                    <div className={`border rounded-md p-4 ${errors.coverageLevel && touched.coverageLevel ? "border-destructive" : "border-border hover:border-primary"}`}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="comprehensive" id="comprehensive" />
                                            <Label htmlFor="comprehensive" className="font-medium">Comprehensive Plan</Label>
                                        </div>
                                        <div className="ml-6 mt-2">
                                            <p>2x salary death benefit + optional extras</p>
                                            <p className="text-sm text-muted-foreground">Best for full financial security</p>
                                            <p className="font-medium mt-1">Premium: $2,000/month</p>
                                        </div>
                                    </div>
                                </RadioGroup>
                                
                                {errors.coverageLevel && touched.coverageLevel && (
                                  <p className="text-xs text-destructive mt-1">{errors.coverageLevel}</p>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <h2 className={`text-lg font-medium ${errors.calculationMethod && touched.calculationMethod ? "text-destructive" : "text-foreground"}`}>
                                  2. How should benefits be calculated?
                                </h2>
                                <Select
                                  value={calculationMethod}
                                  onValueChange={(value) => {
                                    setCalculationMethod(value);
                                    handleBlur('calculationMethod');
                                  }}
                                >
                                    <SelectTrigger 
                                      className={`w-full ${errors.calculationMethod && touched.calculationMethod ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}`}
                                    >
                                        <SelectValue placeholder="Select calculation method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="salary-linked">Salary-Linked</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                {errors.calculationMethod && touched.calculationMethod && (
                                  <p className="text-xs text-destructive mt-1">{errors.calculationMethod}</p>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span>All employees:</span>
                                    <Select 
                                      defaultValue="x2"
                                      value={multiplier}
                                      onValueChange={setMultiplier}
                                    >
                                        <SelectTrigger className="w-24 border-border focus-visible:ring-primary">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="x1">x1</SelectItem>
                                            <SelectItem value="x2">x2</SelectItem>
                                            <SelectItem value="x3">x3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span>annual salary</span>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                    Example: $60,000 salary → $120,000 coverage
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <h2 className="text-lg font-medium text-foreground">3. Boost coverage with add-ons</h2>
                                
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center space-x-2">
                                            <span>Accidental Death (AD&D)</span>
                                            <div className="rounded-full border border-border w-5 h-5 flex items-center justify-center text-xs text-muted-foreground">?</div>
                                        </div>
                                        <div className="flex justify-between   space-x-3 mt-1 sm:mt-0">
                                            <span className="text-sm text-muted-foreground">+$0.15/employee/month</span>
                                            <Switch 
                                              id="add1" 
                                              checked={addOns.accidentalDeath}
                                              onCheckedChange={(checked) => 
                                                setAddOns(prev => ({ ...prev, accidentalDeath: checked }))
                                              }
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center space-x-2">
                                            <span>Critical Illness</span>
                                            <div className="rounded-full border border-border w-5 h-5 flex items-center justify-center text-xs text-muted-foreground">?</div>
                                        </div>
                                        <div className="flex justify-between   space-x-3 mt-1 sm:mt-0">
                                            <span className="text-sm text-muted-foreground">$0.30/employee/month</span>
                                            <Switch 
                                              id="add2" 
                                              checked={addOns.criticalIllness}
                                              onCheckedChange={(checked) => 
                                                setAddOns(prev => ({ ...prev, criticalIllness: checked }))
                                              }
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center space-x-2">
                                            <span>Waiver of Premium</span>
                                            <div className="rounded-full border border-border w-5 h-5 flex items-center justify-center text-xs text-muted-foreground">?</div>
                                        </div>
                                        <div className="flex justify-between  space-x-3 mt-1 sm:mt-0 ">
                                            <span className="text-sm text-muted-foreground">+$0.10/employee/month</span>
                                            <Switch 
                                              id="add3" 
                                              checked={addOns.waiverOfPremium}
                                              onCheckedChange={(checked) => 
                                                setAddOns(prev => ({ ...prev, waiverOfPremium: checked }))
                                              }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="bg-secondary/30 border-t border-border">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/80 text-primary-foreground" 
                      onClick={handleSubmit}
                      type="submit"
                    >
                        Generate Quotation
                    </Button>
                </CardFooter>
            </Card>
            
            {/* Quotation Dialog */}
            {showQuotation && (
              <QuotationDialog 
                isOpen={showQuotation}
                onClose={() => setShowQuotation(false)}
                onEditSection={handleEditSection}
                formData={formData}
              />
            )}
        </div>
    );
};

export default GroupLifeInsurancePlan;