import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function POST(req:Request){try{
 const body=await req.json(); const c=body.customer; const items=Array.isArray(body.items)?body.items:[]
 if(!c?.name||!c?.email||!c?.phone||!c?.address||!c?.city||!c?.state||!c?.pincode||!items.length)return NextResponse.json({error:'Please complete all checkout details.'},{status:400})
 const subtotal=items.reduce((s:number,i:any)=>s+Number(i.price)*Number(i.qty),0); const shipping=subtotal>1999?0:99; const total=subtotal+shipping
 const supabase=await createClient(); const {data:{claims}}=await supabase.auth.getClaims(); const userId=claims?.sub??null
 const {data:order,error}=await supabase.from('orders').insert({user_id:userId,status:'pending',total,shipping_address:{name:c.name,email:c.email,phone:c.phone,address:c.address,city:c.city,state:c.state,pincode:c.pincode}}).select('id').single()
 if(error)throw error
 const rows=items.map((i:any)=>({order_id:order.id,product_id:null,quantity:Number(i.qty),unit_price:Number(i.price)})); const {error:itemError}=await supabase.from('order_items').insert(rows); if(itemError)throw itemError
 if(body.paymentMethod==='razorpay' && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET){
  const Razorpay=(await import('razorpay')).default; const razorpay=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET}); const rp=await razorpay.orders.create({amount:total*100,currency:'INR',receipt:order.id}); await supabase.from('orders').update({status:'payment_pending'}).eq('id',order.id); return NextResponse.json({orderId:order.id,razorpayOrderId:rp.id,keyId:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID})
 }
 return NextResponse.json({orderId:order.id})
}catch(e){console.error(e);return NextResponse.json({error:'Unable to place order right now.'},{status:500})}}
