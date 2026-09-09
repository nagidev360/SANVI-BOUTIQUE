import Link from 'next/link'
import CartClient from '../components/CartClient'
export default function Cart(){return <main><header><Link className="brand" href="/">SANVI <span>BOUTIQUE</span></Link><nav><Link href="/shop">Continue Shopping</Link></nav></header><section className="cart-page"><p className="eyebrow">YOUR BAG</p><h1>Shopping Cart</h1><CartClient/></section><footer>© 2026 SANVI BOUTIQUE · All India Shipping · Secure Shopping</footer></main>}
