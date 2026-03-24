import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, role } = await req.json();
        
        const client = await clerkClient();
        
        // Create invitation with role in publicMetadata
        await client.invitations.createInvitation({
            emailAddress: email,
            publicMetadata: {
                role: role
            },
            ignoreExisting: true
        });

        return NextResponse.json({ success: true, message: `Invitation sent to ${email} as ${role}` });
    } catch (e: any) {
        console.error('Clerk Invitation Error:', e);
        return NextResponse.json({ 
            error: e.message || 'Failed to send invitation',
            details: e.errors 
        }, { status: 500 });
    }
}
