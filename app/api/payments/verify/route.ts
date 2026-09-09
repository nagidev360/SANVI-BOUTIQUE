import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 })
    }
    const supabase = await createClient()
    const authResult = await supabase.auth.getClaims()
    const userId = authResult.data?.claims?.sub
    const authError = authResult.error
    if (authError || !userId) return NextResponse.json({ error: 'Please login before payment.' }, { status: 401 })

    const { data: order, error: orderError } = await supabase.from('orders').select('id,user_id,razorpay_order_id').eq('id', orderId).eq('user_id', userId).single()
    if (orderError || !order || order.razorpay_order_id !== razorpayOrderId) {
      return NextResponse.json({ error: 'Order verification failed.' }, { status: 400 })
    }
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex')
    if (expected !== razorpaySignature) return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 })

    const { error: updateError } = await supabase.from('orders').update({ status: 'paid', razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature }).eq('id', orderId).eq('user_id', userId)
    if (updateError) throw updateError
    return NextResponse.json({ ok: true, orderId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Unable to verify payment right now.' }, { status: 500 })
  }
}
