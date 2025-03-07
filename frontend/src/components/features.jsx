import { Card, CardContent } from "./ui/card";
import { FaUsers, FaExpand, FaImages, FaClipboardList, FaLock, FaCalendarCheck } from "react-icons/fa";

const features = [
  { icon: <FaUsers size={32} className="text-purple-500" />, title: "Real-Time Collaboration", description: "Work together simultaneously with your team members, seeing changes instantly as they happen." },
  { icon: <FaExpand size={32}className="text-purple-500"/>, title: "Infinite Canvas", description: "Never run out of space. Our infinite canvas expands as you create, giving you limitless room for ideas." },
  { icon: <FaImages size={32} className="text-purple-500"/>, title: "Rich Media Support", description: "Embed images, videos, documents, and more directly into your whiteboard for comprehensive visual collaboration." },
  { icon: <FaClipboardList size={32} className="text-purple-500" />, title: "Templates & Tools", description: "Jump-start your creativity with dozens of ready-to-use templates for any project or workflow." },
  { icon: <FaLock size={32} className="text-purple-500"/>, title: "Enterprise Security", description: "Keep your data safe with end-to-end encryption, SSO integration, and advanced permission controls." },
  { icon: <FaCalendarCheck size={32} className="text-purple-500"/>, title: "Seamless Integration", description: "Connect with your favorite tools like Slack, Trello, Jira, and more for a streamlined workflow." }
];

export default function FeaturesSection() {
  return (
    <>
    <section id="features" className="py-16 bg-white text-center">
    <div className="max-w-4xl mx-auto mb-8">
      <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Seamless Collaboration</h2>
      <p className="text-gray-600 mt-2">Everything you need to transform how your team works together, all in one intuitive platform.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <Card key={index} className="shadow-lg p-6 bg-white rounded-2xl">
          <CardContent className="flex flex-col items-center">
            {feature.icon}
            <h3 className="text-lg font-semibold text-gray-900 mt-4">{feature.title}</h3>
            <p className="text-gray-600 ">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
  </>
  );
}
