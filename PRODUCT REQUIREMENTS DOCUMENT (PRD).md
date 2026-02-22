PRODUCT REQUIREMENTS DOCUMENT (PRD)
🏷 Product Name

EDISON – EEE Department Club Portal

🏫 Organization

Department of Electrical & Electronics Engineering (EEE)

🎯 Purpose

To create a centralized digital platform for:

Managing EDISON club activities

Showcasing 5 sub-clubs

Publishing events and updates

Displaying photo galleries

Collecting student registrations

1️⃣ PRODUCT OVERVIEW
🔹 Vision

To create a modern, visually engaging, and easy-to-manage club website that reflects innovation, technology, and leadership within the EEE department.

🔹 Objectives

Increase student participation

Maintain event transparency

Improve communication

Provide professional digital presence

2️⃣ TARGET USERS
User Type	Needs
Students	View clubs, register, see events
Faculty	Monitor registrations
Coordinators	Post updates
Admin	Manage website content
3️⃣ CORE FEATURES
3.1 Homepage
Sections:

Hero Section

Scrolling Updates Strip

About EDISON

Sub-Clubs Overview

Upcoming Events

Photo Gallery Preview

Registration CTA

Footer

3.2 Sub-Club System

Each sub-club includes:

Club Name

Description

Faculty Coordinator Name

Student Coordinator Name

Gallery

Events

Display Format: Card Layout (Grid System)

3.3 Events Module
Features:

Upcoming Events

Past Events Archive

Event Posters

Event Description

Date & Time

Registration link (if required)

3.4 Gallery Module

Image Grid

Lightbox on click

Category filter by club

Upload capability (Admin)

3.5 Scrolling Updates Strip
Behavior:

Auto-scrolling horizontally

Pause on hover

Continuous loop

Example:

🔔 Robotics Workshop – March 10 | 🔔 EDISON Inauguration | 🔔 Guest Lecture |


Animation:

Smooth CSS infinite scroll

20–30 sec loop

3.6 Registration Form
Fields:
Field	Type	Validation
Name	Text	Required
Roll Number	Text	Required
Club Name	Dropdown	Required
Mobile Number	10-digit	Required
Present Year	Dropdown	Required
Validation Rules:

Mobile: 10 digits only

No empty submission

Success message animation

4️⃣ DESIGN SYSTEM
🎨 Aesthetic Color Palette (EEE Themed)
Primary Theme (Electric Innovation)
Role	Color	HEX
Primary	Electric Blue	#0A84FF
Accent	Neon Yellow	#FFD60A
Dark Background	Midnight Navy	#0F172A
Light Background	Soft White	#F8FAFC
Secondary	Deep Purple	#5E17EB
Alternative Premium Theme (Professional & Elegant)
Role	Color
Primary	Royal Blue #1E3A8A
Accent	Gold #FACC15
Background	Charcoal #111827
Card Background	#1F2937
Text	#E5E7EB
🧠 Typography

Headings: Montserrat Bold

Body: Poppins Regular

Buttons: Semi-bold uppercase

5️⃣ UI/UX REQUIREMENTS
🔹 Hero Section
Background:

Animated gradient

Subtle moving electric line animation

Glow effect on "EDISON"

Animation:

Fade-in on load

Text typing effect for tagline

Button hover glow effect

🔹 Sub-Club Cards Animation

Fade-up animation on scroll

Hover effect:

Lift up (transform: translateY(-10px))

Glow border

Shadow increase

🔹 Gallery Animation

Zoom-in on hover

Smooth scaling

Lightbox fade transition

🔹 Buttons

Hover effects:

Background glow

Slight scaling (1.05)

Ripple effect on click

🔹 Scroll Animations

Use:

AOS (Animate on Scroll)

Framer Motion (if React)

CSS keyframes (if pure HTML)

6️⃣ TECHNICAL REQUIREMENTS
Frontend

Option 1:

HTML

CSS (Tailwind or custom)

JavaScript

Option 2 (Recommended Modern):

React / Next.js

Tailwind CSS

Framer Motion

Backend

Choose one:

Option	Stack
Simple	PHP + MySQL
Modern	Supabase
Scalable	Node.js + MongoDB
No backend	Google Forms
7️⃣ DATABASE STRUCTURE
Table: Registrations
Field	Type
id	INT
name	VARCHAR
roll_number	VARCHAR
club	VARCHAR
mobile	VARCHAR
year	INT
created_at	TIMESTAMP
Table: Events
Field	Type
id	INT
club	VARCHAR
title	VARCHAR
description	TEXT
image_url	VARCHAR
event_date	DATE
8️⃣ ADMIN PANEL (Optional But Recommended)

Admin can:

Add events

Upload gallery images

Edit updates strip

Export registration data (CSV)

RESPONSIVE REQUIREMENTS

Mobile:

Stack layout

Hamburger menu

Swipe gallery

Larger buttons

Tablet:

2-column grid

Desktop:

3–4 column grid

🔥 ADVANCED FEATURES (Optional)

Dark/Light Mode Toggle

Member Count Animation

Animated Counters

Club-wise filtering

QR Code registration

WhatsApp quick join button

🎬 Animation Guidelines Summary
Element	Animation
Hero Text	Fade + Slide
Cards	Lift + Glow
Buttons	Scale + Glow
Updates Strip	Infinite Scroll
Gallery	Zoom + Fade
Form	Shake on error