import Image from 'next/image';
import { Target, Lightbulb, Users, Award } from 'lucide-react';

export default function Purpose() {
  return (
    <section id="purpose" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-[#1B1C1E] mb-4">
            Our Purpose
          </h2>
          <p className="text-xl text-gray-600">
            Bridging the gap between technology and the people who use it
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side: Image */}
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <Image
              src="/assets/img/purpose.jpg"
              alt="Hyperion Tech Hub Purpose - Bridging technology and people"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1A2BC2]/30 to-transparent" />
          </div>

          {/* Right Side: Text */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                At Hyperion Tech Hub, our purpose is to bridge the gap between technology and the people who use it. We are driven by a commitment to empower businesses, professionals, and learners to unlock their full potential through cutting-edge technology solutions and comprehensive education.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to make technology accessible, understandable, and impactful for everyone. Whether it's through developing intuitive software, securing digital environments, or providing training that equips individuals with the skills they need to thrive, we are dedicated to fostering growth and innovation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that technology should be a force for good—solving problems, driving progress, and creating opportunities. By providing a one-stop destination for all things tech, we aim to not only meet the immediate needs of our clients but also to inspire a future where technology and creativity work hand in hand to build a better world.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              description: 'To make technology accessible, understandable, and impactful for everyone.'
            },
            {
              icon: Lightbulb,
              title: 'Innovation',
              description: 'Driving progress through cutting-edge solutions and creative problem-solving.'
            },
            {
              icon: Users,
              title: 'Partnership',
              description: 'Building lasting relationships as your trusted technology partner.'
            },
            {
              icon: Award,
              title: 'Excellence',
              description: 'Committed to delivering the highest quality in everything we do.'
            }
          ].map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index}
                className="text-center space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="inline-flex w-16 h-16 rounded-full bg-[#1A2BC2]/10 items-center justify-center">
                  <Icon className="w-8 h-8 text-[#1A2BC2]" />
                </div>
                <h3 className="text-xl text-[#1B1C1E]">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#1A2BC2] to-[#0D0D52] rounded-2xl p-12 text-white">
            <p className="text-2xl leading-relaxed">
              Hyperion Tech Hub exists to be a <span className="font-semibold">catalyst for change</span>, 
              a <span className="font-semibold">partner in progress</span>, and 
              a <span className="font-semibold">leader in innovation</span>. 
              We are here to help our clients navigate the complexities of the digital age, 
              ensuring that technology serves as a powerful tool in their hands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

