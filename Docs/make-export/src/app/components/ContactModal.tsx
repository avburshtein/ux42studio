import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-[24px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto modal-scrollbar">
        <DialogDescription className="sr-only">
          Contact form to send us a message about your project
        </DialogDescription>
        <div className="relative">
          
          <DialogHeader className="px-8 pt-8 pb-6">
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Get in Touch
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Have a project in mind? Let's talk about how we can help you.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-gray-700 dark:text-gray-300">
                Full Name *
              </Label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-[32px] py-[16px] h-auto rounded-[48px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-gray-700 dark:text-gray-300">
                Email *
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-[32px] py-[16px] h-auto rounded-[48px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-company" className="text-gray-700 dark:text-gray-300">
                Company
              </Label>
              <Input
                id="contact-company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="px-[32px] py-[16px] h-auto rounded-[48px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="Your Company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message" className="text-gray-700 dark:text-gray-300">
                Message *
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="px-[32px] py-[16px] rounded-[24px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Tell us about your project..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-[32px] py-[16px] rounded-[48px] font-medium text-white transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
              style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 1) 3.7608%, rgba(44, 90, 7, 1) 98.529%)" }}
            >
              Send Message
            </button>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              We typically respond within 24 hours
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}