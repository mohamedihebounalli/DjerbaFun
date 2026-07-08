import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({ meta: [{ title: "Contact — Djerba Fun" }] }),
});

function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent successfully! We will get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-primary mb-2">
          Contact
        </h1>
        <p className="text-lg text-muted-foreground">
          Have a question about our activities or want to plan a custom group event?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left Column: Contact Info & Map */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <a
                href="tel:+21695776339"
                className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-base">Phone</p>
                  <p className="text-muted-foreground text-sm">+216 95 776 339</p>
                </div>
              </a>

              <a
                href="https://wa.me/21695776339"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="h-11 w-11 rounded-full bg-whatsapp/10 text-whatsapp flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-base">WhatsApp</p>
                  <p className="text-muted-foreground text-sm">Direct chat with our team</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-3 rounded-2xl border border-transparent">
                <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-base">Location</p>
                  <p className="text-muted-foreground text-sm">Djerba, Tunisia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map replaced Operating Hours here */}
          <div className="rounded-3xl overflow-hidden shadow-sm border border-border h-[280px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105260.40776595568!2d10.85246735!3d33.8055613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13aa972304856ba7%3A0xc3b83988d5786a51!2sDjerba%20Island!5e0!3m2!1sen!2stn!4v1700000000000!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Djerba Location Map"
            ></iframe>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="rounded-3xl border border-border bg-card shadow-lift p-6">
          <h2 className="font-display text-2xl font-bold mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Full Name
              </label>
              <Input id="name" required placeholder="John Doe" className="h-10 rounded-xl" />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email Address
              </label>
              <Input id="email" type="email" required placeholder="john@example.com" className="h-10 rounded-xl" />
            </div>

            <div className="space-y-1">
              <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subject
              </label>
              <Select required defaultValue="General Inquiry">
                <SelectTrigger id="subject" className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Booking Question">Booking Question</SelectItem>
                  <SelectItem value="Custom Excursion Request">Custom Excursion Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Message
              </label>
              <Textarea
                id="message"
                required
                placeholder="How can we help you?"
                className="min-h-[100px] rounded-xl resize-none p-3"
              />
            </div>

            <Button type="submit" size="lg" className="w-full rounded-xl font-bold h-11 mt-2">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}