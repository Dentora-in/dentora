// Mock blog data - replace with actual data source in production
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "importance-regular-dental-checkups",
    title: "The Importance of Regular Dental Checkups",
    excerpt:
      "Discover why routine dental visits are crucial for maintaining optimal oral health and preventing serious dental issues.",
    content: `
# The Importance of Regular Dental Checkups

Regular dental checkups are essential for maintaining good oral health. Many people underestimate the importance of routine dental visits, but they play a crucial role in preventing serious dental issues.

## Why Regular Checkups Matter

Preventive care is the foundation of good dental health. During a routine checkup, your dentist can:

- Detect early signs of decay or gum disease
- Perform professional cleaning to remove plaque and tartar
- Screen for oral cancer
- Identify bite issues or teeth grinding
- Provide personalized advice for your oral care routine

## Recommended Frequency

The American Dental Association recommends visiting your dentist at least twice a year. However, some individuals may need more frequent visits based on their specific oral health needs.

## Benefits Beyond Oral Health

Regular dental visits can also contribute to your overall health. Research has shown connections between oral health and conditions such as:

- Heart disease
- Diabetes
- Respiratory infections
- Pregnancy complications

## Making Appointments Easier

With modern appointment booking platforms, scheduling your dental checkups has never been easier. Online booking systems allow you to find convenient times without the hassle of phone calls.

## Conclusion

Don't wait for pain or visible problems to visit your dentist. Regular checkups are an investment in your long-term health and well-being.
    `,
    author: "Dr. Sarah Mitchell",
    date: "Dec 15, 2024",
    category: "Preventive Care",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "choosing-right-dentist",
    title: "How to Choose the Right Dentist for Your Family",
    excerpt:
      "A comprehensive guide to finding a trusted dental professional who meets your family's unique needs and preferences.",
    content: `
# How to Choose the Right Dentist for Your Family

Finding the right dentist for your family is an important decision that can impact your oral health for years to come.

## Key Factors to Consider

### Location and Accessibility
Choose a dentist whose office is conveniently located near your home or workplace.

### Credentials and Experience
Verify the dentist's qualifications, certifications, and years of experience.

### Range of Services
Ensure the practice offers all the services your family needs.

### Office Environment
Visit the office to assess cleanliness, modern equipment, and friendly staff.

## Making Your Decision

Take time to research, read reviews, and schedule consultations before making your final choice.
    `,
    author: "Dr. James Chen",
    date: "Dec 10, 2024",
    category: "Patient Guide",
    readTime: "4 min read",
  },
  {
    slug: "digital-dentistry-future",
    title: "Digital Dentistry: The Future of Oral Healthcare",
    excerpt:
      "Explore how digital technologies are transforming dental care, from 3D imaging to AI-powered diagnosis.",
    content: `
# Digital Dentistry: The Future of Oral Healthcare

The dental industry is experiencing a digital revolution. Advanced technologies are making dental care more accurate, efficient, and comfortable than ever before.

## Emerging Technologies

### 3D Imaging and Printing
Create precise dental models and custom prosthetics.

### AI-Powered Diagnosis
Detect cavities and other issues earlier and more accurately.

### Teledentistry
Consult with dentists remotely for initial assessments and follow-ups.

## Benefits for Patients

- More accurate diagnoses
- Faster treatment times
- Improved comfort
- Better communication with your dentist

## Looking Ahead

As technology continues to advance, we can expect even more innovative solutions in dental care.
    `,
    author: "Dr. Emily Rodriguez",
    date: "Dec 5, 2024",
    category: "Technology",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "managing-dental-anxiety",
    title: "Managing Dental Anxiety: Tips and Techniques",
    excerpt:
      "Practical strategies to help you overcome fear and anxiety related to dental visits.",
    content: `
# Managing Dental Anxiety: Tips and Techniques

Dental anxiety is common, but it shouldn't prevent you from getting the care you need.

## Understanding Dental Anxiety

Many people experience nervousness before dental appointments. This can stem from:
- Previous negative experiences
- Fear of pain
- Feeling of loss of control
- Embarrassment about oral health

## Coping Strategies

### Communicate with Your Dentist
Share your concerns and fears openly.

### Relaxation Techniques
Try deep breathing, meditation, or visualization.

### Bring Support
Have a trusted friend or family member accompany you.

### Gradual Exposure
Start with simple appointments to build confidence.

## When to Seek Professional Help

If anxiety is severe, consider speaking with a mental health professional.
    `,
    author: "Dr. Michael Thompson",
    date: "Nov 28, 2024",
    category: "Mental Health",
    readTime: "5 min read",
  },
  {
    slug: "oral-hygiene-tips-children",
    title: "Oral Hygiene Tips for Children: A Parent's Guide",
    excerpt:
      "Essential advice for parents on establishing healthy dental habits in children from infancy through adolescence.",
    content: `
# Oral Hygiene Tips for Children: A Parent's Guide

Teaching children good oral hygiene habits early sets the foundation for lifelong dental health.

## Age-Specific Guidelines

### Infants (0-12 months)
- Wipe gums with a soft cloth after feeding
- Start brushing when first tooth appears

### Toddlers (1-3 years)
- Use a tiny smear of fluoride toothpaste
- Make brushing fun with songs and games

### Children (3-8 years)
- Teach proper brushing technique
- Supervise brushing until age 8

### Pre-teens and Teens
- Encourage independence
- Discuss the importance of oral health

## Making it Fun

Turn brushing into a positive experience with colorful toothbrushes, flavored toothpaste, and reward systems.

## First Dental Visit

Schedule your child's first dental appointment by their first birthday or when their first tooth appears.
    `,
    author: "Dr. Lisa Parker",
    date: "Nov 20, 2024",
    category: "Pediatric Care",
    readTime: "7 min read",
  },
  {
    slug: "understanding-dental-insurance",
    title: "Understanding Dental Insurance: What You Need to Know",
    excerpt:
      "Navigate the complexities of dental insurance coverage, benefits, and how to maximize your plan.",
    content: `
# Understanding Dental Insurance: What You Need to Know

Dental insurance can be confusing, but understanding your coverage helps you make informed decisions about your oral health care.

## Types of Coverage

### Preventive Care
Usually covered at 100% (cleanings, exams, X-rays)

### Basic Procedures
Typically covered at 70-80% (fillings, extractions)

### Major Procedures
Often covered at 50% (crowns, bridges, dentures)

## Key Terms to Know

- **Premium**: Monthly payment for coverage
- **Deductible**: Amount you pay before insurance kicks in
- **Co-payment**: Fixed amount you pay per visit
- **Annual Maximum**: Cap on what insurance pays per year

## Maximizing Your Benefits

- Use preventive services fully
- Plan major work strategically
- Stay in-network when possible
- Keep track of your annual maximum

## Questions to Ask

Before treatment, clarify:
- What procedures are covered?
- What is my out-of-pocket cost?
- Are there waiting periods?

Understanding your insurance helps you budget for dental care and avoid surprises.
    `,
    author: "Dr. Robert Anderson",
    date: "Nov 15, 2024",
    category: "Insurance & Billing",
    readTime: "6 min read",
  },
];

export function getBlogPosts() {
  return blogPosts;
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts() {
  return blogPosts.filter((post) => post.featured);
}

export function getCategories() {
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  return categories;
}
