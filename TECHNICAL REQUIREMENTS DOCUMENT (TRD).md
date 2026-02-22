TECHNICAL REQUIREMENTS DOCUMENT (TRD)
1️⃣ SYSTEM OVERVIEW
1.1 Purpose

To build a responsive, modern web platform for:

Displaying EDISON club information

Managing 5 sub-clubs

Publishing events and updates

Hosting photo galleries

Collecting student registrations

2️⃣ SYSTEM ARCHITECTURE
2.1 Architecture Type

Recommended: Modern Full-Stack Web Architecture

Frontend (Client)
     ↓
API Layer
     ↓
Backend Server
     ↓
Database

2.2 Recommended Tech Stack (Option A – Modern & Scalable)
Frontend

React / Next.js

Tailwind CSS

Framer Motion (animations)

Axios (API calls)

Backend

Node.js

Express.js

Database

PostgreSQL (via Supabase) OR

MongoDB

Hosting

Frontend: Vercel / Netlify

Backend: Render / Railway

Database: Supabase / MongoDB Atlas

Alternative (Simple Stack)

HTML + CSS + JS

PHP

MySQL

cPanel hosting

3️⃣ FUNCTIONAL REQUIREMENTS
3.1 Homepage
Must Include:

Hero Section

Scrolling Updates Strip

About Section

Sub-Club Overview Cards

Events Preview

Gallery Preview

Registration CTA

Performance:

Load time < 3 seconds

Optimized images (WebP)

3.2 Sub-Club Module
Each Club Must Have:

Club Name

Description

Faculty Coordinator

Student Coordinator

Events (filtered)

Gallery (filtered)

Dynamic Requirement:

Data should be fetched from database

No hardcoded data in production

3.3 Events Module
Features:

Add event

Edit event

Delete event

Upload event image

Filter by club

Event Fields:

id

title

description

club_id

event_date

image_url

created_at

3.4 Updates Strip
Requirements:

Auto-scrolling

Dynamic data from DB

Admin editable

Infinite loop animation

3.5 Gallery Module
Features:

Image upload

Club-based filtering

Lightbox preview

Lazy loading images

3.6 Registration Module
Form Fields:

Name

Roll Number

Club (Dropdown)

Mobile Number

Present Year

Validation:

Required fields

Mobile = 10 digits

Duplicate roll number prevention (optional)

On Submit:

Store in database

Show success message

Optional: Send confirmation SMS/email

4️⃣ DATABASE DESIGN
4.1 Tables
Table: clubs
Field	Type
id	UUID / INT
name	VARCHAR
description	TEXT
faculty_coordinator	VARCHAR
student_coordinator	VARCHAR
created_at	TIMESTAMP
Table: events
Field	Type
id	UUID
club_id	FK
title	VARCHAR
description	TEXT
image_url	TEXT
event_date	DATE
created_at	TIMESTAMP
Table: gallery
Field	Type
id	UUID
club_id	FK
image_url	TEXT
uploaded_at	TIMESTAMP
Table: registrations
Field	Type
id	UUID
name	VARCHAR
roll_number	VARCHAR
club_id	FK
mobile	VARCHAR
year	INT
created_at	TIMESTAMP
Table: updates
Field	Type
id	UUID
message	TEXT
created_at	TIMESTAMP
5️⃣ API REQUIREMENTS
5.1 Public APIs
Method	Endpoint	Purpose
GET	/api/clubs	Get all clubs
GET	/api/events	Get all events
GET	/api/gallery	Get images
GET	/api/updates	Get scrolling updates
POST	/api/register	Submit registration
5.2 Admin APIs
Method	Endpoint	Purpose
POST	/api/admin/event	Add event
PUT	/api/admin/event/:id	Edit event
DELETE	/api/admin/event/:id	Delete event
POST	/api/admin/gallery	Upload image
POST	/api/admin/update	Add update
6️⃣ NON-FUNCTIONAL REQUIREMENTS
6.1 Performance

First Contentful Paint < 2 sec

Lazy load images

CDN for images

Minified CSS & JS

6.2 Security

HTTPS mandatory

Input sanitization

Rate limiting for registration

Admin authentication (JWT)

SQL injection prevention

6.3 Scalability

Support 1000+ concurrent users

Modular backend

Scalable cloud DB

6.4 Backup

Daily database backup

Weekly image backup

7️⃣ UI/ANIMATION TECHNICAL REQUIREMENTS
Hero Animation

CSS keyframes OR Framer Motion

No heavy JS animation loops

60fps smoothness

Scrolling Updates

CSS animation

transform: translateX

infinite linear timing

Card Hover

transform: translateY

box-shadow transition

300ms ease

8️⃣ RESPONSIVE REQUIREMENTS

Breakpoints:

1440px (Large Desktop)

1024px (Tablet)

768px (Mobile)

480px (Small Mobile)

Mobile Requirements:

Hamburger menu

Touch-friendly buttons

Single column layout

9️⃣ ADMIN PANEL REQUIREMENTS
Authentication:

Admin login

JWT based session

Role-based access

Features:

View registrations

Export CSV

Manage events

Upload gallery images

Update scrolling text

🔟 DEPLOYMENT REQUIREMENTS
CI/CD

GitHub repository

Automatic deployment on push

Domain

edison-eee.in (example)

SSL

Free SSL (Let’s Encrypt)

1️⃣1️⃣ MAINTENANCE REQUIREMENTS

Monthly security patch updates

Performance monitoring

Error logging (Sentry optional)