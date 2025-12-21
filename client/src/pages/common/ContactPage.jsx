import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "@/lib/api";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            content: "support@sadhn.org",
            link: "mailto:support@sadhn.org",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Phone,
            title: "Phone",
            content: "+91 9876543210",
            link: "tel:+91 9876543210",
            color: "from-green-500 to-teal-500"
        },
        {
            icon: MapPin,
            title: "Location",
            content: "Global Operations",
            link: null,
            color: "from-purple-500 to-pink-500"
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/contact", formData);
            setSubmitted(true);
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
            
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="max-w-6xl mx-auto"
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6">
                            Get in <span className="gradient-text">Touch</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Have questions or need assistance? We're here to help. Reach out to us 
                            and we'll respond as soon as possible.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6 text-center">
                                        <div className={`mb-4 w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                                            <info.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                                        {info.link ? (
                                            <a 
                                                href={info.link}
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {info.content}
                                            </a>
                                        ) : (
                                            <p className="text-muted-foreground">{info.content}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div variants={fadeInUp}>
                        <Card className="shadow-2xl">
                            <CardContent className="p-8">
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                                            <CheckCircle className="h-10 w-10 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4">Message Sent Successfully!</h2>
                                        <p className="text-muted-foreground mb-6">
                                            Thank you for contacting us. We'll get back to you soon.
                                        </p>
                                        <Button onClick={() => setSubmitted(false)}>
                                            Send Another Message
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="How can we help you?"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message</Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Tell us more about your inquiry..."
                                                    rows={6}
                                                    required
                                                />
                                            </div>

                                            <Button 
                                                type="submit" 
                                                className="w-full gradient-primary" 
                                                size="lg"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    "Sending..."
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-5 w-5" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="mt-12 text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8"
                    >
                        <h3 className="text-xl font-semibold mb-3">Looking for Immediate Help?</h3>
                        <p className="text-muted-foreground mb-4">
                            Check out our FAQ section or browse through our help center for quick answers.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button variant="outline">Visit Help Center</Button>
                            <Button variant="outline">View FAQ</Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
