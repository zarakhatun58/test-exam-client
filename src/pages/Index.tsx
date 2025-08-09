/**
 * Landing page for Test_School Competency Assessment Platform
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Award, 
  BookOpen, 
  Users, 
  TrendingUp,
  ArrowRight,
  Shield,
  Star
} from 'lucide-react';

const Index = () => {
  const assessmentLevels = [
    { level: 'A1', color: 'level-a1', description: 'Basic digital skills' },
    { level: 'A2', color: 'level-a2', description: 'Elementary competency' },
    { level: 'B1', color: 'level-b1', description: 'Intermediate skills' },
    { level: 'B2', color: 'level-b2', description: 'Upper intermediate' },
    { level: 'C1', color: 'level-c1', description: 'Advanced competency' },
    { level: 'C2', color: 'level-c2', description: 'Expert mastery' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: '3-Step Assessment',
      description: 'Progressive evaluation pathway from A1 to C2 levels'
    },
    {
      icon: Clock,
      title: 'Timed Evaluation',
      description: 'Secure timer system with auto-submit functionality'
    },
    {
      icon: Award,
      title: 'Digital Certificates',
      description: 'Automated certification based on achievement levels'
    },
    {
      icon: Shield,
      title: 'Secure Environment',
      description: 'Protected assessment with integrity measures'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your competency development journey'
    },
    {
      icon: Users,
      title: 'Multiple Roles',
      description: 'Support for students, supervisors, and administrators'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Navigation Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Test_School</h1>
                <p className="text-sm text-muted-foreground">Digital Competency Assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth/register">
                <Button className="gradient-primary text-primary-foreground">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Master Your 
              <span className="gradient-primary bg-clip-text text-transparent"> Digital Skills</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take our comprehensive 3-step assessment to evaluate and certify your digital competencies 
              from basic (A1) to expert (C2) levels.
            </p>
            
            {/* Assessment Levels */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {assessmentLevels.map((level) => (
                <Badge 
                  key={level.level} 
                  className={`level-badge ${level.color} px-4 py-2`}
                  variant="secondary"
                >
                  <span className="font-bold">{level.level}</span>
                  <span className="mx-2">•</span>
                  <span>{level.description}</span>
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-primary">
                  Start Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Test_School?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides a comprehensive and secure way to assess and certify digital competencies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="assessment-card">
                <CardHeader>
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Process Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our 3-step progressive assessment ensures accurate evaluation of your digital competency level.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Step 1: A1 & A2 Levels',
                description: 'Basic to elementary digital skills assessment',
                details: ['44 questions', '75% to proceed', 'A1 or A2 certification'],
                color: 'level-a2'
              },
              {
                step: '02',
                title: 'Step 2: B1 & B2 Levels',
                description: 'Intermediate digital competency evaluation',
                details: ['44 questions', '75% to proceed', 'B1 or B2 certification'],
                color: 'level-b2'
              },
              {
                step: '03',
                title: 'Step 3: C1 & C2 Levels',
                description: 'Advanced to expert level assessment',
                details: ['44 questions', 'Final evaluation', 'C1 or C2 certification'],
                color: 'level-c2'
              }
            ].map((step, index) => (
              <Card key={index} className="assessment-card relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-${step.color}`}></div>
                <CardHeader>
                  <div className={`w-16 h-16 bg-${step.color} rounded-full flex items-center justify-center mb-4`}>
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Assess Your Digital Skills?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Join thousands of learners who have certified their digital competencies with Test_School.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" variant="secondary" className="shadow-lg">
                  Create Account
                  <Star className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Test_School</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Digital Competency Assessment Platform providing comprehensive evaluation 
                and certification of digital skills from A1 to C2 levels.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth/register" className="hover:text-foreground transition-colors">Assessment</Link></li>
                <li><Link to="/auth/login" className="hover:text-foreground transition-colors">Certificates</Link></li>
                <li><Link to="/auth/login" className="hover:text-foreground transition-colors">Results</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Test_School. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
