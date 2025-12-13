import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

const Certification = () => {
  const [certifications, setCertifications] = useState([]);

  const form = useForm({
    defaultValues: {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    },
  });

  const onSubmit = (data) => {
    const certificationData = {
      ...data,
      issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    };
    setCertifications([...certifications, certificationData]);
    form.reset();
    console.log('Certifications:', [...certifications, certificationData]);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Certifications</h2>
        <p className="text-gray-600 mb-6">
          Add your professional certifications and credentials
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Certification name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AWS Certified Solutions Architect" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuing Organization</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Amazon Web Services" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave empty if certification doesn't expire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="credentialId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential ID</FormLabel>
                <FormControl>
                  <Input placeholder="Unique certification identifier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credential URL</FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="https://example.com/verify" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Link to verify or view your certification
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Add Certification
          </Button>
        </form>
      </Form>

      {certifications.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Added Certifications</h3>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{cert.name}</h4>
                    {cert.issuer && (
                      <p className="text-gray-600 mt-1">{cert.issuer}</p>
                    )}
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {cert.issueDate && (
                        <p>
                          <span className="font-medium">Issued:</span>{' '}
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      )}
                      {cert.expiryDate && (
                        <p>
                          <span className="font-medium">Expires:</span>{' '}
                          {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                      {cert.credentialId && (
                        <p>
                          <span className="font-medium">Credential ID:</span>{' '}
                          {cert.credentialId}
                        </p>
                      )}
                      {cert.url && (
                        <p>
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Credential →
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCertification(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Certification;
