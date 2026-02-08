"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  FlaskConical,
  ShieldCheck,
  Settings,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Plus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dashboardFeatures = [
  {
    title: "Platform Analytics",
    description: "Real-time insights into global health trends and platform performance metrics.",
    icon: BarChart3,
    color: "emerald",
    href: "/superAdmin/analytics"
  },
  {
    title: "Medical Network",
    description: "Manage registered doctors, verified clinics, and healthcare professionals.",
    icon: Users,
    color: "blue",
    href: "/superAdmin/doctors"
  },
  {
    title: "Diagnostic Labs",
    description: "Oversee diagnostic laboratory registrations and test catalog management.",
    icon: FlaskConical,
    color: "purple",
    href: "/superAdmin/labs"
  },
  {
    title: "User Governance",
    description: "Comprehensive control over user roles, permissions, and account security.",
    icon: ShieldCheck,
    color: "indigo",
    href: "/superAdmin/users"
  },
  {
    title: "System Config",
    description: "Control global platform parameters, regional settings, and API configurations.",
    icon: Settings,
    color: "orange",
    href: "/superAdmin/settings"
  },
  {
    title: "Revenue Tracking",
    description: "Detailed financial reports, transaction monitoring, and billing summaries.",
    icon: CreditCard,
    color: "rose",
    href: "/superAdmin/payments"
  }
];

const SuperAdminDashboard = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Premium Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-600 p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-md mb-6"
          >
            <Activity className="h-4 w-4" />
            <span>Operational Excellence</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome back, <br />
            <span className="text-emerald-100">Super Administrator</span>
          </h1>

          <p className="text-emerald-50 text-lg md:text-xl mb-8 leading-relaxed opacity-90">
            Monitor, manage, and scale the Swasthify healthcare ecosystem with precision-driven administrative tools.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg font-semibold px-8 rounded-xl transition-all hover:scale-105 active:scale-95">
              Launch Analytics
            </Button>
            <Button size="lg" variant="ghost" className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 px-8 rounded-xl transition-all">
              Quick Config
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 mr-12 mb-12 hidden lg:block opacity-20">
          <TrendingUp className="w-64 h-64" />
        </div>
      </motion.div>

      {/* Quick Stats / Overview Section Label */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Platform Capabilities</h2>
          <p className="text-muted-foreground">Select a module to manage platform operations</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1 rounded-lg">
          <Plus className="h-4 w-4" />
          <span>New Action</span>
        </Button>
      </div>

      {/* Feature Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {dashboardFeatures.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div key={idx} variants={item}>
              <Card className="group relative overflow-hidden border-none bg-card hover:bg-emerald-50/10 dark:hover:bg-emerald-950/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-2xl cursor-pointer ring-1 ring-border/50">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                    ${feature.color === 'emerald' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                        feature.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                          feature.color === 'indigo' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' :
                            feature.color === 'orange' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                              'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <span>Explore Module</span>
                    <ArrowUpRight className="ml-1 w-4 h-4" />
                  </div>
                </CardContent>

                {/* Accent line on hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SuperAdminDashboard;