import ProgressItem from '@/components/ui/progressItem';
import { Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';

interface CompanyDetailsProps {
  onContinue?: () => void;
  onPrevious?: () => void;
  setFormValid?: (sectionId: string, isValid: boolean) => void;
  updateData?: (data: {
    name: string;
    email: string;
    industry: string;
    region: string;
  }) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  industry?: string;
  region?: string;
  taxId?: string;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ 
  onContinue, 
  onPrevious,
  setFormValid = () => {},
  updateData = () => {}
}) => {
    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [industry, setIndustry] = useState("");
    const [region, setRegion] = useState("");
    const [taxId, setTaxId] = useState("");
    
    // Validation state
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState({
      name: false,
      email: false,
      industry: false,
      region: false,
      taxId: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Validate form fields
    const validateForm = () => {
      const newErrors: FormErrors = {};
      
      if (!name.trim()) {
        newErrors.name = "Company name is required";
      }
      
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        newErrors.email = "Invalid email address";
      }
      
      if (!industry) {
        newErrors.industry = "Please select an industry";
      }
      
      if (!region) {
        newErrors.region = "Please select a region";
      }
      
      if (!taxId.trim()) {
        newErrors.taxId = "Tax ID is required";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    // Check form validity whenever inputs change
    useEffect(() => {
      if (isSubmitting || Object.values(touched).some(t => t)) {
        const isValid = validateForm();
        setFormValid("company-details", isValid);
        
        // Update parent component with data if valid
        if (isValid) {
          updateData({
            name,
            email,
            industry,
            region
          });
        }
      }
    }, [name, email, industry, region, taxId, touched, isSubmitting]);
    
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
      
      if (isValid && onContinue) {
        updateData({
          name,
          email,
          industry,
          region
        });
        onContinue();
      }
    };
    
    return (
        <div className="w-full md:w-[80%] lg:w-[70%] xl:w-[50%] min-h-screen mx-auto px-4 md:px-0 mt-4 md:mt-0"> 
            <div className="mb-6 md:mb-12">
                <div className="flex justify-between items-center">
                    <ProgressItem
                        icon={<Building2/>}
                        label='Company Details'
                        hint='Tell us about your company – this takes 2 minutes!'
                        variant='step' 
                        state='active'
                    />
                    {/* Previous button (hidden for first step) */}
                    <div className="invisible">
                        <Button 
                            variant="outline"
                            onClick={onPrevious}
                            disabled={!onPrevious}
                        >
                            Previous
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                                  Company name
                                </Label>
                                <Input 
                                  id="name" 
                                  placeholder="company name" 
                                  className={`w-full ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  onBlur={() => handleBlur('name')}
                                />
                                {errors.name && touched.name && (
                                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                                )}
                            </div>
                            
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                                  Work Email
                                </Label>
                                <Input 
                                  id="email" 
                                  placeholder="example@email.com" 
                                  className={`w-full ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  onBlur={() => handleBlur('email')}
                                />
                                {errors.email && touched.email && (
                                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                                )}
                            </div>
                            
                            <div>
                                <div className='flex flex-col md:flex-row w-full gap-3'>
                                    <div className="flex flex-col space-y-1.5 w-full">
                                        <Label htmlFor="industry" className={errors.industry ? "text-destructive" : ""}>
                                          Industry
                                        </Label>
                                        <Select
                                          value={industry}
                                          onValueChange={(value) => setIndustry(value)}
                                          onOpenChange={() => handleBlur('industry')}
                                        >
                                            <SelectTrigger 
                                              className={`w-full ${errors.industry && touched.industry ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                                              id="industry"
                                            >
                                                <SelectValue placeholder="Select an industry" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="tech">Technology</SelectItem>
                                                <SelectItem value="finance">Finance</SelectItem>
                                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                                <SelectItem value="retail">Retail</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.industry && touched.industry && (
                                          <p className="text-xs text-destructive mt-1">{errors.industry}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col space-y-1.5 w-full">
                                        <Label htmlFor="region" className={errors.region ? "text-destructive" : ""}>
                                          Region
                                        </Label>
                                        <Select
                                          value={region}
                                          onValueChange={(value) => setRegion(value)}
                                          onOpenChange={() => handleBlur('region')}
                                        >
                                            <SelectTrigger 
                                              className={`w-full ${errors.region && touched.region ? "border-destructive focus-visible:ring-destructive" : ""}`} 
                                              id="region"
                                            >
                                                <SelectValue placeholder="Select a region" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="north">North America</SelectItem>
                                                <SelectItem value="europe">Europe</SelectItem>
                                                <SelectItem value="asia">Asia</SelectItem>
                                                <SelectItem value="oceania">Oceania</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.region && touched.region && (
                                          <p className="text-xs text-destructive mt-1">{errors.region}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="taxId" className={errors.taxId ? "text-destructive" : ""}>
                                  Company Tax ID
                                </Label>
                                <Input 
                                  id="taxId" 
                                  placeholder="ID number" 
                                  className={`w-full ${errors.taxId ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  value={taxId}
                                  onChange={(e) => setTaxId(e.target.value)}
                                  onBlur={() => handleBlur('taxId')}
                                />
                                {errors.taxId && touched.taxId && (
                                  <p className="text-xs text-destructive mt-1">{errors.taxId}</p>
                                )}
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
                        Continue to Employee Details
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CompanyDetails;