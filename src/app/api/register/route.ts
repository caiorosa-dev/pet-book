import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 },
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 },
    )
  }
}
