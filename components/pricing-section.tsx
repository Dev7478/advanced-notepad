import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      description: "Basic features for personal use",
      price: "$0",
      features: [
        "Basic note-taking",
        "Markdown support",
        "500MB storage",
        "Export to PDF",
        "Basic search",
        "Mobile access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced features for power users",
      price: "$9.99",
      period: "per month",
      features: [
        "Everything in Free",
        "10GB storage",
        "Cloud backup",
        "Advanced search",
        "Version history",
        "Basic AI features",
        "Offline access",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      description: "Collaboration tools for teams",
      price: "$19.99",
      period: "per user/month",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Team collaboration",
        "Advanced AI tools",
        "Admin controls",
        "Custom branding",
        "API access",
        "24/7 support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Choose the plan that's right for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-primary shadow-md" : ""}`}>
              <CardHeader>
                {plan.popular && (
                  <div className="py-1 px-3 bg-primary text-primary-foreground text-xs font-medium rounded-full w-fit mb-2">
                    Most Popular
                  </div>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.name === "Team" ? "/contact" : "/signup"} className="w-full">
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

