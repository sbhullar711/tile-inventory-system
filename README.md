# Tile Inventory Management System

A modern, password-protected web application for managing tile inventory with box-based tracking and real-time updates.

## Features

- **🔐 Password Protection** - Simple login system to secure your inventory
- **➕ Add Tiles** - Add new tile types with images, sizes, square footage, and location
- **➖ Remove Tiles** - Remove tiles by box quantities when sold
- **✏️ Update Inventory** - Update existing tile details and quantities
- **👁️ View All Tiles** - Display complete inventory with images and stats
- **📊 Dashboard Stats** - Real-time overview of total tile types, boxes, and square footage
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (React 18, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Backend**: Supabase (Authentication, Real-time updates)
- **Icons**: Lucide React
- **Hosting**: Vercel (Frontend) + Supabase (Database)
- **Version Control**: Git + GitHub

## Database Schema

- **Tiles Table**: ID, Name, Picture URL, Size, Sq Ft per Box, Total Boxes, Location, Timestamps
- **Box-based Operations**: All inventory changes tracked by box quantities
- **Real-time Updates**: Automatic UI refresh on data changes

## Architecture

- **Client-side React App** with TypeScript for type safety
- **Supabase PostgreSQL** database with Row Level Security
- **Real-time subscriptions** for live inventory updates
- **Environment-based configuration** for secure deployment
- **Responsive grid layouts** optimized for inventory management

Built for efficient tile inventory management with modern web technologies.