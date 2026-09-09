'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

declare global { interface Window { Razorpay?: any } }

export default function Checkout() {
 const [total, setTotal] = useState(0); const [loading, setLoading] = useState(false)
 useEffect(() => { try { const x = JSON.parse(localStorage.getItem('sanvi-cart') || '[]'); setTotal(x.reduce((s: number, i: any) => s + Number(i.price) * Number(i.qty), 0)) } catch {} }, [])
 async function loadRazorpay() {
  if (window.Razorpay) return true
  return await new Promise<boolean>((resolve) => { const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = () => resolve(true); s.onerror = () => resolve(false); document.body.appendChild(s) })
 }
 async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault(); setLoading(true)
  try {
   const fd = new FormData(e.currentTarget); const cart = JSON.parse(localStorage.getItem('sanvi-cart') || '[]'); const payment = String(fd.get('payment'))
   const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: { name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), address: fd.get('address'), city: fd.get('city'), state: fd.get('state'), pincode: fd.get('pincode') }, items: cart, paymentMethod: payment }) })
   const data = await r.json(); if (!r.ok || !data.orderId) throw new Error(data.error || 'Order failed')
   if (payment === 'cod') { localStorage.removeItem('sanvi-cart'); window.location.href = '/order-success?id=' + data.orderId; return }
   const ready = await loadRazorpay(); if (!ready) throw new Error('Razorpay checkout could not load. Please try again.')
   const options = { key: data.keyId, amount: data.amount, currency: data.currency, name: 'SANVI BOUTIQUE', description: 'Boutique Order', order_id: data.razorpayOrderId,
    prefill: { name: fd.get('name'), email: fd.get('email'), contact: fd.get('phone') }, theme: { color: '#111111' },
    handler: async (response: any) => {
     try {
      const vr = await fetch('/api/payments/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: data.orderId, razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature }) })
      const vd = await vr.json(); if (!vr.ok || !vd.ok) throw new Error(vd.error || 'Payment verification failed')
      localStorage.removeItem('sanvi-cart'); window.location.href = '/order-success?id=' + data.orderId
     } catch (err: any) { alert(err.message || 'Payment verification failed. Please contact support.'); setLoading(false) }
    }, modal: { ondismiss: () => setLoading(false) }
   }
   const razorpay = new window.Razorpay(options); razorpay.on('payment.failed', (response: any) => { alert(response?.error?.description || 'Payment failed. Please try again.'); setLoading(false) }); razorpay.open()
  } catch (err: any) { alert(err.message || 'Unable to place order'); setLoading(false) }
 }
 return <main><header><Link className="brand" href="/">SANVI <span>BOUTIQUE</span></Link><nav><Link href="/cart">← Cart</Link></nav></header><section className="checkout"><div><p className="eyebrow">SECURE CHECKOUT</p><h1>Complete Your Order</h1><form onSubmit={placeOrder} className="checkout-form"><input name="name" placeholder="Full Name" required/><input name="email" type="email" placeholder="Email Address" required/><input name="phone" placeholder="Mobile Number" required/><textarea name="address" placeholder="Full Delivery Address" required/><div className="two"><input name="city" placeholder="City" required/><input name="state" placeholder="State" required/></div><input name="pincode" placeholder="PIN Code" pattern="[0-9]{6}" required/><h3>Payment Method</h3><label className="payment"><input type="radio" name="payment" value="cod" defaultChecked/> Cash on Delivery</label><label className="payment"><input type="radio" name="payment" value="razorpay"/> Online Payment (Razorpay)</label><button className="cta" disabled={loading}>{loading?'Processing...':'Place Order →'}</button></form></div><aside className="summary"><h2>Order Total</h2><p>Products <b>₹{total.toLocaleString('en-IN')}</b></p><p>Shipping <b>{total>1999?'FREE':'₹99'}</b></p><hr/><p className="grand">Payable <b>₹{(total+(total>1999?0:99)).toLocaleString('en-IN')}</b></p></aside></section><footer>© 2026 SANVI BOUTIQUE · Secure Shopping</footer></main>
}
