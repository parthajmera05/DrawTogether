import { Card, CardContent } from "./ui/card";
import { 
  Zap, 
  Users, 
  Settings, 
  Shield, 
  LayoutGrid, 
  MessageCircle,
  
} from "lucide-react";

const features = [
  {
    icon: <Zap size={32} className="text-purple-500" />, 
    title: "Lightning Fast Performance", 
    description: "Experience ultra-responsive drawing and editing with our optimized canvas technology. No lag, even with multiple users."
  },
  {
    icon: <Users size={32} className="text-purple-500" />, 
    title: "Made for Teams", 
    description: "Designed from the ground up for collaboration, with intuitive tools for sharing, commenting, and presenting to your team."
  },
  {
    icon: <Settings size={32} className="text-purple-500" />, 
    title: "Customizable Workflow", 
    description: "Adapt the platform to your unique process with customizable templates, tools, and integrations."
  },
  {
    icon: <Shield size={32} className="text-purple-500" />, 
    title: "Enterprise-Grade Security", 
    description: "Keep your ideas safe with SOC 2 compliance, end-to-end encryption, and granular access controls."
  },
  {
    icon: <LayoutGrid size={32} className="text-purple-500" />, 
    title: "Flexible Layouts", 
    description: "Organize your content with powerful grid, canvas, and presentation layouts to suit any project type."
  },
  {
    icon: <MessageCircle size={32} className="text-purple-500" />, 
    title: "24/7 Support", 
    description: "Our dedicated team is always ready to help with live chat support and comprehensive documentation."
  }
];

export default function WhyChooseWhiteboard() {
  return (
    <section id="why" className="py-16 bg-purple-50 text-center">
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Whiteboard</h2>
        <p className="text-gray-600 mt-2">Experience a collaborative whiteboard platform built with your team's needs in mind.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="shadow-lg p-6 bg-white rounded-2xl">
            <CardContent className="flex flex-col items-center">
              {feature.icon}
              <h3 className="text-lg font-semibold text-gray-900 mt-2">{feature.title}</h3>
              <p className="text-gray-600 ">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-8 animate-pulse text-purple-600 ">
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium">
            Get Started</button>  
     </div>
    </section>
  );
}
