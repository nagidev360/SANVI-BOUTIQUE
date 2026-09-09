import Link from 'next/link'

const products = [
  {slug:'silk-saree',name:'Pure Silk Saree',category:'Sarees',price:2499,old:3299},
  {slug:'designer-gown',name:'Designer Evening Gown',category:'Gowns',price:3999,old:4999},
  {slug:'embroidered-blouse',name:'Embroidered Blouse',category:'Blouses',price:1299,old:1699},
  {slug:'baby-frock',name:'Baby Girl Party Frock',category:'Kids',price:899,old:1199},
  {slug:'designer-saree',name:'Designer Party Saree',category:'Sarees',price:2899,old:3799},
  {slug:'anarkali-suit',name:'Premium Anarkali Suit',category:'Suits',price:2299,old:2999},
  {slug:'velvet-gown',name:'Velvet Wedding Gown',category:'Gowns',price:4499,old:5999},
  {slug:'kids-lehenga',name:'Kids Lehenga Choli',category:'Kids',price:1599,old:2099},
]

export default function Shop(){return <main><header><Link className="brand" href="/">SANVI <span>BOUTIQUE</span></Link><nav><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link><Link className="cart-link" href="/cart">🛍 Cart</Link></nav></header><section className="shop-head"><p className="eyebrow">SANVI BOUTIQUE</p><h1>Shop the Collection</h1><p>Designer sarees, gowns, blouses, suits and kids fashion — delivered across India.</p></section><div className="filters"><button>All</button><button>Sarees</button><button>Gowns</button><button>Blouses</button><button>Kids</button><button>Suits</button></div><section className="grid shop-grid">{products.map(p=><article className="product" key={p.slug}><Link href={`/shop/${p.slug}`}><div className="photo">{p.category}</div><h3>{p.name}</h3></Link><small>{p.category}</small><p><b>₹{p.price.toLocaleString('en-IN')}</b> <del>₹{p.old.toLocaleString('en-IN')}</del></p><Link className="cta small-cta" href={`/shop/${p.slug}`}>View Product →</Link></article>)}</section><footer>© 2026 SANVI BOUTIQUE · All India Shipping · Secure Shopping</footer></main>}
