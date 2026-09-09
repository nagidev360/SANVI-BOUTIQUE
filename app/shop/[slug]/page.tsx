import Link from 'next/link'

const products:Record<string,{name:string;category:string;price:number;old:number;desc:string}>={
 'silk-saree':{name:'Pure Silk Saree',category:'Sarees',price:2499,old:3299,desc:'Elegant silk saree with premium finish, perfect for festive and wedding occasions.'},
 'designer-gown':{name:'Designer Evening Gown',category:'Gowns',price:3999,old:4999,desc:'Statement designer gown with a graceful silhouette for parties and special evenings.'},
 'embroidered-blouse':{name:'Embroidered Blouse',category:'Blouses',price:1299,old:1699,desc:'Detailed embroidered blouse designed to pair beautifully with sarees and lehengas.'},
 'baby-frock':{name:'Baby Girl Party Frock',category:'Kids',price:899,old:1199,desc:'Comfortable and adorable party frock for little girls.'},
 'designer-saree':{name:'Designer Party Saree',category:'Sarees',price:2899,old:3799,desc:'Contemporary party saree with premium designer detailing.'},
 'anarkali-suit':{name:'Premium Anarkali Suit',category:'Suits',price:2299,old:2999,desc:'Flowy Anarkali silhouette for festive and family occasions.'},
 'velvet-gown':{name:'Velvet Wedding Gown',category:'Gowns',price:4499,old:5999,desc:'Rich velvet gown made for glamorous wedding celebrations.'},
 'kids-lehenga':{name:'Kids Lehenga Choli',category:'Kids',price:1599,old:2099,desc:'Festive lehenga choli with a comfortable fit for kids.'}
}
export default async function Product({params}:{params:{slug:string}}){const p=products[params.slug];if(!p)return <main><section className="shop-head"><h1>Product not found</h1><Link className="cta" href="/shop">Back to Shop</Link></section></main>;return <main><header><Link className="brand" href="/">SANVI <span>BOUTIQUE</span></Link><nav><Link href="/shop">Shop</Link><Link href="/cart">🛍 Cart</Link></nav></header><section className="product-detail"><div className="detail-image">{p.category}</div><div><p className="eyebrow">{p.category}</p><h1>{p.name}</h1><p className="price">₹{p.price.toLocaleString('en-IN')} <del>₹{p.old.toLocaleString('en-IN')}</del></p><p>{p.desc}</p><div className="sizes"><b>Size</b><button>XS</button><button>S</button><button>M</button><button>L</button><button>XL</button></div><button className="buy">Add to Bag</button><button className="buy secondary">Buy Now</button><p className="shipping">✓ All India shipping &nbsp; ✓ Secure checkout &nbsp; ✓ Easy support</p></div></section><footer>© 2026 SANVI BOUTIQUE · All India Shipping · Secure Shopping</footer></main>}
