// TODO: Configure Better-Auth catch-all handler
// import { auth } from '@/lib/auth';
// export const { GET, POST } = auth.handler;

export async function GET() {
  return Response.json({ message: 'Auth endpoint — configure Better-Auth here' });
}

export async function POST() {
  return Response.json({ message: 'Auth endpoint — configure Better-Auth here' });
}
