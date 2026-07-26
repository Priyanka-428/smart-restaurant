# Smart Restaurant Management System

A full-stack restaurant management platform built for VibeAthon 6.0, solving a real operational problem: customers don't know if a dish is available, and staff have no easy way to update availability in real time.

## Team Name
Evospark

## Tech Stack
- **Frontend & Backend:** Next.js (React, TypeScript)
- **Database & Auth:** Supabase (PostgreSQL, Realtime, Auth)
- **Deployment:** Vercel
- **Version Control:** GitHub

## Problem Statement
Restaurants rely on manual processes for tracking dish availability, leading to customer frustration and poor communication between customers, staff, and kitchen. This project solves that by digitizing menu availability with real-time updates.

## User Stories Completed

### Bronze — User Experience
Clean, modern interface for both customers (menu view) and staff (management dashboard).

### Silver — Authentication & Digital Operations
- Staff authentication (email/password login, protected dashboard route, logout)
- Live digital menu with real-time availability updates (no page refresh needed) using Supabase Realtime

### Gold — Restaurant Management
Staff dashboard allows:
- Viewing all dishes
- Toggling dish availability
- Adding new dishes directly from the dashboard

### Platinum — Intelligent Operations
Automatic operational insights banner showing real-time count of unavailable dishes, helping staff prioritize restocking.

### Bonus — Innovation
**"Notify Me" feature:** Customers can tap a button on out-of-stock dishes to register interest. Staff see a live count of interested customers per dish on their dashboard — turning a simple availability toggle into a genuine two-way communication tool between customers and kitchen, directly addressing the "delayed communication" problem from the challenge brief. The interest count automatically resets once the dish becomes available again.

## AI Usage
This project was built with the help of Claude (Anthropic) for:
- Step-by-step technical guidance (Next.js, Supabase setup, Git/GitHub workflow)
- Code generation for pages, database queries, and authentication logic
- Debugging assistance throughout development

## Hosted Application Link
https://smart-restaurant-ebon.vercel.app

## Repository
https://github.com/Priyanka-428/smart-restaurant