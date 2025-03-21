import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  companyEmail: z.string().email().optional(),
  industryType: z.string().min(1, 'Please select an industry'),
  satisfactionRating: z.number().min(1).max(10),
  serviceQuality: z.number().min(1).max(5),
  impressiveAspects: z.array(z.string()).min(1, 'Please select at least one aspect'),
  improvements: z.string().optional(),
  wouldRecommend: z.enum(['yes', 'no']),
});

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Other',
];

const serviceAspects = [
  { id: 'usability', label: 'Ease of Use' },
  { id: 'reliability', label: 'Reliability' },
  { id: 'support', label: 'Customer Support' },
  { id: 'features', label: 'Feature Set' },
  { id: 'performance', label: 'Performance' },
];

interface FeedbackFormProps {
  onSubmit: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      satisfactionRating: 5,
      serviceQuality: 3,
      impressiveAspects: [],
      wouldRecommend: 'yes',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Share Your Feedback</h2>
          <p className="text-muted-foreground">
            Help us improve our service with your valuable feedback
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="company@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="satisfactionRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Satisfaction (1-10) *</FormLabel>
                <FormControl>
                  <div className="pt-2">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceQuality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Quality (1-5 stars) *</FormLabel>
                <FormControl>
                  <div className="pt-2">
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impressiveAspects"
            render={() => (
              <FormItem>
                <FormLabel>What aspects impressed you most? *</FormLabel>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {serviceAspects.map((aspect) => (
                    <FormField
                      key={aspect.id}
                      control={form.control}
                      name="impressiveAspects"
                      render={({ field }) => (
                        <FormItem
                          key={aspect.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(aspect.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, aspect.id])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== aspect.id)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {aspect.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="improvements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How can we improve?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your suggestions for improvement..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wouldRecommend"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Would you recommend us to others? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;