import dbConnect from '@/lib/db.js';
import User from '@/lib/models/User.js';
import Item from '@/lib/models/Item.js';
import Offer from '@/lib/models/Offer.js';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  
  try {
    // Try to find or create a test user to ensure collection exists
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        isBanned: false,
        warningCount: 0
      });
    }

    // Create Item if needed
    let item = await Item.findOne({ sellerId: user._id });
    if (!item) {
        item = await Item.create({
            sellerId: user._id,
            title: 'Test Item',
            description: 'This is a test item to initialize the collection',
            price: 100,
            status: 'Active',
            images: [],
            category: 'General'
        });
    }

    return NextResponse.json({ 
        status: 'Database Connected & Seeded', 
        message: 'Collections for User, Item, and Offer (via potential relationship) should now exist.',
        user, 
        item 
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ status: 'Error', error: error.message }, { status: 500 });
  }
}
