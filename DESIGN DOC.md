DESIGN SPECIFICATION DOCUMENT (INSPIRED BY CIPHER AI UI)
📌 Design Vision

Build a modern, vibrant, engaging, interactive website for the EEE Department’s EDISON Club — capturing innovation, energy, and community involvement.

Take inspiration from the Cipher AI hero-style dramatic visuals and rich color contrasts to make your site feel contemporary and tech forward.

🎯 Target Experience

Bold hero visuals: large gradients, feature image/illustration, concise value proposition

Interactive micro-animations: hover effects, scroll reveals, dynamic updates strip

Clean content hierarchy: easy to read, modern typography

Responsive: smooth across phones & desktops

Story-driven layout: lead users from intro → clubs → gallery → register

🎨 DESIGN ELEMENTS
🧠 1) Overall Style Language
Category	Style
Visual Mood	Tech-forward, Inspirational, Energetic
Aesthetic	Gradient depth + textured shadows + subtle motion
Layout	Asymmetric sections, large padding, spacious visuals
Images	High-quality photo/illustrations with lighting & depth
🎨 2) Color Palette (Inspired by the Dribbble design)

Primary Colors:

Role	HEX	Usage
✨ Electric Indigo	#0A175B	Hero background
🔥 Neon Magenta	#5B2136	Highlights, buttons
🌟 Soft White	#FDFCFC	Text, light UI elements
⚡ Electric Yellow	#F7BD20	Accent, CTA
💎 Graphite Gray	#AEA8A4	Secondary text & UI

Derived from the inspiration design’s palette.

Optional gradient combos (used in backgrounds or overlays):

linear-gradient(135deg, #0A175B 0%, #5B2136 100%)
linear-gradient(90deg, #0A175B 30%, #F7BD20 100%)

✏️ 3) Typography
Type	Font	Usage
Headline	Montserrat Extra Bold	Primary headings
Sub-heading	Montserrat SemiBold	Section headers
Body Text	Poppins Regular	Paragraphs & descriptions
Buttons	Poppins Bold	CTAs & links
🧱 LAYOUT & UI PATTERNS
🖼 4) Hero Banner (Homepage)

🎯 Purpose: Instant identity and context.

Structure

Large animated gradient background

Big headline: “Welcome to EDISON – Powering EEE Innovation”

Sub-text: short mission statement

CTA Buttons: Explore Clubs / Join Now

Feature image/illustration (photo or custom graphic)

Optional micro-animation (e.g., slight parallax image movement)

Interactions

Text fade-in on load

Button glow on hover

Floating graphic motion (slow & subtle)

🔄 5) Scrolling Updates Strip

Design like a marquee but modern:

↔️ Latest Updates: Robotics Workshop – March 10 | Guest Lecture – Friday | Power Systems Meetup – April 1 ↔️


Style

Horizontal scroll

Slight pulsing on update text

Soft shadow background for depth

Animation

Looping auto movement

Pause on hover

📜 6) Club Cards

Each club appears as a card with:

Club logo

Name

Small icon or color accent

Coordinator names

“Learn More” link

Interaction

Hover lift (translateY)

Glow outline

Soft shadow

📅 7) Events Section

Card-based design:

Date badge floating above card

Poster or image

Title and short description

Animations

Reveal on scroll

Image scale on hover

📸 8) Gallery

Masonry grid

Click opens lightbox

Soft grow animation on hover

🧪 MOTION & INTERACTIONS GUIDE

Use a motion system (CSS or JS library) like:

AOS (Animate on Scroll)

Framer Motion (React)

GSAP

Motion patterns:

Element	Animation
Hero headline	Fade + Slide
CTA buttons	Glow + scale
Club cards	Flip or Lift
Gallery images	Fade + zoom
Updates strip	Continuous scroll
🛠 UI COMPONENT GUIDE
✨ Buttons
.btn-primary {
  background: #F7BD20;
  color: #0A175B;
  box-shadow: 0px 4px 15px rgba(247, 189, 32, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 20px rgba(247, 189, 32, 0.6);
}

📌 Card Example
.card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 6px 18px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 12px 25px rgba(0,0,0,0.15);
}

🧠 CONTENT HIERARCHY PROPOSAL
Section	Order
Hero (Banner)	1
Updates Strip	2
About EDISON	3
Sub-Clubs	4
Events	5
Gallery	6
Registration Form	7
Contact/ Footer	8
📱 RESPONSIVE BREAKPOINTS
Screen	Columns
Desktop	4
Tablet	2
Mobile	1