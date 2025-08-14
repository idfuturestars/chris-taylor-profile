import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Brain, Rocket } from "lucide-react";

const educationLevels = [
  {
    id: "k12",
    name: "K-12 Education",
    description: "Primary and secondary education for ages 5-18",
    path: "/k12-dashboard",
    icon: BookOpen,
    color: "bg-blue-500",
    ageRange: "Ages 5-18",
    levels: ["Elementary", "Middle School", "High School"]
  },
  {
    id: "undergraduate",
    name: "Undergraduate",
    description: "Bachelor's degree programs and collegiate education", 
    path: "/higher-education?level=undergraduate",
    icon: GraduationCap,
    color: "bg-green-500",
    ageRange: "Ages 18-22",
    levels: ["Freshman", "Sophomore", "Junior", "Senior"]
  },
  {
    id: "graduate",
    name: "Graduate Studies",
    description: "Master's degrees and advanced professional programs",
    path: "/higher-education?level=graduate", 
    icon: Brain,
    color: "bg-purple-500",
    ageRange: "Ages 22+",
    levels: ["Master's", "Professional", "Certificates"]
  },
  {
    id: "doctoral",
    name: "Doctoral & Beyond",
    description: "PhD programs, postdoctoral research, and academic careers",
    path: "/higher-education?level=doctoral",
    icon: Rocket,
    color: "bg-indigo-500", 
    ageRange: "Ages 25+",
    levels: ["PhD", "Postdoc", "Faculty", "Research"]
  }
];

export default function EducationLevelSelector() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Educational Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            EiQ™ powered by SikatLab™ and IDFS Pathway™ supports learners at every stage of their educational journey. 
            Select your current level to access personalized learning experiences.
          </p>
        </div>

        {/* Education Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {educationLevels.map((level) => {
            const IconComponent = level.icon;
            return (
              <Link key={level.id} href={level.path}>
                <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-green-500">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-full ${level.color} text-white`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{level.name}</CardTitle>
                    <CardDescription className="text-lg">{level.description}</CardDescription>
                    <Badge variant="outline" className="w-fit mx-auto mt-2">
                      {level.ageRange}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Educational Levels:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {level.levels.map((levelName, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {levelName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="default">
                        Enter {level.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Comprehensive Learning Platform Features</CardTitle>
            <CardDescription>Advanced AI-powered tools available across all education levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI-Powered Assessment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Adaptive questioning with Item Response Theory and personalized difficulty adjustment
                </p>
              </div>
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Personalized Learning</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI tutoring system with multi-provider integration and contextual hint generation
                </p>
              </div>
              <div className="text-center">
                <Rocket className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Career Pathways</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Strategic guidance from K-12 through advanced research and professional development
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Not sure which level to choose? Take our placement assessment to find your ideal starting point.
          </p>
          <Link href="/assessment">
            <Button variant="outline" size="lg">
              Take Placement Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}