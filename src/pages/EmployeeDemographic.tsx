import ProgressItem from '@/components/ui/progressItem';
import { Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from 'react';

interface EmployeeDemographicProps {
  onContinue?: () => void;
  onPrevious?: () => void;
  setFormValid?: (sectionId: string, isValid: boolean) => void;
  updateData?: (data: {
    coverage: number;
    ageRange: [number, number];
    salaryRange: {
      min: number;
      max: number;
    };
  }) => void;
}

interface FormErrors {
  coverage?: string;
  minSalary?: string;
  maxSalary?: string;
  minPercentage?: string;
  maxPercentage?: string;
}

const EmployeeDemographic: React.FC<EmployeeDemographicProps> = ({ 
  onContinue, 
  onPrevious,
  setFormValid = () => {},
  updateData = () => {}
}) => {
    // Initialize with a min age of 25 and max age of 45
    const [ageRange, setAgeRange] = useState<[number, number]>([25, 45]);
    
    // Form state
    const [coverage, setCoverage] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [minPercentage, setMinPercentage] = useState("");
    const [maxPercentage, setMaxPercentage] = useState("");
    
    // Validation state
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState({
      coverage: false,
      minSalary: false,
      maxSalary: false,
      minPercentage: false,
      maxPercentage: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Validate form fields
    const validateForm = () => {
      const newErrors: FormErrors = {};
      
      if (!coverage.trim()) {
        newErrors.coverage = "Please enter the number of employees needing coverage";
      } else if (isNaN(Number(coverage)) || Number(coverage) <= 0) {
        newErrors.coverage = "Please enter a valid number";
      }
      
      if (!minSalary.trim()) {
        newErrors.minSalary = "Please enter the minimum salary";
      } else if (isNaN(Number(minSalary)) || Number(minSalary) < 0) {
        newErrors.minSalary = "Please enter a valid amount";
      }
      
      if (!maxSalary.trim()) {
        newErrors.maxSalary = "Please enter the maximum salary";
      } else if (isNaN(Number(maxSalary)) || Number(maxSalary) <= 0) {
        newErrors.maxSalary = "Please enter a valid amount";
      } else if (Number(maxSalary) <= Number(minSalary)) {
        newErrors.maxSalary = "Maximum salary must be higher than minimum salary";
      }
      
      if (!minPercentage.trim()) {
        newErrors.minPercentage = "Required";
      } else if (isNaN(Number(minPercentage)) || Number(minPercentage) <= 0 || Number(minPercentage) > 100) {
        newErrors.minPercentage = "Enter a valid percentage (1-100)";
      }
      
      if (!maxPercentage.trim()) {
        newErrors.maxPercentage = "Required";
      } else if (isNaN(Number(maxPercentage)) || Number(maxPercentage) <= 0 || Number(maxPercentage) > 100) {
        newErrors.maxPercentage = "Enter a valid percentage (1-100)";
      }
      
      const percentageSum = Number(minPercentage) + Number(maxPercentage);
      if (!isNaN(percentageSum) && percentageSum !== 100) {
        if (!newErrors.minPercentage && !newErrors.maxPercentage) {
          newErrors.maxPercentage = "Percentages must sum to 100%";
        }
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    // Check form validity whenever inputs change
    useEffect(() => {
      if (isSubmitting || Object.values(touched).some(t => t)) {
        const isValid = validateForm();
        setFormValid("employee-demographic", isValid);
        
        // Update parent component with data if valid
        if (isValid) {
          updateData({
            coverage: Number(coverage),
            ageRange: ageRange,
            salaryRange: {
              min: Number(minSalary),
              max: Number(maxSalary)
            }
          });
        }
      }
    }, [coverage, minSalary, maxSalary, minPercentage, maxPercentage, ageRange, touched, isSubmitting]);
    
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
          coverage: Number(coverage),
          ageRange: ageRange,
          salaryRange: {
            min: Number(minSalary),
            max: Number(maxSalary)
          }
        });
        onContinue();
      }
    };
    
    return (
        <div className="w-full px-4 sm:px-6 md:w-[80%] lg:w-[70%] xl:w-[50%] min-h-screen mx-auto">
            <div className="mb-6 md:mb-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <ProgressItem
                        icon={<Users />}
                        label='Employee Demographic'
                        hint='Step 2 of 3 - "You are almost there!"'
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
                        <div className="grid w-full items-center gap-6">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="coverage" className={errors.coverage ? "text-destructive" : ""}>
                                  How many people need coverage?
                                </Label>
                                <Input 
                                    id="coverage" 
                                    placeholder="full time employees" 
                                    className={`w-full ${errors.coverage ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}`}
                                    value={coverage}
                                    onChange={(e) => setCoverage(e.target.value)}
                                    onBlur={() => handleBlur('coverage')}
                                />
                                {errors.coverage && touched.coverage && (
                                  <p className="text-xs text-destructive mt-1">{errors.coverage}</p>
                                )}
                            </div>
                            
                            <div className="flex flex-col space-y-3">
                                <Label className="text-foreground">What's the age range of your team?</Label>
                                <p className="text-sm text-muted-foreground">
                                    This helps us tailor affordable rates. Most groups fall between 25-65.
                                </p>
                                <div className="pt-2 pb-10 sm:pb-8 relative">
                                    <Slider
                                        defaultValue={[25, 45]}
                                        max={65}
                                        min={20}
                                        step={1}
                                        value={ageRange}
                                        onValueChange={(value) => setAgeRange(value as [number, number])}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between mt-2">
                                        <span className="text-sm text-muted-foreground">20</span>
                                        <span className="text-sm text-muted-foreground">65</span>
                                    </div>
                                    
                                    {/* Position indicators below the slider handles */}
                                    {ageRange[0] > 20 && (
                                        <div 
                                            className="absolute text-sm font-medium text-primary"
                                            style={{
                                                left: `${((ageRange[0] - 20) / (65 - 20)) * 100}%`,
                                                top: '24px',
                                                transform: 'translateX(-50%)'
                                            }}
                                        >
                                            {ageRange[0]}
                                        </div>
                                    )}
                                    
                                    {ageRange[1] < 65 && (
                                        <div 
                                            className="absolute text-sm font-medium text-primary"
                                            style={{
                                                left: `${((ageRange[1] - 20) / (65 - 20)) * 100}%`,
                                                top: '24px',
                                                transform: 'translateX(-50%)'
                                            }}
                                        >
                                            {ageRange[1]}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-3">
                                <Label className={errors.minSalary || errors.maxSalary ? "text-destructive" : ""}>
                                  Tell us about your team's salary ranges
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Provide your lowest and highest full-time salaries (pre-tax) and the percentage of 
                                    employees in each range.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-3 items-center mt-2">
                                    <div className="flex flex-col">
                                        <Label htmlFor="minSalary" className={`whitespace-nowrap mb-1.5 ${errors.minSalary ? "text-destructive" : ""}`}>
                                            Min Salary
                                        </Label>
                                        <Input 
                                            id="minSalary" 
                                            placeholder="salary" 
                                            className={errors.minSalary ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}
                                            value={minSalary}
                                            onChange={(e) => setMinSalary(e.target.value)}
                                            onBlur={() => handleBlur('minSalary')}
                                        />
                                        {errors.minSalary && touched.minSalary && (
                                            <p className="text-xs text-destructive mt-1">{errors.minSalary}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <Label htmlFor="minPercentage" className={`whitespace-nowrap mb-1.5 ${errors.minPercentage ? "text-destructive" : ""}`}>
                                            Min %
                                        </Label>
                                        <Input 
                                            id="minPercentage" 
                                            placeholder="percentage" 
                                            className={errors.minPercentage ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}
                                            value={minPercentage}
                                            onChange={(e) => setMinPercentage(e.target.value)}
                                            onBlur={() => handleBlur('minPercentage')}
                                        />
                                        {errors.minPercentage && touched.minPercentage && (
                                            <p className="text-xs text-destructive mt-1">{errors.minPercentage}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <Label htmlFor="maxSalary" className={`whitespace-nowrap mb-1.5 ${errors.maxSalary ? "text-destructive" : ""}`}>
                                            Max Salary
                                        </Label>
                                        <Input 
                                            id="maxSalary" 
                                            placeholder="salary" 
                                            className={errors.maxSalary ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}
                                            value={maxSalary}
                                            onChange={(e) => setMaxSalary(e.target.value)}
                                            onBlur={() => handleBlur('maxSalary')}
                                        />
                                        {errors.maxSalary && touched.maxSalary && (
                                            <p className="text-xs text-destructive mt-1">{errors.maxSalary}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <Label htmlFor="maxPercentage" className={`whitespace-nowrap mb-1.5 ${errors.maxPercentage ? "text-destructive" : ""}`}>
                                            Max %
                                        </Label>
                                        <Input 
                                            id="maxPercentage" 
                                            placeholder="percentage" 
                                            className={errors.maxPercentage ? "border-destructive focus-visible:ring-destructive" : "border-border focus-visible:ring-primary"}
                                            value={maxPercentage}
                                            onChange={(e) => setMaxPercentage(e.target.value)}
                                            onBlur={() => handleBlur('maxPercentage')}
                                        />
                                        {errors.maxPercentage && touched.maxPercentage && (
                                            <p className="text-xs text-destructive mt-1">{errors.maxPercentage}</p>
                                        )}
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
                        Continue to Insurance Plan
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default EmployeeDemographic;