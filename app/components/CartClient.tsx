'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Item={slug:string;name:string;price:number;qty:number;size?:string}
export default function CartClient(){
 const [items,setItems]=useState<Item[]>([])
 useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem('sanvi-cart')||'[]'))}catch{setItems([])}},[])
 function save(next:Item[]){setItems(next);localStorage.setItem('sanvi-cart',JSON.stringify(next))}
 const total=items.reduce((s,i)=>s+i.price*i.qty,0); const shipping=total>1999||total===0?0:99
 if(!items.length)return <div className="cart-empty"><div className="bag-icon">🛍</div><h2>Your bag is empty</h2><p>Add products from SANVI BOUTIQUE to continue.</p><Link className="cta" href="/shop">Start Shopping →</Link></div>
 return <div className="cart-layout"><div>{items.map(i=><div className="cart-item" key={i.slug}><div className="cart-thumb">{i.name.split(' ')[0]}</div><div className="cart-info"><h3>{i.name}</h3><p>₹{i.price.toLocaleString('en-IN')}</p>{i.size&&<small>Size: {i.size}</small>}<div className="qty"><button onClick={()=>save(items.map(x=>x.slug===i.slug?{...x,qty:Math.max(1,x.qty-1)}:x))}>−</button><b>{i.qty}</b><button onClick={()=>save(items.map(x=>x.slug===i.slug?{...x,qty:x.qty+1}:x))}>+</button><button className="remove" onClick={()=>save(items.filter(x=>x.slug!==i.slug))}>Remove</button></div></div></div>)}</div><aside className="summary"><h2>Order Summary</h2><p>Subtotal <b>₹{total.toLocaleString('en-IN')}</b></p><p>Shipping <b>{shipping?'₹99':'FREE'}</b></p><hr/><p className="grand">Total <b>₹{(total+shipping).toLocaleString('en-IN')}</b></p><Link className="cta checkout-btn" href="/checkout">Proceed to Checkout →</Link></aside></div>
}